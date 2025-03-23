"use client";

import { useSearchParams } from "next/navigation";
import LoginPage from "./LoginPage";

export default function LoginPageWrapper() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') === 'sign_up' ? 'sign_up' : 'sign_in';
  
  return <LoginPage initialView={view} />;
}
