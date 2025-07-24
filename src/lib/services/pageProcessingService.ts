import { createClient } from '@/lib/supabase'
import { PageTemplate, CSVUploadData, BulkGeneratedPage } from './bulkUploadService'

export interface ProcessingResult {
  success: boolean
  pageId?: string
  errors: string[]
  warnings: string[]
}

export class PageProcessingService {
  private supabase = createClient()

  async processExperience(
    csvRow: CSVUploadData,
    template: PageTemplate
  ): Promise<ProcessingResult> {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      const rawData = csvRow.raw_data
      
      // Generate slug if not provided
      let slug = rawData.slug
      if (!slug && rawData.title) {
        slug = this.generateSlug(rawData.title)
      }

      // Ensure unique slug
      if (slug) {
        slug = await this.ensureUniqueSlug(slug, 'experiences')
      }

      // Lookup foreign keys
      let categoryId: string | null = null
      let cityId: string | null = null

      if (rawData.category_slug) {
        categoryId = await this.lookupCategoryId(rawData.category_slug)
        if (!categoryId) {
          warnings.push(`Category '${rawData.category_slug}' not found, will be created as draft`)
        }
      }

      if (rawData.city_slug) {
        cityId = await this.lookupCityId(rawData.city_slug)
        if (!cityId) {
          warnings.push(`City '${rawData.city_slug}' not found, will be created as draft`)
        }
      }

      // Generate product_id
      const productId = `tour_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Prepare experience data
      const experienceData = {
        title: rawData.title,
        slug,
        description: rawData.description,
        short_description: rawData.short_description || null,
        price: parseFloat(rawData.price) || 0,
        original_price: rawData.original_price ? parseFloat(rawData.original_price) : null,
        currency: rawData.currency || template.default_values.currency || 'EUR',
        duration: rawData.duration || null,
        duration_hours: rawData.duration_hours ? parseFloat(rawData.duration_hours) : null,
        max_group_size: rawData.max_group_size ? parseInt(rawData.max_group_size) : null,
        min_age: rawData.min_age ? parseInt(rawData.min_age) : null,
        meeting_point: rawData.meeting_point || null,
        cancellation_policy: rawData.cancellation_policy || null,
        languages: this.parseArray(rawData.languages),
        main_image_url: rawData.main_image_url || null,
        highlights: this.parseArray(rawData.highlights),
        availability_url: rawData.availability_url || null,
        featured: this.parseBoolean(rawData.featured) || false,
        bestseller: this.parseBoolean(rawData.bestseller) || false,
        product_id: productId,
        category_id: categoryId,
        city_id: cityId,
        status: 'draft', // Always create as draft initially
        
        // SEO fields
        seo_title: rawData.seo_title || null,
        seo_description: rawData.seo_description || null,
        seo_keywords: rawData.seo_keywords || null,
        canonical_url: rawData.canonical_url || null,
        robots_index: this.parseBoolean(rawData.robots_index) ?? true,
        robots_follow: this.parseBoolean(rawData.robots_follow) ?? true,
        robots_nosnippet: this.parseBoolean(rawData.robots_nosnippet) ?? false,
        focus_keyword: rawData.focus_keyword || null,
        
        // Open Graph
        og_title: rawData.og_title || null,
        og_description: rawData.og_description || null,
        og_image: rawData.og_image || rawData.main_image_url || null,
        og_image_alt: rawData.og_image_alt || null,
        
        // Twitter
        twitter_title: rawData.twitter_title || null,
        twitter_description: rawData.twitter_description || null,
        twitter_image: rawData.twitter_image || rawData.og_image || rawData.main_image_url || null,
        twitter_image_alt: rawData.twitter_image_alt || null,
        
        // Schema.org
        structured_data_type: rawData.structured_data_type || 'TouristAttraction',
        structured_data_enabled: this.parseBoolean(rawData.structured_data_enabled) ?? true,
        schema_mode: rawData.schema_mode || 'default',
        custom_schema: rawData.custom_schema ? this.parseJSON(rawData.custom_schema) : null,
        
        // Defaults
        rating: 0,
        review_count: 0,
        booking_count: 0,
        sort_order: rawData.sort_order ? parseInt(rawData.sort_order) : null
      }

      // Insert experience
      const { data: experience, error } = await this.supabase
        .from('experiences')
        .insert([experienceData])
        .select()
        .single()

      if (error) {
        errors.push(`Failed to create experience: ${error.message}`)
        return { success: false, errors, warnings }
      }

      return {
        success: true,
        pageId: experience.id,
        errors,
        warnings
      }

    } catch (error) {
      errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return { success: false, errors, warnings }
    }
  }

  async processCategoryPage(
    csvRow: CSVUploadData,
    template: PageTemplate
  ): Promise<ProcessingResult> {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      const rawData = csvRow.raw_data
      
      // Generate slug if not provided
      let slug = rawData.category_slug
      if (!slug && rawData.category_name) {
        slug = this.generateSlug(rawData.category_name)
      }

      // Ensure unique slug
      if (slug) {
        slug = await this.ensureUniqueSlug(slug, 'category_pages', undefined, 'category_slug')
      }

      // Prepare category page data
      const categoryPageData = {
        category_slug: slug,
        category_name: rawData.category_name,
        is_active: this.parseBoolean(rawData.is_active) ?? true,
        
        // Hero section
        hero_title: rawData.hero_title,
        hero_subtitle: rawData.hero_subtitle || null,
        hero_rating: rawData.hero_rating ? parseFloat(rawData.hero_rating) : 4.8,
        hero_rating_count: rawData.hero_rating_count ? parseInt(rawData.hero_rating_count) : 1000,
        hero_from_price: parseFloat(rawData.hero_from_price) || 0,
        hero_currency: rawData.hero_currency || 'EUR',
        hero_badges: this.parseArray(rawData.hero_badges),
        hero_benefit_bullets: this.parseArray(rawData.hero_benefit_bullets),
        hero_image_url: rawData.hero_image_url,
        hero_primary_cta_label: rawData.hero_primary_cta_label || 'See Tickets & Prices',
        
        // Content sections
        primary_ticket_list_heading: rawData.primary_ticket_list_heading || 'Available Tickets & Tours',
        primary_ticket_list_enabled: this.parseBoolean(rawData.primary_ticket_list_enabled) ?? true,
        primary_ticket_list_experience_ids: this.parseArray(rawData.primary_ticket_list_experience_ids),
        
        category_tags: this.parseArray(rawData.category_tags),
        
        destination_upsell_heading: rawData.destination_upsell_heading || 'Make the most of your visit',
        destination_upsell_enabled: this.parseBoolean(rawData.destination_upsell_enabled) ?? true,
        
        seo_intro_heading: rawData.seo_intro_heading || null,
        seo_intro_content: rawData.seo_intro_content || null,
        
        things_to_know_heading: rawData.things_to_know_heading || null,
        things_to_know_items: rawData.things_to_know_items ? this.parseJSON(rawData.things_to_know_items) : null,
        
        snapshot_guide_heading: rawData.snapshot_guide_heading || null,
        snapshot_guide_col1_heading: rawData.snapshot_guide_col1_heading || null,
        snapshot_guide_col1_content: rawData.snapshot_guide_col1_content || null,
        snapshot_guide_col2_heading: rawData.snapshot_guide_col2_heading || null,
        snapshot_guide_col2_content: rawData.snapshot_guide_col2_content || null,
        snapshot_guide_col3_heading: rawData.snapshot_guide_col3_heading || null,
        snapshot_guide_col3_content: rawData.snapshot_guide_col3_content || null,
        
        ticket_scope_heading: rawData.ticket_scope_heading || null,
        ticket_scope_inclusions: rawData.ticket_scope_inclusions ? this.parseJSON(rawData.ticket_scope_inclusions) : null,
        ticket_scope_exclusions: rawData.ticket_scope_exclusions ? this.parseJSON(rawData.ticket_scope_exclusions) : null,
        ticket_scope_notes: rawData.ticket_scope_notes || null,
        
        photo_gallery_heading: rawData.photo_gallery_heading || null,
        photo_gallery_images: rawData.photo_gallery_images ? this.parseJSON(rawData.photo_gallery_images) : null,
        
        faq_heading: rawData.faq_heading || null,
        faq_items: rawData.faq_items ? this.parseJSON(rawData.faq_items) : null,
        
        seo_tags: this.parseArray(rawData.seo_tags),
        
        // SEO fields
        seo_title: rawData.seo_title || null,
        seo_description: rawData.seo_description || null,
        seo_keywords: rawData.seo_keywords || null,
        seo_canonical_url: rawData.seo_canonical_url || null,
        seo_robots: rawData.seo_robots || 'index, follow',
        seo_priority: rawData.seo_priority ? parseFloat(rawData.seo_priority) : 0.8,
        seo_change_frequency: rawData.seo_change_frequency || 'weekly',
        
        // Open Graph
        seo_og_title: rawData.seo_og_title || null,
        seo_og_description: rawData.seo_og_description || null,
        seo_og_image: rawData.seo_og_image || rawData.hero_image_url || null,
        seo_og_type: rawData.seo_og_type || 'website',
        
        // Twitter
        seo_twitter_title: rawData.seo_twitter_title || null,
        seo_twitter_description: rawData.seo_twitter_description || null,
        seo_twitter_image: rawData.seo_twitter_image || rawData.seo_og_image || rawData.hero_image_url || null,
        seo_twitter_card: rawData.seo_twitter_card || 'summary_large_image',
        
        // Schema
        schema_mode: rawData.schema_mode || 'default',
        custom_schema: rawData.custom_schema ? this.parseJSON(rawData.custom_schema) : null
      }

      // Insert category page
      const { data: categoryPage, error } = await this.supabase
        .from('category_pages')
        .insert([categoryPageData])
        .select()
        .single()

      if (error) {
        errors.push(`Failed to create category page: ${error.message}`)
        return { success: false, errors, warnings }
      }

      return {
        success: true,
        pageId: categoryPage.id,
        errors,
        warnings
      }

    } catch (error) {
      errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return { success: false, errors, warnings }
    }
  }

  async processCSVRow(
    csvRow: CSVUploadData,
    template: PageTemplate
  ): Promise<ProcessingResult> {
    switch (template.page_type) {
      case 'experience':
        return this.processExperience(csvRow, template)
      case 'category':
        return this.processCategoryPage(csvRow, template)
      default:
        return {
          success: false,
          errors: [`Unknown page type: ${template.page_type}`],
          warnings: []
        }
    }
  }

  async recordGeneratedPage(
    jobId: string,
    csvRowId: string,
    templateId: string,
    pageType: 'experience' | 'category',
    targetTable: 'experiences' | 'category_pages',
    targetId: string,
    title: string,
    slug: string,
    status: 'draft' | 'published' | 'failed',
    errors: string[] = []
  ): Promise<void> {
    const { error } = await this.supabase
      .from('bulk_generated_pages')
      .insert([{
        job_id: jobId,
        csv_row_id: csvRowId,
        template_id: templateId,
        page_type: pageType,
        target_table: targetTable,
        target_id: targetId,
        title,
        slug,
        status,
        generation_errors: errors
      }])

    if (error) {
      console.error('Failed to record generated page:', error)
    }
  }

  // ===== UTILITY METHODS =====

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  private async ensureUniqueSlug(
    slug: string,
    table: string,
    excludeId?: string,
    slugField: string = 'slug'
  ): Promise<string> {
    let uniqueSlug = slug
    let counter = 1

    while (true) {
      let query = this.supabase
        .from(table)
        .select('id')
        .eq(slugField, uniqueSlug)

      if (excludeId) {
        query = query.neq('id', excludeId)
      }

      const { data } = await query
      
      if (!data || data.length === 0) {
        break
      }

      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    return uniqueSlug
  }

  private async lookupCategoryId(slug: string): Promise<string | null> {
    const { data } = await this.supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()

    return data?.id || null
  }

  private async lookupCityId(slug: string): Promise<string | null> {
    const { data } = await this.supabase
      .from('cities')
      .select('id')
      .eq('slug', slug)
      .single()

    return data?.id || null
  }

  private parseArray(value: any): string[] | null {
    if (!value) return null
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      return value.split(',').map(item => item.trim()).filter(item => item)
    }
    return null
  }

  private parseBoolean(value: any): boolean | null {
    if (value === null || value === undefined || value === '') return null
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') {
      return ['true', '1', 'yes', 'on'].includes(value.toLowerCase())
    }
    return Boolean(value)
  }

  private parseJSON(value: any): any | null {
    if (!value) return null
    if (typeof value === 'object') return value
    if (typeof value === 'string') {
      try {
        return JSON.parse(value)
      } catch {
        return null
      }
    }
    return null
  }
}

export const pageProcessingService = new PageProcessingService()