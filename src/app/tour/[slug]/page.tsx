import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Star, 
  Clock, 
  Users, 
  MapPin, 
  Check,
  X
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { StructuredData } from '@/components/seo/StructuredData'
import { InternalLinksSection } from '@/components/experience/InternalLinksSection'
import { FAQSection } from '@/components/tour/FAQSection'
import { BookingCard } from '@/components/tour/BookingCard'
import { ReviewsSection } from '@/components/reviews/ReviewsSection'
import { JumpLinksNav } from '@/components/tour/JumpLinksNav'
import { IncludesExcludesSection } from '@/components/tour/IncludesExcludesSection'
import { reviewsService } from '@/lib/supabase/reviewsService'
import type { Metadata } from 'next'

interface Product {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  price: number
  original_price: number
  currency: string
  duration: string
  duration_hours: number
  max_group_size: number
  min_age: number
  meeting_point: string
  cancellation_policy: string
  languages: string[]
  main_image_url: string
  featured: boolean
  bestseller: boolean
  status: string
  rating: number
  review_count: number
  booking_count: number
  sort_order: number
  product_id: string
  created_at: string
  updated_at: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  canonical_url?: string
  robots_index?: boolean
  robots_follow?: boolean
  robots_nosnippet?: boolean
  og_title?: string
  og_description?: string
  og_image?: string
  og_image_alt?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  twitter_image_alt?: string
  structured_data_type?: string
  focus_keyword?: string
  highlights?: string[]
  availability_url?: string
  cities?: { name: string }
  categories?: { name: string }
  custom_json_ld?: string
  structured_data_enabled?: boolean
  show_faqs?: boolean
  schema_mode?: 'default' | 'custom'
  custom_schema?: any
}

// Server-side function to fetch tour
async function getTour(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select(`
        *,
        cities:city_id(name),
        categories:category_id(name)
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching tour:', error)
    return null
  }
}

// Server-side function to get review stats
async function getReviewStats(productId: string, experienceId: string) {
  try {
    const stats = await reviewsService.getReviewStats('experience', experienceId, productId)
    return stats
  } catch (error) {
    console.error('Error fetching review stats:', error)
    return {
      total_reviews: 0,
      average_rating: 0,
      rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getTour(slug)
  
  if (!product) {
    return {
      title: 'Tour Not Found',
      description: 'The requested tour could not be found.'
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tps-site.com'
  const currentUrl = `${siteUrl}/tour/${product.slug}`
  const seoTitle = product.seo_title || `${product.title} - TPS Site`
  const seoDescription = product.seo_description || product.short_description || product.description.substring(0, 160)

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: product.seo_keywords || undefined,
    robots: {
      index: product.robots_index !== false,
      follow: product.robots_follow !== false,
      nosnippet: product.robots_nosnippet || false
    },
    openGraph: {
      title: product.og_title || seoTitle,
      description: product.og_description || seoDescription,
      images: product.og_image || product.main_image_url ? [{
        url: product.og_image || product.main_image_url,
        alt: product.og_image_alt || `${product.title} image`
      }] : undefined,
      type: 'website',
      url: currentUrl,
      siteName: 'TPS Site'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.twitter_title || product.og_title || seoTitle,
      description: product.twitter_description || product.og_description || seoDescription,
      images: product.twitter_image || product.og_image || product.main_image_url ? [{
        url: product.twitter_image || product.og_image || product.main_image_url,
        alt: product.twitter_image_alt || product.og_image_alt || `${product.title} image`
      }] : undefined
    },
    alternates: {
      canonical: product.canonical_url || currentUrl
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': product.currency,
      'product:availability': 'in_stock',
      'product:brand': 'TPS Site'
    }
  }
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getTour(slug)
  
  if (!product) {
    notFound()
  }

  // Get dynamic review stats
  const reviewStats = await getReviewStats(product.product_id, product.id)

  // Prepare structured data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tps-site.com'
  const currentUrl = `${siteUrl}/tour/${product.slug}`

  // Get highlights from product data or fallback to default
  const getHighlights = () => {
    if (product?.highlights && Array.isArray(product.highlights) && product.highlights.length > 0) {
      return product.highlights
    }
    return [
      'Professional guided experience',
      'Skip-the-line access where available',
      'Audio guide in multiple languages',
      'Small group experience',
      'Expert local knowledge',
      'Memorable photo opportunities'
    ]
  }

  return (
    <>
      {/* Structured Data */}
      <StructuredData
        type={(product.structured_data_type as any) || 'TouristAttraction'}
        data={{
          title: product.title,
          description: product.description,
          url: currentUrl,
          image_url: product.main_image_url,
          price: product.price,
          currency: product.currency,
          rating: reviewStats.average_rating,
          review_count: reviewStats.total_reviews,
          duration: product.duration,
          category: product.categories?.name,
          location: product.cities?.name,
          latitude: -44.6189,
          longitude: 167.9224,
          booking_url: product.availability_url
        }}
        customSchema={product.custom_schema}
        schemaMode={product.schema_mode || 'default'}
      />

      <div className="min-h-screen bg-gray-50">

        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href="/tours" className="hover:text-gray-900">Tours</Link>
            <span>/</span>
            <span className="text-gray-900">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Hero Image */}
              <div className="relative h-96 rounded-lg overflow-hidden mb-6">
                <Image
                  src={product.main_image_url}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
                {product.featured && (
                  <Badge className="absolute top-4 left-4 bg-gradient-primary text-white shadow-brand-sm">Featured</Badge>
                )}
                {product.bestseller && (
                  <Badge className="absolute top-4 right-4 bg-gradient-secondary text-white shadow-brand-sm">Bestseller</Badge>
                )}
              </div>

              {/* Title and Basic Info */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-highlight/10 text-primary border-primary/20 font-medium">
                    {product.categories?.name || 'Tours & Attractions'}
                  </Badge>
                  <Badge variant="outline">{product.cities?.name}</Badge>
                  {product.featured && (
                    <Badge variant="outline" className="bg-gradient-to-r from-primary/10 to-highlight/10 text-primary border-primary/20 font-medium">Featured</Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-accent mb-4">{product.title}</h1>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  {reviewStats.total_reviews > 0 && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                      <span className="font-medium">{reviewStats.average_rating.toFixed(1)}</span>
                      <span className="ml-1">({reviewStats.total_reviews} reviews)</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{product.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Up to {product.max_group_size} people</span>
                  </div>
                </div>

                <p className="text-gray-600 text-lg mb-6">{product.short_description}</p>
              </div>

              {/* Jump Links Navigation */}
              <div className="mb-8">
                <JumpLinksNav className="mb-8" />

                {/* Overview Section */}
                <section id="overview" className="scroll-mt-24 space-y-6 mb-12">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-secondary">About this tour</h2>
                    <div className="expandable-content group">
                      <input type="checkbox" id="description-toggle" className="peer hidden" />
                      <div className="text-gray-700 leading-relaxed space-y-4">
                        <div className="peer-checked:block md:block overflow-hidden transition-all duration-300 description-content">
                          {product.description.split('\n\n').length > 1 ? (
                            product.description.split('\n\n').map((paragraph, index) => (
                              <p key={index} className="mb-4">{paragraph.trim()}</p>
                            ))
                          ) : (
                            // If no double line breaks, split by sentences and group them
                            (() => {
                              const sentences = product.description.split(/(?<=[.!?])\s+/)
                              const midPoint = Math.ceil(sentences.length / 2)
                              const firstHalf = sentences.slice(0, midPoint).join(' ')
                              const secondHalf = sentences.slice(midPoint).join(' ')
                              
                              return (
                                <>
                                  <p className="mb-4">{firstHalf}</p>
                                  {secondHalf && <p className="mb-4">{secondHalf}</p>}
                                </>
                              )
                            })()
                          )}
                        </div>
                      </div>
                      <label 
                        htmlFor="description-toggle" 
                        className="md:hidden inline-flex items-center text-primary font-medium cursor-pointer mt-2 hover:text-primary/80 transition-colors peer-checked:hidden"
                      >
                        Show more
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </label>
                      <label 
                        htmlFor="description-toggle" 
                        className="md:hidden items-center text-primary font-medium cursor-pointer mt-2 hover:text-primary/80 transition-colors hidden peer-checked:inline-flex"
                      >
                        Show less
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-primary">Highlights</h3>
                    <div className="expandable-highlights group">
                      <input type="checkbox" id="highlights-toggle" className="peer hidden" />
                      <ul className="space-y-2">
                        {getHighlights().map((highlight, index) => (
                          <li 
                            key={index} 
                            className={`flex items-start ${
                              index >= 4 ? 'md:flex peer-checked:flex hidden' : 'flex'
                            }`}
                          >
                            <Check className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      {getHighlights().length > 4 && (
                        <>
                          <label 
                            htmlFor="highlights-toggle" 
                            className="md:hidden inline-flex items-center text-primary font-medium cursor-pointer mt-3 hover:text-primary/80 transition-colors peer-checked:hidden"
                          >
                            Show more highlights
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </label>
                          <label 
                            htmlFor="highlights-toggle" 
                            className="md:hidden items-center text-primary font-medium cursor-pointer mt-3 hover:text-primary/80 transition-colors hidden peer-checked:inline-flex"
                          >
                            Show fewer highlights
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </label>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-accent">Meeting point</h3>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{product.meeting_point}</span>
                    </div>
                  </div>
                </section>

                {/* Includes Section */}
                <section id="includes" className="scroll-mt-24 mb-12">
                  <IncludesExcludesSection 
                    experienceId={product.id}
                    className=""
                  />
                </section>

                {/* Reviews Section */}
                <section id="reviews" className="scroll-mt-24 mb-12">
                  <ReviewsSection
                    pageType="experience"
                    pageId={product.id}
                    productId={product.product_id}
                    title="Customer Reviews"
                    showRatingSummary={true}
                    className="mt-0"
                  />
                </section>

                {/* FAQ Section */}
                <section id="faqs" className="scroll-mt-24 mb-12">
                  <FAQSection 
                    experienceId={product.id} 
                    className="mt-0"
                  />
                </section>
              </div>

              {/* Internal Links Section */}
              <InternalLinksSection 
                experienceId={product.id} 
                className="mt-8"
              />
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <BookingCard 
                price={product.price}
                availabilityUrl={product.availability_url}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}