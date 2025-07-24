import { createClient } from '@/lib/supabase'
import { CustomCTA } from '@/components/travel-guide/CustomCTASection'
import { InternalLinkCategory, internalLinksService } from './internalLinksService'

export interface TravelGuideData {
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
  read_time_minutes: number
  published: boolean
  published_at: string
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
  schema_mode?: 'default' | 'custom'
  custom_schema?: any
  custom_json_ld?: string
  structured_data_enabled?: boolean
  structured_data?: any
  internal_link_categories?: InternalLinkCategory[]
  created_at: string
  updated_at: string
}

export interface CMSSection {
  id: string
  guide_id: string
  type: 'featured_category' | 'featured_product' | 'category_carousel' | 'product_carousel'
  title: string
  subtitle?: string
  position: number
  enabled: boolean
  items: CMSSectionItem[]
}

export interface CMSSectionItem {
  id: string
  section_id: string
  content_type: 'experience' | 'category'
  content_id: string
  position: number
  enabled: boolean
  content?: any // Will be populated with actual experience/category data
}

export interface ItineraryDay {
  id: string
  guide_id: string
  day_number: number
  title: string
  description: string
  activities: string[]
  images: string[]
  tips: string[]
}

export interface FAQItem {
  id: string
  guide_id: string
  question: string
  answer: string
  position: number
  enabled: boolean
}

export interface GalleryImage {
  id: string
  guide_id: string
  image_url: string
  alt_text?: string
  caption?: string
  position: number
}

export class TravelGuideService {
  private supabase = createClient()

  // Travel Guide CRUD operations
  async createTravelGuide(data: Partial<TravelGuideData>): Promise<TravelGuideData> {
    console.log('TravelGuideService: Creating guide with data:', data)
    
    try {
      const { data: result, error } = await this.supabase
        .from('enhanced_travel_guides')
        .insert([data])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        throw error
      }
      
      console.log('Successfully created guide:', result)
      return result
    } catch (err) {
      console.error('Service error in createTravelGuide:', err)
      throw err
    }
  }

  async getTravelGuide(id: string, includeInternalLinks: boolean = false): Promise<TravelGuideData | null> {
    const { data, error } = await this.supabase
      .from('enhanced_travel_guides')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null

    // Fetch internal links if requested
    if (includeInternalLinks) {
      const internalLinkCategories = await internalLinksService.getInternalLinksForGuide(id)
      return {
        ...data,
        internal_link_categories: internalLinkCategories
      }
    }

    return data
  }

  async getTravelGuideBySlug(slug: string, includeInternalLinks: boolean = false): Promise<TravelGuideData | null> {
    const { data, error } = await this.supabase
      .from('enhanced_travel_guides')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) return null

    // Fetch internal links if requested
    if (includeInternalLinks) {
      const internalLinkCategories = await internalLinksService.getInternalLinksForGuide(data.id)
      return {
        ...data,
        internal_link_categories: internalLinkCategories
      }
    }
    return data
  }

  async getAllTravelGuides(): Promise<TravelGuideData[]> {
    const { data, error } = await this.supabase
      .from('enhanced_travel_guides')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getPublishedTravelGuides(): Promise<TravelGuideData[]> {
    const { data, error } = await this.supabase
      .from('enhanced_travel_guides')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async updateTravelGuide(id: string, updates: Partial<TravelGuideData>): Promise<TravelGuideData> {
    const { data, error } = await this.supabase
      .from('enhanced_travel_guides')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteTravelGuide(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('enhanced_travel_guides')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // CMS Sections CRUD operations
  async createCMSSection(sectionData: Partial<CMSSection>): Promise<CMSSection> {
    const { data, error } = await this.supabase
      .from('travel_guide_cms_sections')
      .insert([sectionData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getCMSSections(guideId: string): Promise<CMSSection[]> {
    const { data, error } = await this.supabase
      .from('travel_guide_cms_sections')
      .select(`
        *,
        travel_guide_section_items (
          id,
          content_type,
          content_id,
          position,
          enabled
        )
      `)
      .eq('guide_id', guideId)
      .order('position')

    if (error) {
      console.error('Error fetching CMS sections:', error)
      throw error
    }

    // Map the response to match our interface
    const sections = (data || []).map(section => ({
      ...section,
      items: section.travel_guide_section_items || []
    }))

    return sections
  }

  async updateCMSSection(id: string, updates: Partial<CMSSection>): Promise<CMSSection> {
    const { data, error } = await this.supabase
      .from('travel_guide_cms_sections')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteCMSSection(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('travel_guide_cms_sections')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // CMS Section Items CRUD operations
  async addSectionItem(itemData: Partial<CMSSectionItem>): Promise<CMSSectionItem> {
    const { data, error } = await this.supabase
      .from('travel_guide_section_items')
      .insert([itemData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async removeSectionItem(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('travel_guide_section_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async updateSectionItemPosition(id: string, position: number): Promise<void> {
    const { error } = await this.supabase
      .from('travel_guide_section_items')
      .update({ position })
      .eq('id', id)

    if (error) throw error
  }

  // Custom CTAs CRUD operations
  async createCTA(ctaData: Partial<CustomCTA>): Promise<CustomCTA> {
    const { data, error } = await this.supabase
      .from('travel_guide_ctas')
      .insert([ctaData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getCTAs(guideId: string): Promise<CustomCTA[]> {
    const { data, error } = await this.supabase
      .from('travel_guide_ctas')
      .select('*')
      .eq('guide_id', guideId)
      .order('position')

    if (error) throw error
    return data || []
  }

  async updateCTA(id: string, updates: Partial<CustomCTA>): Promise<CustomCTA> {
    const { data, error } = await this.supabase
      .from('travel_guide_ctas')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteCTA(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('travel_guide_ctas')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Itinerary Days CRUD operations
  async createItineraryDay(dayData: Partial<ItineraryDay>): Promise<ItineraryDay> {
    const { data, error } = await this.supabase
      .from('travel_guide_itinerary_days')
      .insert([dayData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getItineraryDays(guideId: string): Promise<ItineraryDay[]> {
    const { data, error } = await this.supabase
      .from('travel_guide_itinerary_days')
      .select('*')
      .eq('guide_id', guideId)
      .order('day_number')

    if (error) throw error
    return data || []
  }

  async updateItineraryDay(id: string, updates: Partial<ItineraryDay>): Promise<ItineraryDay> {
    const { data, error } = await this.supabase
      .from('travel_guide_itinerary_days')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteItineraryDay(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('travel_guide_itinerary_days')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // FAQ CRUD operations
  async createFAQ(faqData: Partial<FAQItem>): Promise<FAQItem> {
    const { data, error } = await this.supabase
      .from('travel_guide_faqs')
      .insert([faqData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getFAQs(guideId: string): Promise<FAQItem[]> {
    const { data, error } = await this.supabase
      .from('travel_guide_faqs')
      .select('*')
      .eq('guide_id', guideId)
      .order('position')

    if (error) throw error
    return data || []
  }

  async updateFAQ(id: string, updates: Partial<FAQItem>): Promise<FAQItem> {
    const { data, error } = await this.supabase
      .from('travel_guide_faqs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteFAQ(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('travel_guide_faqs')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Gallery CRUD operations
  async addGalleryImage(imageData: Partial<GalleryImage>): Promise<GalleryImage> {
    const { data, error } = await this.supabase
      .from('travel_guide_gallery')
      .insert([imageData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getGalleryImages(guideId: string): Promise<GalleryImage[]> {
    const { data, error } = await this.supabase
      .from('travel_guide_gallery')
      .select('*')
      .eq('guide_id', guideId)
      .order('position')

    if (error) throw error
    return data || []
  }

  async updateGalleryImage(id: string, updates: Partial<GalleryImage>): Promise<GalleryImage> {
    const { data, error } = await this.supabase
      .from('travel_guide_gallery')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteGalleryImage(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('travel_guide_gallery')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Helper method to get complete travel guide data
  async getCompleteGuideData(slug: string): Promise<any> {
    const guide = await this.getTravelGuideBySlug(slug)
    if (!guide) return null

    const [cmsSections, ctas, itineraryDays, faqs, galleryImages, internalLinkCategories] = await Promise.all([
      this.getCMSSections(guide.id),
      this.getCTAs(guide.id),
      this.getItineraryDays(guide.id),
      this.getFAQs(guide.id),
      this.getGalleryImages(guide.id),
      internalLinksService.getInternalLinksForGuide(guide.id)
    ])

    // Fetch actual content for CMS sections
    const sectionsWithContent = await Promise.all(
      cmsSections.map(async (section) => {
        if (!section.items || section.items.length === 0) {
          return { ...section, items: [], content: [] }
        }

        const itemsWithContent = await Promise.all(
          section.items.map(async (item) => {
            try {
              if (item.content_type === 'experience') {
                const { data } = await this.supabase
                  .from('experiences')
                  .select('*')
                  .eq('id', item.content_id)
                  .single()
                return { ...item, content: data }
              } else if (item.content_type === 'category') {
                const { data } = await this.supabase
                  .from('categories')
                  .select('*')
                  .eq('id', item.content_id)
                  .single()
                return { ...item, content: data }
              }
              return item
            } catch (error) {
              console.error(`Error fetching content for item ${item.id}:`, error)
              return item // Return item without content if fetch fails
            }
          })
        )
        // Map items to content array for template compatibility
        const content = itemsWithContent
          .filter(item => item.content) // Only include items with loaded content
          .map(item => item.content)
        
        return { ...section, items: itemsWithContent, content }
      })
    )

    return {
      ...guide,
      cms_sections: sectionsWithContent,
      custom_ctas: ctas,
      itinerary_days: itineraryDays,
      faq_items: faqs,
      gallery_images: galleryImages, // Return full gallery objects with alt_text and caption
      internal_link_categories: internalLinkCategories
    }
  }

  // Bulk operations for efficiency
  async bulkUpdatePositions(table: string, updates: { id: string; position: number }[]): Promise<void> {
    const promises = updates.map(({ id, position }) =>
      this.supabase
        .from(table)
        .update({ position })
        .eq('id', id)
    )

    await Promise.all(promises)
  }

  // Search functionality
  async searchTravelGuides(query: string): Promise<TravelGuideData[]> {
    const { data, error } = await this.supabase
      .from('enhanced_travel_guides')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,destination.ilike.%${query}%`)
      .order('published_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}

export const travelGuideService = new TravelGuideService()