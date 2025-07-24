'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  FileText, 
  Package, 
  Users, 
  MessageSquare, 
  Settings,
  BarChart3,
  LogOut,
  Link as LinkIcon,
  Bot,
  Star,
  Upload
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('Auth error:', error)
          // For development, allow access even if auth fails
          if (process.env.NODE_ENV === 'development') {
            setUser(null) // Set to null but don't redirect
            setLoading(false)
            return
          }
        }
        
        setUser(user)
        setLoading(false)
        
        // Only redirect to auth if we're in production and no user
        if (!user && process.env.NODE_ENV === 'production') {
          router.push('/auth')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        // For development, continue anyway
        if (process.env.NODE_ENV === 'development') {
          setUser(null)
          setLoading(false)
        } else {
          router.push('/auth')
        }
      }
    }

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Auth check taking too long, allowing access...')
      setLoading(false)
    }, 5000)

    getUser()

    return () => clearTimeout(timeout)
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Homepage', href: '/admin/homepage-unified', icon: Home },
    { name: 'Travel Guide', href: '/admin/travel-guide', icon: FileText },
    { name: 'Tours', href: '/admin/experiences', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Settings },
    { name: 'Bulk Upload', href: '/admin/bulk-upload', icon: Upload },
    { name: 'FAQs', href: '/admin/faqs', icon: MessageSquare },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Internal Links', href: '/admin/internal-links', icon: LinkIcon },
    { name: 'URL Redirects', href: '/admin/redirects', icon: LinkIcon },
    { name: 'Page Schemas', href: '/admin/homepage-schemas', icon: Settings },
    { name: 'Robots.txt', href: '/admin/robots', icon: Bot },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">TPS Site Admin</h1>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.email || 'Guest User'}
              </p>
              <p className="text-xs text-gray-500">
                {user ? 'Authenticated' : 'Demo Mode'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 min-h-screen overflow-x-hidden">
        <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
          <h2 className="text-2xl font-semibold text-gray-900">Content Management</h2>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20"
          >
            View Site
          </Link>
        </div>
        
        <main className="p-8 overflow-x-hidden">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}