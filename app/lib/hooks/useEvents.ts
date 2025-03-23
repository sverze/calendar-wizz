"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient, getSupabaseApiConfig } from "../supabase";

export type Event = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  created_at: string;
};

export function useEvents(userId?: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const fetchEvents = useCallback(async () => {
    if (!userId) {
      setEvents([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Fetching events for user:", userId);
      
      // Use the Supabase client for fetching (this automatically includes auth headers)
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", userId)
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }
      
      console.log("Events fetched successfully:", data?.length || 0);
      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [userId, supabase]);

  const createEvent = async (eventData: Omit<Event, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .insert(eventData)
        .select()
        .single();

      if (error) throw error;
      
      // Optimistically update the local state
      setEvents(prev => [...prev, data]);
      
      // Refresh events to ensure we have the latest data
      fetchEvents();
      
      return data;
    } catch (err) {
      console.error("Error creating event:", err);
      throw err;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Omit<Event, "id" | "user_id" | "created_at">>) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      
      // Update the local state
      setEvents(prev => prev.map(event => event.id === id ? data : event));
      
      // Refresh events to ensure we have the latest data
      fetchEvents();
      
      return data;
    } catch (err) {
      console.error("Error updating event:", err);
      throw err;
    }
  };
  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;
      
      // Update the local state
      setEvents(prev => prev.filter(event => event.id !== id));
      
      // Refresh events to ensure we have the latest data
      fetchEvents();
      
      return true;
    } catch (err) {
      console.error("Error deleting event:", err);
      throw err;
    }
  };

  useEffect(() => {
    // Initial fetch of events
    fetchEvents();

    // Set up real-time subscription
    if (userId) {
      const channel = supabase
        .channel("events-changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "events",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log("Real-time INSERT event received:", payload.new);
            setEvents(prev => [...prev, payload.new as Event]);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "events",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log("Real-time UPDATE event received:", payload.new);
            setEvents(prev => 
              prev.map(event => event.id === payload.new.id ? payload.new as Event : event)
            );
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "events",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log("Real-time DELETE event received:", payload.old);
            setEvents(prev => 
              prev.filter(event => event.id !== payload.old.id)
            );
          }
        )
        .subscribe((status) => {
          console.log("Subscription status:", status);
        });

      return () => {
        console.log("Cleaning up Supabase channel");
        supabase.removeChannel(channel);
      };
    }
  }, [userId, supabase, fetchEvents]);

  return { 
    events, 
    isLoading, 
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: fetchEvents
  };
}
