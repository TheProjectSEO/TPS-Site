import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  published_at: string | null
  read_time_minutes: number | null
  featured: boolean | null
  view_count: number | null
  created_at: string | null
  blog_categories?: {
    name: string
  } | null
}

interface BlogCategory {
  id: string
  name: string
  slug: string
}

// Server-side function to fetch blog posts
async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()
  
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories(name)
      `)
      .eq('published', true)
      .order('published_at', { ascending: false })

    return data || []
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

// Server-side function to fetch blog categories
async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = await createClient()
  
  try {
    const { data } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')

    return data || []
  } catch (error) {
    console.error('Error fetching blog categories:', error)
    return []
  }
}

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Travel Stories & Guides - TPS Site Blog',
  description: 'Discover insider tips, hidden gems, and inspiring stories from travelers around the world. Get the best travel guides and destination insights.',
  keywords: 'travel blog, travel guides, destination tips, travel stories, TPS Site, New Zealand travel',
  openGraph: {
    title: 'Travel Stories & Guides - TPS Site Blog',
    description: 'Discover insider tips, hidden gems, and inspiring stories from travelers around the world.',
    type: 'website',
    siteName: 'TPS Site',
    images: [{
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop',
      alt: 'Travel Stories & Guides'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Stories & Guides - TPS Site Blog',
    description: 'Discover insider tips, hidden gems, and inspiring stories from travelers around the world.',
    images: [{
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop',
      alt: 'Travel Stories & Guides'
    }]
  }
}

export default async function BlogPage() {
  const [blogPosts, categories] = await Promise.all([
    getBlogPosts(),
    getBlogCategories()
  ])

  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white py-16 overflow-hidden">
        {/* Brand gradient background */}
        <div className="absolute inset-0 hero-gradient opacity-95" />
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="hero-text text-4xl lg:text-6xl font-bold mb-6 text-white">
            Travel Stories & Guides
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto text-white/90 font-medium">
            Discover insider tips, hidden gems, and inspiring stories from travelers around the world
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-primary">Featured Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="card-brand group cursor-pointer overflow-hidden">
                  <Link href={`/travel-guide/${post.slug}`}>
                    <div className="relative overflow-hidden h-64">
                      <Image
                        src={post.featured_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-gradient-primary text-white shadow-brand-sm">
                        Featured
                      </Badge>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <Badge variant="secondary" className="mb-3">
                          {post.blog_categories?.name || 'General'}
                        </Badge>
                        <h3 className="font-bold mb-2 text-xl">
                          {post.title}
                        </h3>
                        <p className="text-gray-200 mb-3 line-clamp-2">
                          {post.excerpt || 'No excerpt available'}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-300">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.published_at || post.created_at || new Date()).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.read_time_minutes || 5} min read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                className="hover:bg-primary hover:text-white"
                asChild
              >
                <Link href={`/travel-guide/category/${category.slug}`}>
                  {category.name}
                </Link>
              </Button>
            ))}
          </div>
        </section>

        {/* All Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-primary">Latest Stories</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Card key={post.id} className="card-brand group cursor-pointer overflow-hidden">
                <Link href={`/travel-guide/${post.slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.featured_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-3">
                      {post.blog_categories?.name || 'General'}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt || 'No excerpt available'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-medium shadow-brand-sm">
                          AA
                        </div>
                        <div>
                          <p className="text-sm font-medium">Aditya Aman</p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.published_at || post.created_at || new Date()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.read_time_minutes || 5} min
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-primary">Stay in the loop</h3>
          <p className="text-secondary mb-6 max-w-2xl mx-auto font-medium">
            Get the latest travel stories, destination guides, and insider tips delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>
              Subscribe
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}