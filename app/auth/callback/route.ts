import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (!code) {
      // If no code is present, redirect to login page with an error
      console.error("No code provided in authentication callback");
      return NextResponse.redirect(
        new URL('/login?error=missing_code', requestUrl.origin)
      );
    }

    // Set up Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      console.error("Failed to exchange code for session:", error?.message);
      return NextResponse.redirect(
        new URL('/login?error=auth_failed', requestUrl.origin)
      );
    }

    // Session successfully established, redirect to calendar page
    console.log("Authentication successful, redirecting to calendar");
    return NextResponse.redirect(new URL('/calendar', requestUrl.origin));
  } catch (err) {
    // Handle unexpected errors
    console.error("Unexpected error in auth callback:", err);
    const requestUrl = new URL(request.url);
    return NextResponse.redirect(
      new URL('/login?error=server_error', requestUrl.origin)
    );
  }
}
