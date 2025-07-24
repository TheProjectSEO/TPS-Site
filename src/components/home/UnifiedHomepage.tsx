'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import { createClient } from '@/lib/supabase'
import { MaterialHeroSection } from '@/components/home/MaterialHeroSection'
import { StructuredData } from '@/components/seo/StructuredData'

// Lazy load below-the-fold components for better performance
const FeaturedCategories = lazy(() => import('@/components/home/FeaturedCategories').then(module => ({ default: module.FeaturedCategories })))
const FeaturedExperiences = lazy(() => import('@/components/home/FeaturedExperiences').then(module => ({ default: module.FeaturedExperiences })))
const TestimonialsSection = lazy(() => import('@/components/home/TestimonialsSection').then(module => ({ default: module.TestimonialsSection })))
const FAQSection = lazy(() => import('@/components/home/FAQSection').then(module => ({ default: module.FAQSection })))
const HomepageInternalLinksSection = lazy(() => import('@/components/home/HomepageInternalLinksSection').then(module => ({ default: module.HomepageInternalLinksSection })))
const ReviewsSection = lazy(() => import('@/components/reviews/ReviewsSection').then(module => ({ default: module.ReviewsSection })))

// Loading skeleton component for better UX
const SectionSkeleton = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`bg-gray-50 ${height} animate-pulse`}>
    <div className="container mx-auto px-4 py-16">
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

interface HomepageData {
  id: string
  page_title: string
  page_description: string
  
  // Hero Section
  hero_title: string
  hero_subtitle: string
  hero_description: string
  hero_button_text: string
  hero_button_link: string
  hero_background_image: string | null
  hero_enabled: boolean
  
  // Featured Categories Section
  featured_categories_enabled: boolean
  featured_categories_title: string
  featured_categories_subtitle: string
  featured_categories_section_title: string
  featured_categories_section_subtitle: string
  featured_categories_section_enabled: boolean
  
  // Featured Experiences Section
  featured_experiences_enabled: boolean
  featured_experiences_title: string
  featured_experiences_subtitle: string
  featured_experiences_description: string
  
  // Testimonials Section
  testimonials_enabled: boolean
  testimonials_title: string
  testimonials_subtitle: string
  
  // FAQ Section
  faq_section_enabled: boolean
  faq_section_title: string
  faq_section_subtitle: string
  
  // Internal Links Section
  internal_links_enabled: boolean
  internal_links_title: string
  internal_links_subtitle: string
  
  // Reviews Section
  reviews_enabled: boolean
  reviews_title: string
  reviews_subtitle: string
  reviews_product_id: string
  
  // Schema and SEO
  schema_mode: 'default' | 'custom'
  custom_schema: any
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
}

export function UnifiedHomepage() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomepageData()
  }, [])

  // Preload hero image for LCP optimization
  useEffect(() => {
    if (homepageData?.hero_background_image) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = homepageData.hero_background_image
      document.head.appendChild(link)
      
      return () => {
        document.head.removeChild(link)
      }
    }
  }, [homepageData?.hero_background_image])

  async function fetchHomepageData() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('homepage_unified')
        .select('*')
        .single()

      if (error) {
        console.error('Error fetching homepage data:', error)
        return
      }

      if (data) {
        setHomepageData(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading homepage...</p>
        </div>
      </div>
    )
  }

  if (!homepageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Homepage not configured</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Single Homepage Schema - Managed in CMS */}
      <StructuredData
        type="WebSite"
        data={{
          title: homepageData.page_title,
          description: homepageData.page_description,
          url: process.env.NEXT_PUBLIC_SITE_URL || 'https://tps-site.com',
          name: 'TPS Site',
          keywords: homepageData.seo_keywords
        }}
        customSchema={homepageData.custom_schema}
        schemaMode={homepageData.schema_mode || 'default'}
      />

      {/* Hero Section */}
      {homepageData.hero_enabled && (
        <MaterialHeroSection 
          overrideData={{
            title: homepageData.hero_title,
            subtitle: homepageData.hero_subtitle,
            description: homepageData.hero_description,
            button_text: homepageData.hero_button_text,
            button_link: homepageData.hero_button_link,
            background_image: homepageData.hero_background_image,
            enabled: homepageData.hero_enabled
          }}
        />
      )}
      
      {/* Featured Categories Section */}
      {homepageData.featured_categories_section_enabled && (
        <Suspense fallback={<SectionSkeleton />}>
          <FeaturedCategories 
            overrideData={{
              title: homepageData.featured_categories_section_title,
              subtitle: homepageData.featured_categories_section_subtitle,
              enabled: homepageData.featured_categories_section_enabled
            }}
          />
        </Suspense>
      )}
      
      {/* Featured Experiences Section */}
      {homepageData.featured_experiences_enabled && (
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <FeaturedExperiences 
            overrideData={{
              title: homepageData.featured_experiences_title,
              subtitle: homepageData.featured_experiences_subtitle,
              description: homepageData.featured_experiences_description
            }}
          />
        </Suspense>
      )}
      
      {/* Testimonials Section */}
      {homepageData.testimonials_enabled && (
        <Suspense fallback={<SectionSkeleton />}>
          <TestimonialsSection 
            overrideData={{
              title: homepageData.testimonials_title,
              subtitle: homepageData.testimonials_subtitle
            }}
          />
        </Suspense>
      )}
      
      {/* FAQ Section */}
      {homepageData.faq_section_enabled && (
        <Suspense fallback={<SectionSkeleton />}>
          <FAQSection 
            overrideData={{
              title: homepageData.faq_section_title,
              subtitle: homepageData.faq_section_subtitle
            }}
          />
        </Suspense>
      )}
      
      {/* Reviews Section */}
      {homepageData.reviews_enabled && (
        <Suspense fallback={<SectionSkeleton />}>
          <ReviewsSection
            pageType="homepage"
            pageId={homepageData.id}
            productId={homepageData.reviews_product_id}
            title={homepageData.reviews_title}
            showRatingSummary={true}
            className="bg-gray-50 py-16"
          />
        </Suspense>
      )}
      
      {/* Internal Links Section */}
      {homepageData.internal_links_enabled && (
        <Suspense fallback={<SectionSkeleton />}>
          <HomepageInternalLinksSection 
            overrideData={{
              title: homepageData.internal_links_title,
              subtitle: homepageData.internal_links_subtitle
            }}
          />
        </Suspense>
      )}
    </>
  )
}