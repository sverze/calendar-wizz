import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check auth status
  const { data: { session } } = await supabase.auth.getSession();
  
  const path = req.nextUrl.pathname;
  
  // If the user is not authenticated and trying to access a protected route
  if (!session && path.startsWith('/calendar')) {
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If the user is authenticated and trying to access login page
  if (session && path.startsWith('/login')) {
    const redirectUrl = new URL('/calendar', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}
