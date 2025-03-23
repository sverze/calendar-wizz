import { getSupabaseApiConfig } from "./supabase";
import { Event } from "./hooks/useEvents";

// A client for making direct REST API calls to Supabase
export class SupabaseDirectClient {
  private apiUrl: string;
  private apiKey: string;
  private headers: Record<string, string>;

  constructor() {
    const config = getSupabaseApiConfig();
    this.apiUrl = config.apiUrl || '';
    this.apiKey = config.apiKey || '';
    this.headers = config.headers;
  }

  // Fetch events for a user
  async getEvents(userId: string): Promise<Event[]> {
    try {
      // Ensure userId is properly formatted for the query
      const sanitizedUserId = userId.trim();
      const url = `${this.apiUrl}/rest/v1/events?select=*&user_id=eq.${sanitizedUserId}&order=start_time.asc&apikey=${this.apiKey}`;
      
      console.log("Making direct API request to:", url);
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  // Create a new event
  async createEvent(eventData: Omit<Event, "id" | "created_at">): Promise<Event> {
    try {
      const url = `${this.apiUrl}/rest/v1/events?apikey=${this.apiKey}`;
      
      console.log("Creating event with data:", JSON.stringify(eventData, null, 2));
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  // Update an event
  async updateEvent(
    id: string, 
    userId: string,
    updates: Partial<Omit<Event, "id" | "user_id" | "created_at">>
  ): Promise<Event> {
    try {
      const url = `${this.apiUrl}/rest/v1/events?id=eq.${id}&user_id=eq.${userId}&apikey=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      // Get the updated record
      const getResponse = await fetch(
        `${this.apiUrl}/rest/v1/events?id=eq.${id}&apikey=${this.apiKey}`,
        { headers: this.headers }
      );
      
      if (!getResponse.ok) {
        throw new Error(`Failed to get updated event: ${getResponse.status}`);
      }
      
      const data = await getResponse.json();
      return data[0];
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  // Delete an event
  async deleteEvent(id: string, userId: string): Promise<boolean> {
    try {
      const url = `${this.apiUrl}/rest/v1/events?id=eq.${id}&user_id=eq.${userId}&apikey=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.headers
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const directApi = new SupabaseDirectClient();
