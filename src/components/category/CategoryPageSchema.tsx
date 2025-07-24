interface CategoryPageData {
  id: string
  category_slug: string
  category_name: string
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
  primary_ticket_list_heading: string
  primary_ticket_list_enabled: boolean
  primary_ticket_list_experience_ids: string[]
  category_tags: string[]
  destination_upsell_heading: string
  destination_upsell_enabled: boolean
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

interface CategoryPageSchemaProps {
  categoryData: CategoryPageData
  reviews: any[]
}

export function CategoryPageSchema({ categoryData, reviews }: CategoryPageSchemaProps) {
  // Check if custom schema should be used
  const useCustomSchema = (categoryData as any).schema_mode === 'custom' && (categoryData as any).custom_schema
  
  // If custom schema is enabled, use it
  if (useCustomSchema) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify((categoryData as any).custom_schema, null, 2)
        }}
      />
    )
  }

  // Default schema generation
  const touristAttractionSchema = {
    "@context": "https://schema.org",
    "@type": (categoryData as any).seo_schema_type || "TouristAttraction",
    "name": (categoryData as any).seo_schema_name || categoryData.hero_title,
    "description": (categoryData as any).seo_schema_description || categoryData.hero_subtitle,
    "image": (categoryData as any).seo_schema_image || categoryData.hero_image_url,
    "url": (categoryData as any).seo_schema_url || `https://tpssite.com/C/${categoryData.category_slug}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": (categoryData as any).seo_schema_address_street,
      "addressLocality": (categoryData as any).seo_schema_address_city,
      "addressRegion": (categoryData as any).seo_schema_address_region,
      "postalCode": (categoryData as any).seo_schema_address_postal_code,
      "addressCountry": (categoryData as any).seo_schema_address_country || "FR"
    },
    "geo": (categoryData as any).seo_schema_latitude && (categoryData as any).seo_schema_longitude ? {
      "@type": "GeoCoordinates",
      "latitude": (categoryData as any).seo_schema_latitude,
      "longitude": (categoryData as any).seo_schema_longitude
    } : undefined,
    "telephone": (categoryData as any).seo_schema_telephone,
    "openingHours": (categoryData as any).seo_schema_opening_hours,
    "priceRange": (categoryData as any).seo_schema_price_range,
    "aggregateRating": reviews.length > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": categoryData.reviews_avg_rating || calculateAverageRating(reviews),
      "reviewCount": reviews.length,
      "bestRating": 5,
      "worstRating": 1
    } : undefined
  }

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(touristAttractionSchema))

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tpssite.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Categories",
        "item": "https://tpssite.com/categories"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryData.category_name,
        "item": `https://tpssite.com/C/${categoryData.category_slug}`
      }
    ]
  }

  // FAQ Schema (if FAQ items exist)
  const faqSchema = categoryData.faq_items && categoryData.faq_items.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": categoryData.faq_items.map((faq: any) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null

  // Review Schema
  const reviewSchema = reviews.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "TouristAttraction",
      "name": categoryData.hero_title
    },
    "author": reviews.map((review: any) => ({
      "@type": "Person",
      "name": review.reviewer_name
    })),
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": calculateAverageRating(reviews),
      "bestRating": 5,
      "worstRating": 1
    },
    "reviewBody": reviews[0]?.review_text
  } : null

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TPS Site",
    "url": "https://tpssite.com",
    "logo": "https://tpssite.com/logo.png",
    "sameAs": [
      "https://www.facebook.com/tpssite",
      "https://www.instagram.com/tpssite",
      "https://www.twitter.com/tpssite"
    ]
  }

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TPS Site",
    "url": "https://tpssite.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://tpssite.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      {/* Tourist Attraction Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cleanSchema, null, 2)
        }}
      />
      
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema, null, 2)
        }}
      />
      
      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema, null, 2)
          }}
        />
      )}
      
      {/* Review Schema */}
      {reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(reviewSchema, null, 2)
          }}
        />
      )}
      
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema, null, 2)
        }}
      />
      
      {/* Website Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema, null, 2)
        }}
      />
    </>
  )
}

function calculateAverageRating(reviews: any[]): number {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}