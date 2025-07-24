import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function handleRedirects(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip redirect handling for admin, api, and static files
  if (pathname.startsWith('/admin') || 
      pathname.startsWith('/api') || 
      pathname.startsWith('/_next') ||
      pathname.includes('.')) {
    return NextResponse.next()
  }


  // Extract slug and content type from pathname
  const blogMatch = pathname.match(/^\/travel-guide\/([^\/]+)$/)
  const experienceMatch = pathname.match(/^\/experience\/([^\/]+)$/)
  const tourMatch = pathname.match(/^\/tour\/([^\/]+)$/)
  const categoryMatch = pathname.match(/^\/category\/([^\/]+)$/)

  if (!blogMatch && !experienceMatch && !tourMatch && !categoryMatch) {
    return NextResponse.next()
  }

  const slug = blogMatch?.[1] || experienceMatch?.[1] || tourMatch?.[1] || categoryMatch?.[1]
  const contentType = blogMatch ? 'blog_posts' : (experienceMatch || tourMatch) ? 'experiences' : 'categories'

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Check if this slug exists as a redirect
    const { data: redirect } = await supabase
      .from('slug_redirects')
      .select('new_slug, permanent')
      .eq('old_slug', slug)
      .eq('content_type', contentType)
      .single()

    if (redirect) {
      // Create redirect URL
      const baseUrl = blogMatch ? '/travel-guide' : (experienceMatch || tourMatch) ? (tourMatch ? '/tour' : '/experience') : '/category'
      const redirectUrl = `${baseUrl}/${redirect.new_slug}`
      
      // Return appropriate redirect
      return NextResponse.redirect(
        new URL(redirectUrl, request.url), 
        redirect.permanent ? 301 : 302
      )
    }

    // No redirect found, continue normally
    return NextResponse.next()
  } catch (error) {
    console.error('Error checking for redirects:', error)
    return NextResponse.next()
  }
}