import SupabaseTest from "../components/SupabaseTest";

export default function TestSupabasePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Supabase Connection Test</h1>
        <SupabaseTest />
      </div>
    </div>
  );
}
