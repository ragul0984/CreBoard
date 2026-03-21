import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/src/utils/supabase/middleware'
import { createClient } from '@/src/utils/supabase/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Refresh session
  const response = await updateSession(request)

  // 2. Check auth for protected routes
  // We protect /dashboard and all /deals, /revenue, /payments, /analytics, /planner, /crm routes
  const protectedRoutes = ['/dashboard', '/deals', '/revenue', '/payments', '/analytics', '/planner', '/crm']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Not logged in, redirect to login page
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
