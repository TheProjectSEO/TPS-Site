'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, User, Star, Bookmark, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { TravelGuideStructuredData } from '@/components/seo/TravelGuideStructuredData'

interface Experience {
  id: string
  title: string
  slug: string
  short_description: string
  price: number
  rating: number
  review_count: number
  duration: string
  max_group_size: number
  main_image_url: string
  featured: boolean
  categories?: { name: string }
  cities?: { name: string }
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  experience_count: number
}

interface CMSSection {
  id: string
  type: 'featured_category' | 'featured_product' | 'category_carousel' | 'product_carousel'
  title: string
  content: any
  display_order: number
  enabled: boolean
}

interface GuideData {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  author_name: string
  author_image: string
  destination: string
  tags: string[]
  published_at: string
  updated_at: string
  read_time_minutes: number
  structured_data_type?: string
  focus_keyword?: string
  faq_items?: any[]
  itinerary_days?: any[]
  seo_title?: string
  seo_description?: string
  custom_schema?: any
  custom_json_ld?: any
  schema_mode?: string
  structured_data_enabled?: boolean
  custom_ctas?: any[]
}

interface EnhancedTravelGuideTemplateProps {
  guideData: GuideData
  sections: CMSSection[]
  categories: Category[]
  products: Experience[]
  internalLinks: any[]
  showInternal?: boolean
}

export function EnhancedTravelGuideTemplate({ 
  guideData,
  sections,
  categories,
  products,
  internalLinks,
  showInternal = false
}: EnhancedTravelGuideTemplateProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  return (
    <>
      {/* Structured Data */}
      <TravelGuideStructuredData
        guideData={{
          id: guideData.id,
          title: guideData.title,
          slug: guideData.slug,
          excerpt: guideData.excerpt,
          content: guideData.content,
          featured_image: guideData.featured_image,
          author_name: guideData.author_name,
          author_image: guideData.author_image,
          destination: guideData.destination,
          tags: guideData.tags,
          published_at: guideData.published_at,
          updated_at: guideData.updated_at,
          read_time_minutes: guideData.read_time_minutes,
          structured_data_type: guideData.structured_data_type,
          focus_keyword: guideData.focus_keyword,
          faq_items: guideData.faq_items,
          itinerary_days: guideData.itinerary_days,
          seo_title: guideData.seo_title,
          seo_description: guideData.seo_description
        }}
        customSchema={guideData.custom_schema}
        customJsonLd={guideData.custom_json_ld}
        schemaMode={guideData.schema_mode || 'default'}
        structuredDataEnabled={guideData.structured_data_enabled !== false}
      />

      <article className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            {guideData.featured_image && (
              <Image
                src={guideData.featured_image}
                alt={guideData.title}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
          
          {/* Back Button */}
          <div className="absolute top-8 left-8 z-10">
            <Link href="/travel-guide">
              <Button variant="secondary" size="sm" className="bg-white/90 text-gray-900 hover:bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Travel Guide
              </Button>
            </Link>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <div className="max-w-4xl">
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="bg-gradient-primary text-white shadow-brand-sm">
                    Destination Guide
                  </Badge>
                  {guideData.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/20 text-white">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  {guideData.title}
                </h1>
                
                <p className="text-xl mb-8 text-gray-200 leading-relaxed max-w-3xl">
                  {guideData.excerpt}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {guideData.author_name}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    {guideData.read_time_minutes} min read
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={toggleBookmark}
                      className="text-white hover:bg-white/20 p-2"
                    >
                      <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="relative">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: guideData.content }}
              />

              {/* Author Bio */}
              <div className="mt-12 p-8 bg-gradient-to-r from-primary/5 to-highlight/5 rounded-lg">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-medium shadow-brand-sm">
                    {guideData.author_image ? (
                      <Image
                        src={guideData.author_image}
                        alt={guideData.author_name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold">
                        {guideData.author_name?.charAt(0) || 'A'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">About {guideData.author_name}</h4>
                    <p className="text-secondary text-sm leading-relaxed font-medium">
                      Travel enthusiast and content creator sharing the best travel experiences, guides, and tips from around the world. 
                      With years of experience exploring destinations, {guideData.author_name} brings insider knowledge 
                      and passionate storytelling to help you discover your next adventure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}