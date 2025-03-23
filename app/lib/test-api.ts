import { getSupabaseApiConfig } from "./supabase";

export async function testSupabaseRestApi(userId: string) {
  const { apiUrl, apiKey, headers } = getSupabaseApiConfig();
  
  // Log the request details for debugging
  console.log("Making REST API request with:");
  const url = `${apiUrl}/rest/v1/events?select=*&user_id=eq.${userId}&order=start_time.asc&apikey=${apiKey}`;
  console.log("URL:", url);
  console.log("Headers:", JSON.stringify(headers, null, 2));
  
  const response = await fetch(
    url,
    { 
      method: 'GET',
      headers 
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data = await response.json();
  console.log("API test successful, received data:", data);
  return { success: true, data };
}
