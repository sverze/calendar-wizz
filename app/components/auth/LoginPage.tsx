"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { FiCalendar, FiArrowLeft } from "react-icons/fi";

type LoginPageProps = {
  initialView?: "sign_in" | "sign_up";
};

export default function LoginPage({ initialView = "sign_in" }: LoginPageProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [view, setView] = useState<"sign_in" | "sign_up">(initialView);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/calendar');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <FiCalendar className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {view === "sign_in" ? "Sign in to CalendarWizz" : "Join CalendarWizz"}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {view === "sign_in"
              ? "Enter your details to access your calendar"
              : "Sign up to start organizing your schedule"}
          </p>
          <button 
            onClick={() => router.push('/')}
            className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-1" /> Back to home
          </button>
        </div>

        <div className="mt-8">
          <Auth
            supabaseClient={supabase}
            view={view}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#4f46e5",
                    brandAccent: "#4338ca",
                  },
                },
              },
              className: {
                button: "w-full",
                container: "w-full",
                label: "text-gray-700 dark:text-gray-300",
                input: "rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white",
              },
            }}
            providers={["google", "github"]}
            redirectTo={`${window.location.origin}/auth/callback`}
          />
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setView(view === "sign_in" ? "sign_up" : "sign_in")}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {view === "sign_in"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
