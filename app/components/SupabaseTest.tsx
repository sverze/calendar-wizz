"use client";

import { useState } from "react";
import { testSupabaseConnection } from "../lib/test-supabase";

export default function SupabaseTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const testResult = await testSupabaseConnection();
      setResult(testResult);
      
      if (!testResult.success) {
        setError("Connection failed. See console for details.");
      }
    } catch (err) {
      console.error("Test error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Supabase Connection Test</h2>
      
      <button
        onClick={handleTestConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Connection"}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      {result && !error && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
          Connection successful!
        </div>
      )}
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Check the browser console for detailed results.
        </p>
      </div>
    </div>
  );
}
