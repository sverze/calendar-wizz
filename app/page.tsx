"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./components/auth/AuthProvider";
import Calendar from "./components/calendar/Calendar";
import LoginPage from "./components/auth/LoginPage";
import LandingPage from "./components/LandingPage";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect authenticated users to the dedicated calendar page
  // instead of rendering the Calendar component directly
  useEffect(() => {
    if (user) {
      router.push('/calendar');
    }
  }, [user, router]);

  // If we have a user but haven't redirected yet, show loading spinner
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <LandingPage />;
}
