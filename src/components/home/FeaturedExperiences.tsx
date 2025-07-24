'use client'

import { useEffect, useState } from 'react'
import { TourCardsGrid } from '@/components/products/TourCardsGrid'
import { createClient } from '@/lib/supabase'

interface Product {
  id: string
  title: string
  slug: string
  image: string
  images?: string[]
  price: number
  rating: number
  reviewCount: number
  duration: string
  maxGroupSize: number
  city: string
  featured: boolean
  shortDescription: string
  currency?: string
}

interface FeaturedExperiencesProps {
  overrideData?: {
    title: string
    subtitle: string
    description: string
  }
}

export function FeaturedExperiences({ overrideData }: FeaturedExperiencesProps = {}) {
  const [featuredExperiences, setFeaturedExperiences] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sectionSettings, setSectionSettings] = useState({
    title: 'Top Experiences',
    description: 'Discover the most popular tours and activities loved by travelers worldwide',
    enabled: true,
    count: 12
  })

  useEffect(() => {
    async function fetchFeaturedExperiences() {
      const supabase = createClient()
      
      // Use overrideData if provided, otherwise fetch from database
      if (overrideData) {
        setSectionSettings(prev => ({
          ...prev,
          title: overrideData.title,
          description: overrideData.description,
          enabled: true
        }))
      } else {
        // First fetch section settings
        const { data: settingsData } = await supabase
          .from('homepage_settings')
          .select('*')
          .eq('section_name', 'featured_experiences')
          .single()

        if (settingsData) {
          setSectionSettings({
            title: settingsData.title || 'Top Experiences',
            description: settingsData.description || 'Discover the most popular tours and activities loved by travelers worldwide',
            enabled: settingsData.enabled !== false,
            count: settingsData.settings_json?.featured_count || 12
          })
        }
      }

      let experienceCount = 12
      if (!overrideData) {
        const { data: settingsData } = await supabase
          .from('homepage_settings')
          .select('*')
          .eq('section_name', 'featured_experiences')
          .single()
        
        if (settingsData) {
          experienceCount = settingsData.settings_json?.featured_count || 12
        }
      }

      // Then fetch experiences with the specified count
      const { data } = await supabase
        .from('experiences')
        .select(`
          *,
          subcategories (
            name,
            categories (
              name
            )
          ),
          cities (
            name
          )
        `)
        .eq('featured', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(experienceCount)

      if (data) {
        // Map Supabase data to component format with optimized images
        const mappedData = data.map((product: any) => ({
          id: product.id,
          title: product.title,
          slug: product.slug,
          image: product.main_image_url || '/images/eiffel-tower.webp',
          images: product.additional_images || [],
          price: product.price || 0,
          currency: 'EUR',
          duration: product.duration || 'N/A',
          maxGroupSize: product.max_group_size || 0,
          city: product.cities?.name || 'Paris',
          featured: product.featured,
          shortDescription: product.short_description || product.description || 'Experience description'
        }))
        setFeaturedExperiences(mappedData)
      }
      setLoading(false)
    }

    fetchFeaturedExperiences()
  }, [overrideData])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading experiences...</p>
          </div>
        </div>
      </section>
    )
  }

  // Don't render if section is disabled
  if (!sectionSettings.enabled) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {sectionSettings.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {sectionSettings.description}
          </p>
        </div>

        <TourCardsGrid tours={featuredExperiences} />
      </div>
    </section>
  )
}