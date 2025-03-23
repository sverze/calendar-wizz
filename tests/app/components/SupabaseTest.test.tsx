import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SupabaseTest from '../../../app/components/SupabaseTest';
import { testSupabaseConnection } from '../../../app/lib/test-supabase';

// Mock the test function
jest.mock('../../../app/lib/test-supabase', () => ({
  testSupabaseConnection: jest.fn(),
}));

describe('SupabaseTest Component', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  it('renders the test button', () => {
    render(<SupabaseTest />);
    expect(screen.getByText('Test Connection')).toBeInTheDocument();
  });

  it('shows loading state when testing connection', async () => {
    // Setup the mock to delay resolution
    (testSupabaseConnection as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 100);
      });
    });
    
    render(<SupabaseTest />);
    
    // Click the test button
    fireEvent.click(screen.getByText('Test Connection'));
    
    // Check for loading state
    expect(screen.getByText('Testing...')).toBeInTheDocument();
    
    // Wait for the test to complete
    await waitFor(() => {
      expect(screen.getByText('Connection successful!')).toBeInTheDocument();
    });
  });

  it('shows success message when connection is successful', async () => {
    // Setup the mock to return success
    (testSupabaseConnection as jest.Mock).mockResolvedValue({ success: true });
    
    render(<SupabaseTest />);
    
    // Click the test button
    fireEvent.click(screen.getByText('Test Connection'));
    
    // Wait for the success message
    await waitFor(() => {
      expect(screen.getByText('Connection successful!')).toBeInTheDocument();
    });
  });

  it('shows error message when connection fails', async () => {
    // Setup the mock to return an error
    (testSupabaseConnection as jest.Mock).mockResolvedValue({ 
      success: false, 
      error: { message: 'Connection failed' } 
    });
    
    render(<SupabaseTest />);
    
    // Click the test button
    fireEvent.click(screen.getByText('Test Connection'));
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText('Connection failed. See console for details.')).toBeInTheDocument();
    });
  });

  it('handles unexpected errors', async () => {
    // Setup the mock to throw an error
    const errorMessage = 'Unexpected error occurred';
    (testSupabaseConnection as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    render(<SupabaseTest />);
    
    // Click the test button
    fireEvent.click(screen.getByText('Test Connection'));
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
