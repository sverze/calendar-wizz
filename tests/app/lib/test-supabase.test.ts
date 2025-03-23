import { testSupabaseConnection } from '../../../app/lib/test-supabase';
import { createClient } from '../../../app/lib/supabase';

// Mock the Supabase client
jest.mock('../../../app/lib/supabase', () => ({
  createClient: jest.fn(),
}));

describe('Test Supabase Connection', () => {
  // Mock Supabase client methods
  const mockSelect = jest.fn();
  const mockLimit = jest.fn();
  const mockFrom = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  it('returns success when connection is successful', async () => {
    // Setup the mock chain with proper Promise return
    mockSelect.mockReturnValue({ limit: mockLimit });
    mockLimit.mockReturnValue(Promise.resolve({ data: [{ count: 5 }], error: null }));
    mockFrom.mockReturnValue({ select: mockSelect });
    
    // Setup the Supabase client mock
    (createClient as jest.Mock).mockReturnValue({
      from: mockFrom,
    });
    
    // Call the function
    const result = await testSupabaseConnection();
    
    // Assertions
    expect(createClient).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith('events');
    expect(mockSelect).toHaveBeenCalledWith('count');
    expect(mockLimit).toHaveBeenCalledWith(1);
    expect(result).toEqual({ success: true, data: [{ count: 5 }] });
  });

  it('returns error when connection fails', async () => {
    // Setup the mock chain with an error
    const mockError = { message: 'Connection failed', code: 'ERROR' };
    mockSelect.mockReturnValue({ limit: mockLimit });
    mockLimit.mockReturnValue(Promise.resolve({ data: null, error: mockError }));
    mockFrom.mockReturnValue({ select: mockSelect });
    
    // Setup the Supabase client mock
    (createClient as jest.Mock).mockReturnValue({
      from: mockFrom,
    });
    
    // Call the function
    const result = await testSupabaseConnection();
    
    // Assertions
    expect(createClient).toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: mockError });
  });

  it('handles unexpected errors', async () => {
    // Setup the mock to throw an error
    const unexpectedError = new Error('Unexpected error');
    
    // We're testing a different scenario now where the chain itself errors out
    // This simulates an error during the method chain execution
    mockFrom.mockImplementation(() => {
      throw unexpectedError;
    });
    
    // Setup the Supabase client mock
    (createClient as jest.Mock).mockReturnValue({
      from: mockFrom,
    });
    
    // Call the function
    const result = await testSupabaseConnection();
    
    // Assertions
    expect(createClient).toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: unexpectedError });
  });

  it('handles promise rejection in the chain', async () => {
    // Setup a test for promise rejection in the chain
    const rejectionError = new Error('Promise rejected');
    
    mockSelect.mockReturnValue({ limit: mockLimit });
    mockLimit.mockReturnValue(Promise.reject(rejectionError));
    mockFrom.mockReturnValue({ select: mockSelect });
    
    // Setup the Supabase client mock
    (createClient as jest.Mock).mockReturnValue({
      from: mockFrom,
    });
    
    // Call the function
    const result = await testSupabaseConnection();
    
    // Assertions
    expect(createClient).toHaveBeenCalled();
    expect(result).toEqual({ 
      success: false, 
      error: expect.objectContaining({ message: rejectionError.message }) 
    });
  });
});
