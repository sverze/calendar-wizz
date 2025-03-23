import { createClient } from "./supabase";

// This function can be used to test the Supabase connection
export async function testSupabaseConnection() {
  try {
    // Initialize the Supabase client
    const supabase = createClient();
    
    if (!supabase) {
      throw new Error("Failed to initialize Supabase client");
    }
    
    // Chain the Supabase operations properly and handle each step
    const query = supabase.from("events");
    
    if (!query) {
      throw new Error("Failed to create query from 'events' table");
    }
    
    const selectQuery = query.select("count");
    
    if (!selectQuery) {
      throw new Error("Failed to select 'count' from query");
    }
    
    const limitQuery = selectQuery.limit(1);
    
    if (!limitQuery) {
      throw new Error("Failed to apply limit to query");
    }
    
    // Execute the query and await the result
    const { data, error } = await limitQuery;
    
    // Handle Supabase-specific errors
    if (error) {
      console.error("Supabase connection error:", error);
      return { success: false, error };
    }
    
    // Log success and return data
    console.log("Supabase connection successful:", data);
    return { success: true, data };
  } catch (err) {
    // Handle unexpected errors with proper type checking
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Unexpected error testing Supabase connection:", err);
    return { 
      success: false, 
      error: err instanceof Error ? err : new Error(errorMessage)
    };
  }
}
