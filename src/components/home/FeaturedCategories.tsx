'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase'

interface Category {
  id: string
  category_name: string
  category_slug: string
  image_url: string
  experience_count: number
}

// Function to get optimized tags for each category
const getCategoryTags = (slug: string): string[] => {
  try {
    const tagMap: Record<string, string[]> = {
      'eiffel-tower': ['Must-See', 'Skip-the-Line'],
      'louvre-museum': ['World Famous', 'Art Lover'],
      'arc-de-triomphe': ['Panoramic Views', 'History'],
      'notre-dame': ['Gothic Architecture', 'Historic'],
      'montmartre': ['Artistic Quarter', 'Photo Spot'],
      'versailles': ['Royal Palace', 'Day Trip'],
      'boat-cruises': ['Seine River', 'Relaxing'],
      'food-drink-experiences': ['Local Cuisine', 'Cultural'],
      'scenic-flights': ['Aerial Views', 'Unique'],
      'sightseeing': ['Guided Tours', 'Educational'],
      'walking-hiking': ['Active', 'Nature'],
      'water-sports': ['Adventure', 'Outdoor']
    }
    return tagMap[slug] || ['Popular', 'Recommended']
  } catch (error) {
    console.error('Error in getCategoryTags:', error)
    return ['Popular', 'Recommended']
  }
}

interface FeaturedCategoriesProps {
  overrideData?: {
    title?: string
    subtitle?: string
    enabled?: boolean
  }
}

export function FeaturedCategories({ overrideData }: FeaturedCategoriesProps = {}) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [sectionData, setSectionData] = useState({
    title: 'Explore Paris Top Attractions',
    subtitle: 'Discover the most popular destinations and experiences in the City of Light',
    enabled: true
  })

  useEffect(() => {
    fetchCategoriesData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchCategoriesData() {
    try {
      const supabase = createClient()
      
      // Fetch categories from database
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('featured_categories_selections')
        .select('*')
        .eq('is_active', true)
        .order('display_order')

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError)
        return
      }

      // Fetch section data from homepage_unified
      const { data: homepageData, error: homepageError } = await supabase
        .from('homepage_unified')
        .select('featured_categories_section_title, featured_categories_section_subtitle, featured_categories_section_enabled')
        .limit(1)

      if (!homepageError && homepageData && homepageData.length > 0) {
        const homepageRecord = homepageData[0]
        setSectionData({
          title: homepageRecord.featured_categories_section_title || 'Explore Paris Top Attractions',
          subtitle: homepageRecord.featured_categories_section_subtitle || 'Discover the most popular destinations and experiences in the City of Light',
          enabled: homepageRecord.featured_categories_section_enabled ?? true
        })
      }

      // Apply override data if provided
      if (overrideData) {
        setSectionData(prev => ({
          ...prev,
          ...overrideData
        }))
      }

      setCategories(categoriesData || [])
    } catch (error) {
      console.error('Error fetching categories data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading categories...</div>
        </div>
      </section>
    )
  }

  if (!sectionData.enabled) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4">
            {sectionData.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {sectionData.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories && categories.length > 0 ? categories.map((category) => (
            <Link key={category.category_slug} href={`/C/${category.category_slug}`}>
              <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={category.image_url}
                      alt={category.category_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    
                    {/* Top Tags */}
                    <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                      {getCategoryTags(category.category_slug || '').map((tag, index) => (
                        <span 
                          key={`${category.id}-${index}`}
                          className="px-2 py-1 bg-white/90 text-gray-900 text-xs font-medium rounded-full backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {category.category_name}
                      </h3>
                      <p className="text-sm text-gray-200">
                        {category.experience_count}+ experiences
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No categories available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}