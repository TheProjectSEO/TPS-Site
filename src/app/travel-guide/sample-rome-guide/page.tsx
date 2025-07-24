import { EnhancedTravelGuideTemplate } from '@/components/travel-guide/EnhancedTravelGuideTemplate'
import { sampleTravelGuideData } from '@/data/sampleTravelGuide'
import { StructuredData } from '@/components/seo/StructuredData'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: sampleTravelGuideData.seo_title,
  description: sampleTravelGuideData.seo_description,
  keywords: sampleTravelGuideData.tags.join(', '),
  openGraph: {
    title: sampleTravelGuideData.title,
    description: sampleTravelGuideData.excerpt,
    type: 'article',
    siteName: 'CuddlyNest',
    images: [{
      url: sampleTravelGuideData.featured_image,
      alt: sampleTravelGuideData.title
    }],
    publishedTime: sampleTravelGuideData.published_at
  },
  twitter: {
    card: 'summary_large_image',
    title: sampleTravelGuideData.title,
    description: sampleTravelGuideData.excerpt,
    images: [{
      url: sampleTravelGuideData.featured_image,
      alt: sampleTravelGuideData.title
    }]
  }
}

export default function SampleRomeGuidePage() {
  return (
    <>
      {/* Structured Data */}
      <StructuredData
        type="TravelGuide"
        data={sampleTravelGuideData.structured_data}
      />
      
      <EnhancedTravelGuideTemplate guideData={sampleTravelGuideData} />
    </>
  )
}