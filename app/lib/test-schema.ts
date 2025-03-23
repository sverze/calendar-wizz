import { createClient } from "./supabase";

export async function testSchema() {
  const supabase = createClient();
  
  // Test if the events table exists
  const { data, error } = await supabase
    .from('events')
    .select('id')
    .limit(1);
  
  if (error) {
    throw new Error(`Error accessing events table: ${error.message}`);
  }
  
  // Try to insert a test record with a valid UUID format
  const testEvent = {
    user_id: "00000000-0000-0000-0000-000000000000", // Valid UUID format for testing
    title: "Test Event",
    description: "This is a test event to verify schema",
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 3600000).toISOString()
  };
  
  const { data: insertData, error: insertError } = await supabase
    .from('events')
    .insert(testEvent)
    .select();
  
  if (insertError) {
    throw new Error(`Error inserting test event: ${insertError.message}`);
  }
  
  return {
    success: true,
    message: "Events table exists and is working correctly",
    testRecord: insertData
  };
}
