import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate'
import { CategoryPageSchema } from '@/components/category/CategoryPageSchema'
import type { Metadata } from 'next'

interface CategoryPageData {
  id: string
  category_slug: string
  category_name: string
  product_id: string
  
  // Hero Block
  hero_title: string
  hero_subtitle: string
  hero_rating: number
  hero_rating_count: number
  hero_from_price: number
  hero_currency: string
  hero_badges: string[]
  hero_benefit_bullets: string[]
  hero_image_url: string
  hero_primary_cta_label: string
  
  // New sections
  primary_ticket_list_heading: string
  primary_ticket_list_enabled: boolean
  primary_ticket_list_experience_ids: string[]
  category_tags: string[]
  destination_upsell_heading: string
  destination_upsell_enabled: boolean
  
  // Content sections
  seo_intro_heading: string
  seo_intro_content: string
  things_to_know_heading: string
  things_to_know_items: any[]
  snapshot_guide_heading: string
  snapshot_guide_col1_heading: string
  snapshot_guide_col1_content: string
  snapshot_guide_col2_heading: string
  snapshot_guide_col2_content: string
  snapshot_guide_col3_heading: string
  snapshot_guide_col3_content: string
  ticket_scope_heading: string
  ticket_scope_inclusions: any[]
  ticket_scope_exclusions: any[]
  ticket_scope_notes: string
  photo_gallery_heading: string
  photo_gallery_images: any[]
  onsite_experiences_heading: string
  onsite_experiences_items: any[]
  reviews_heading: string
  reviews_avg_rating: number
  reviews_total_count: number
  reviews_distribution: any
  faq_heading: string
  faq_items: any[]
  related_content_heading: string
  related_content_items: any[]
  seo_tags: string[]
}

interface UpsellItem {
  id: string
  title: string
  teaser: string
  image_url: string
  price_from: number
  rating: number
  link_url: string
  link_type: string
}

// Server-side function to fetch category page data
async function getCategoryPageData(slug: string): Promise<{ categoryData: CategoryPageData | null, upsellItems: UpsellItem[], selectedExperiences: any[], reviews: any[] }> {
  const supabase = await createClient()
  
  try {
    // Fetch category page data
    const { data: categoryData, error: categoryError } = await supabase
      .from('category_pages')
      .select('*')
      .eq('category_slug', slug)
      .eq('is_active', true)
      .single()

    if (categoryError || !categoryData) {
      return { categoryData: null, upsellItems: [], selectedExperiences: [], reviews: [] }
    }

    // Fetch upsell items
    const { data: upsellData, error: upsellError } = await supabase
      .from('category_upsell_items')
      .select('*')
      .eq('category_slug', slug)
      .eq('is_active', true)
      .order('display_order')

    // Fetch selected experiences
    let selectedExperiences: any[] = []
    if (categoryData.primary_ticket_list_experience_ids && categoryData.primary_ticket_list_experience_ids.length > 0) {
      const { data: experiencesData, error: experiencesError } = await supabase
        .from('experiences')
        .select(`
          *,
          cities:city_id(name),
          categories:category_id(name)
        `)
        .in('id', categoryData.primary_ticket_list_experience_ids)
        .eq('status', 'active')
        .order('title')

      if (!experiencesError && experiencesData) {
        selectedExperiences = experiencesData
      }
    }

    // Fetch reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('category_reviews')
      .select('*')
      .eq('category_slug', slug)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false })
      .order('review_date', { ascending: false })

    return {
      categoryData,
      upsellItems: upsellData || [],
      selectedExperiences,
      reviews: reviewsData || []
    }
  } catch (error) {
    console.error('Error fetching category data:', error)
    return { categoryData: null, upsellItems: [], selectedExperiences: [], reviews: [] }
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { categoryData } = await getCategoryPageData(slug)
  
  if (!categoryData) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    }
  }

  // Use SEO fields if available, otherwise fallback to hero content
  const title = (categoryData as any).seo_title || `${categoryData.hero_title} - TPS Site`
  const description = (categoryData as any).seo_description || categoryData.hero_subtitle || `Discover the best ${categoryData.category_name.toLowerCase()} tours and experiences.`
  const keywords = (categoryData as any).seo_keywords || categoryData.seo_tags?.join(', ') || `${categoryData.category_name.toLowerCase()}, tours, experiences, paris, france`
  const ogTitle = (categoryData as any).seo_og_title || title
  const ogDescription = (categoryData as any).seo_og_description || description
  const ogImage = (categoryData as any).seo_og_image || categoryData.hero_image_url
  const twitterTitle = (categoryData as any).seo_twitter_title || title
  const twitterDescription = (categoryData as any).seo_twitter_description || description
  const twitterImage = (categoryData as any).seo_twitter_image || categoryData.hero_image_url
  const twitterCard = (categoryData as any).seo_twitter_card || 'summary_large_image'
  const robots = (categoryData as any).seo_robots || 'index, follow'
  const canonicalUrl = (categoryData as any).seo_canonical_url
  const imageAlt = (categoryData as any).seo_image_alt_text || categoryData.hero_title

  const metadata: Metadata = {
    title,
    description,
    keywords,
    robots,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'website',
      siteName: 'TPS Site',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
        }
      ]
    },
    twitter: {
      card: twitterCard as 'summary' | 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      images: [twitterImage]
    }
  }

  // Add canonical URL if specified
  if (canonicalUrl) {
    metadata.alternates = {
      canonical: canonicalUrl
    }
  }

  // Add additional meta tags if specified
  if ((categoryData as any).seo_additional_meta_tags) {
    metadata.other = (categoryData as any).seo_additional_meta_tags
  }

  return metadata
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { categoryData, upsellItems, selectedExperiences, reviews } = await getCategoryPageData(slug)
  
  if (!categoryData) {
    notFound()
  }

  return (
    <>
      <CategoryPageSchema 
        categoryData={categoryData}
        reviews={reviews}
      />
      <CategoryPageTemplate 
        categoryData={categoryData}
        upsellItems={upsellItems}
        selectedExperiences={selectedExperiences}
        reviews={reviews}
      />
    </>
  )
}