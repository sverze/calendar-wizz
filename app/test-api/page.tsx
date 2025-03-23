"use client";

import { useState } from "react";
import { testSupabaseRestApi } from "../lib/test-api";
import { directApi } from "../lib/direct-api";
import { testSchema } from "../lib/test-schema";

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("401c9efd-e050-4723-978c-3ddffa909b62");

  const runTest = async () => {
    setIsLoading(true);
    try {
      // Test the REST API
      const testResult = await testSupabaseRestApi(userId);
      
      // Test the direct API client
      const directApiResult = await directApi.getEvents(userId);
      
      setResult({
        success: true,
        message: "All tests passed successfully",
        restApiResult: testResult,
        directApiResult
      });
    } catch (error) {
      console.error("Test failed:", error);
      setResult({ 
        success: false, 
        message: "Test failed",
        error: error instanceof Error ? error.message : String(error) 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Supabase REST API Test</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <button
          onClick={runTest}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4"
        >
          {isLoading ? "Testing..." : "Test API Connection"}
        </button>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Create Test Event</h3>
          <button
            onClick={async () => {
              try {
                setIsLoading(true);
                const newEvent = await directApi.createEvent({
                  user_id: userId,
                  title: "Test Event " + new Date().toLocaleTimeString(),
                  description: "Created via direct API",
                  start_time: new Date().toISOString(),
                  end_time: new Date(Date.now() + 3600000).toISOString(),
                });
                setResult({ 
                  success: true, 
                  message: "Event created successfully",
                  createdEvent: newEvent 
                });
              } catch (error) {
                console.error("Failed to create event:", error);
                setResult({ 
                  success: false, 
                  message: "Failed to create event",
                  error: error instanceof Error ? error.message : String(error) 
                });
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Create Test Event
          </button>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Test Database Schema</h3>
          <button
            onClick={async () => {
              try {
                setIsLoading(true);
                const schemaResult = await testSchema();
                setResult({
                  success: true,
                  message: "Schema test passed",
                  schemaResult
                });
              } catch (error) {
                console.error("Schema test failed:", error);
                setResult({ 
                  success: false, 
                  message: "Schema test failed",
                  error: error instanceof Error ? error.message : String(error) 
                });
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
          >
            Test Schema
          </button>
        </div>
        
        {result && (
          <div className="mt-4 p-4 border rounded bg-white dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-2">
              {result.success ? "✅ Success" : "❌ Error"}
            </h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
