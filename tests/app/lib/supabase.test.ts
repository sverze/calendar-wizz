import { createClient } from '../../../app/lib/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Mock the Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

describe('Supabase Client', () => {
  it('creates a Supabase client', () => {
    // Setup mock
    const mockSupabaseClient = { from: jest.fn() };
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    
    // Call the function
    const client = createClient();
    
    // Assertions
    expect(createClientComponentClient).toHaveBeenCalled();
    expect(client).toBe(mockSupabaseClient);
  });
});
