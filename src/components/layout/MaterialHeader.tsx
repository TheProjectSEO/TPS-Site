'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryDropdown } from '@/components/navigation/CategoryDropdown'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase'

export function MaterialHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, loading } = useAuth()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  return (
    <header className="fixed top-0 z-50 w-full bg-white border-b border-gray-200" data-testid="material-header">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-black tracking-tight">Cuddly Nest</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <CategoryDropdown />
            <Link href="/tours" className="text-sm font-medium text-black hover:text-gray-600">
              Tours
            </Link>
            <Link href="/travel-guide" className="text-sm font-medium text-black hover:text-gray-600">
              Travel Guide
            </Link>
            <Link href="/cuddly-ai" className="text-sm font-medium text-black hover:text-gray-600 flex items-center gap-1">
              🤖 Cuddly AI
            </Link>
            <Link href="/about" className="text-sm font-medium text-black hover:text-gray-600">
              About
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center">
              {loading ? null : user ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="border-black text-black hover:bg-gray-50 text-sm font-semibold uppercase px-5 py-2 rounded-full border transition-all duration-300"
                >
                  SIGN OUT
                </Button>
              ) : null}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t pb-4 lg:hidden">
            <nav className="flex flex-col space-y-2 pt-4">
              <Link href="/tours" className="py-3 text-sm font-medium text-black hover:text-gray-600">
                Tours
              </Link>
              <Link href="/travel-guide" className="py-3 text-sm font-medium text-black hover:text-gray-600">
                Travel Guide
              </Link>
              <Link href="/cuddly-ai" className="py-3 text-sm font-medium text-black hover:text-gray-600 flex items-center gap-2">
                🤖 Cuddly AI
              </Link>
              <Link href="/about" className="py-3 text-sm font-medium text-black hover:text-gray-600">
                About
              </Link>
              
              <div className="pt-4 border-t">
                {loading ? null : user ? (
                  <>
                    <div className="py-2 text-sm font-medium text-gray-900">
                      {user.user_metadata?.full_name || user.email}
                    </div>
                    <Link href="/admin" className="py-3 text-sm font-medium text-black hover:text-gray-600">
                      Admin Dashboard
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="py-3 text-sm font-medium text-black hover:text-gray-600 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : null}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}