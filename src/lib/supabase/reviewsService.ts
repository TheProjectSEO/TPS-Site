import { createClient } from '@/lib/supabase'

// Enhanced review interface
export interface EnhancedReview {
  id: string
  reviewer_name: string
  reviewer_email?: string
  country_code: string // ISO 3166-1 alpha-2 (US, GB, FR, etc.)
  country_name: string
  avatar_icon: number // 1-7 for different avatar icons
  rating: number // 1.0 to 5.0
  title: string
  review_text: string
  review_date: string
  verified: boolean
  featured: boolean
  status: 'published' | 'pending' | 'rejected'
  source: string // manual, csv_upload, api, etc.
  product_id?: string // Links reviews to specific products/pages
  tags: string[]
  helpful_count: number
  created_at: string
  updated_at: string
}

// Review assignment interface
export interface ReviewAssignment {
  id: string
  review_id: string
  page_type: string // 'travel_guide', 'experience', 'category', 'homepage'
  page_id?: string
  page_identifier?: string
  product_id?: string // Links to specific products
  display_order: number
  enabled: boolean
  created_at: string
  review?: EnhancedReview // Populated when fetching with review data
}

// Page review settings interface
export interface PageReviewSettings {
  id: string
  page_type: string
  page_id: string
  page_identifier?: string
  product_id?: string // Links to specific products
  reviews_enabled: boolean
  display_count: number
  show_rating_summary: boolean
  show_verified_only: boolean
  auto_assign_featured: boolean
  created_at: string
  updated_at: string
}

// CSV upload log interface
export interface ReviewCSVUpload {
  id: string
  filename: string
  total_rows: number
  successful_imports: number
  failed_imports: number
  errors: string[]
  uploaded_by?: string
  upload_date: string
  status: 'processing' | 'completed' | 'failed'
}

// Review statistics interface
export interface ReviewStats {
  total_reviews: number
  average_rating: number
  rating_distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

// CSV row interface for validation
export interface CSVReviewRow {
  reviewer_name: string
  reviewer_email?: string
  country_code: string
  country_name: string
  rating: number
  title: string
  review_text: string
  review_date?: string
  verified?: boolean
  featured?: boolean
  product_id?: string // Links to specific products
  tags?: string
}

export class ReviewsService {
  private supabase = createClient()

  // ===== ENHANCED REVIEWS CRUD =====

  async createReview(data: Partial<EnhancedReview>): Promise<EnhancedReview> {
    const { data: review, error } = await this.supabase
      .from('enhanced_reviews')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return review
  }

  async getReview(id: string): Promise<EnhancedReview | null> {
    const { data, error } = await this.supabase
      .from('enhanced_reviews')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  }

  async getAllReviews(filters?: {
    status?: string
    featured?: boolean
    verified?: boolean
    country_code?: string
    product_id?: string
    min_rating?: number
    limit?: number
    offset?: number
  }): Promise<EnhancedReview[]> {
    let query = this.supabase
      .from('enhanced_reviews')
      .select('*')

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }
    if (filters?.verified !== undefined) {
      query = query.eq('verified', filters.verified)
    }
    if (filters?.country_code) {
      query = query.eq('country_code', filters.country_code)
    }
    if (filters?.product_id) {
      query = query.eq('product_id', filters.product_id)
    }
    if (filters?.min_rating) {
      query = query.gte('rating', filters.min_rating)
    }

    query = query.order('created_at', { ascending: false })

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  async updateReview(id: string, updates: Partial<EnhancedReview>): Promise<EnhancedReview> {
    const { data, error } = await this.supabase
      .from('enhanced_reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteReview(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('enhanced_reviews')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async bulkUpdateReviewStatus(reviewIds: string[], status: 'published' | 'pending' | 'rejected'): Promise<void> {
    const { error } = await this.supabase
      .from('enhanced_reviews')
      .update({ status })
      .in('id', reviewIds)

    if (error) throw error
  }

  async publishAllPendingReviews(): Promise<number> {
    const { data, error } = await this.supabase
      .from('enhanced_reviews')
      .update({ status: 'published' })
      .eq('status', 'pending')
      .select('id')

    if (error) throw error
    return data?.length || 0
  }

  async getReviewsByProduct(productId: string): Promise<EnhancedReview[]> {
    const { data, error } = await this.supabase
      .from('enhanced_reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getReviewsByCategory(categoryId: string): Promise<EnhancedReview[]> {
    // Get all product IDs for experiences in this category
    const { data: experiences, error: experienceError } = await this.supabase
      .from('experiences')
      .select('product_id')
      .eq('category_id', categoryId)
      .eq('status', 'active')
      .not('product_id', 'is', null)

    if (experienceError) throw experienceError

    const productIds = experiences?.map(exp => exp.product_id).filter(Boolean) || []
    
    if (productIds.length === 0) {
      return []
    }

    // Get all reviews for these products
    const { data, error } = await this.supabase
      .from('enhanced_reviews')
      .select('*')
      .in('product_id', productIds)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // ===== REVIEW ASSIGNMENTS =====

  async assignReviewToPage(data: Partial<ReviewAssignment>): Promise<ReviewAssignment> {
    const { data: assignment, error } = await this.supabase
      .from('enhanced_review_assignments')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return assignment
  }

  async getPageReviews(pageType: string, pageId?: string, productId?: string, includeReviewData = true): Promise<ReviewAssignment[]> {
    // Handle category-level aggregation
    if (pageType === 'category' && pageId && !productId) {
      // Get all reviews for experiences in this category
      const categoryReviews = await this.getReviewsByCategory(pageId)
      
      // Convert reviews to assignment format for consistency
      return categoryReviews.map((review, index) => ({
        id: `category_${pageId}_${review.id}`,
        review_id: review.id,
        page_type: pageType,
        page_id: pageId,
        page_identifier: undefined,
        product_id: review.product_id,
        display_order: index + 1,
        enabled: true,
        created_at: review.created_at,
        review: review
      }))
    }

    // Handle experience pages - try assignments first, then product_id fallback
    if (pageType === 'experience' && pageId) {
      // First try to get reviews from assignments table
      const query = this.supabase
        .from('enhanced_review_assignments')
        .select(includeReviewData ? 
          `*, enhanced_reviews(*)` : 
          '*'
        )
        .eq('page_type', pageType)
        .eq('page_id', pageId)
        .eq('enabled', true)
        .order('display_order')

      const { data: assignments, error } = await query

      if (!error && assignments && assignments.length > 0) {
        // Map the data to include review data in the review property
        if (includeReviewData) {
          return assignments.map(assignment => ({
            ...assignment,
            review: assignment.enhanced_reviews
          }))
        }
        return assignments
      }

      // Fallback: get reviews by product_id if no assignments found
      if (productId) {
        const productReviews = await this.getReviewsByProduct(productId)
        
        // Convert reviews to assignment format for consistency
        return productReviews.map((review, index) => ({
          id: `experience_${pageId}_${review.id}`,
          review_id: review.id,
          page_type: pageType,
          page_id: pageId,
          page_identifier: undefined,
          product_id: review.product_id,
          display_order: index + 1,
          enabled: true,
          created_at: review.created_at,
          review: review
        }))
      }

      return []
    }

    let query = this.supabase
      .from('enhanced_review_assignments')
      .select(includeReviewData ? 
        `*, enhanced_reviews(*)` : 
        '*'
      )
      .eq('page_type', pageType)
      .eq('enabled', true)

    if (pageId) {
      query = query.eq('page_id', pageId)
    }
    if (productId) {
      query = query.eq('product_id', productId)
    }

    query = query.order('display_order')

    const { data, error } = await query

    if (error) throw error

    // Map the data to include review data in the review property
    if (includeReviewData) {
      return (data || []).map(assignment => ({
        ...assignment,
        review: assignment.enhanced_reviews
      }))
    }

    return data || []
  }

  async updateReviewAssignment(id: string, updates: Partial<ReviewAssignment>): Promise<ReviewAssignment> {
    const { data, error } = await this.supabase
      .from('enhanced_review_assignments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async removeReviewAssignment(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('enhanced_review_assignments')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // ===== PAGE REVIEW SETTINGS =====

  async getPageReviewSettings(pageType: string, pageId: string, productId?: string): Promise<PageReviewSettings | null> {
    let query = this.supabase
      .from('page_review_settings')
      .select('*')
      .eq('page_type', pageType)
      .eq('page_id', pageId)

    if (productId) {
      query = query.eq('product_id', productId)
    }

    const { data, error } = await query.single()

    if (error) {
      // Return default settings for all page types when no specific settings exist
      return {
        id: `default_${pageType}_${pageId}`,
        page_type: pageType,
        page_id: pageId,
        product_id: productId,
        reviews_enabled: true,
        display_count: 6,
        show_rating_summary: true,
        show_verified_only: false,
        auto_assign_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
    return data
  }

  async updatePageReviewSettings(pageType: string, pageId: string, settings: Partial<PageReviewSettings>): Promise<PageReviewSettings> {
    const { data, error } = await this.supabase
      .from('page_review_settings')
      .upsert({
        page_type: pageType,
        page_id: pageId,
        ...settings
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // ===== CSV UPLOAD FUNCTIONALITY =====

  async createCSVUploadLog(data: Partial<ReviewCSVUpload>): Promise<ReviewCSVUpload> {
    const { data: upload, error } = await this.supabase
      .from('review_csv_uploads')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return upload
  }

  async updateCSVUploadLog(id: string, updates: Partial<ReviewCSVUpload>): Promise<ReviewCSVUpload> {
    const { data, error } = await this.supabase
      .from('review_csv_uploads')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async processCSVReviews(csvData: CSVReviewRow[], uploadId: string): Promise<{ 
    successful: number, 
    failed: number, 
    errors: string[] 
  }> {
    let successful = 0
    let failed = 0
    const errors: string[] = []

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i]
      try {
        // Validate required fields
        if (!row.reviewer_name || !row.country_code || !row.country_name || !row.rating || !row.title || !row.review_text) {
          throw new Error(`Row ${i + 1}: Missing required fields`)
        }

        // Validate rating range
        if (row.rating < 1 || row.rating > 5) {
          throw new Error(`Row ${i + 1}: Rating must be between 1 and 5`)
        }

        // Validate country code format
        if (row.country_code.length !== 2) {
          throw new Error(`Row ${i + 1}: Country code must be 2 characters`)
        }

        // Create the review with pending status by default for CSV uploads
        await this.createReview({
          reviewer_name: row.reviewer_name,
          reviewer_email: row.reviewer_email,
          country_code: row.country_code.toUpperCase(),
          country_name: row.country_name,
          rating: row.rating,
          title: row.title,
          review_text: row.review_text,
          review_date: row.review_date || new Date().toISOString().split('T')[0],
          verified: row.verified || false,
          featured: row.featured || false,
          status: 'pending', // Always set to pending for CSV uploads
          product_id: row.product_id,
          source: 'csv_upload',
          tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : []
        })

        successful++
      } catch (error) {
        failed++
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Update the upload log
    await this.updateCSVUploadLog(uploadId, {
      successful_imports: successful,
      failed_imports: failed,
      errors,
      status: failed === 0 ? 'completed' : 'completed'
    })

    return { successful, failed, errors }
  }

  // ===== STATISTICS =====

  async getReviewStats(pageType?: string, pageId?: string, productId?: string): Promise<ReviewStats> {
    // For global stats (no parameters), calculate manually as RPC seems to have issues
    if (!pageType && !pageId && !productId) {
      return this.calculateGlobalStats()
    }

    // Use the database function for specific page/product statistics
    const { data, error } = await this.supabase
      .rpc('get_review_stats', {
        page_type_param: pageType || null,
        page_id_param: pageId || null,
        product_id_param: productId || null
      })

    if (error) {
      console.error('Error getting review stats:', error)
      // Fallback to manual calculation for specific page/product
      return this.calculateStatsManually(pageType, pageId, productId)
    }

    const stats = data[0] || { 
      total_reviews: 0, 
      average_rating: 0, 
      rating_distribution: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 } 
    }

    // If RPC returns zero but we know there should be data, fall back to manual calculation
    if (stats.total_reviews === 0 && (pageType || pageId || productId)) {
      return this.calculateStatsManually(pageType, pageId, productId)
    }

    return {
      total_reviews: stats.total_reviews,
      average_rating: stats.average_rating,
      rating_distribution: {
        5: stats.rating_distribution['5'] || 0,
        4: stats.rating_distribution['4'] || 0,
        3: stats.rating_distribution['3'] || 0,
        2: stats.rating_distribution['2'] || 0,
        1: stats.rating_distribution['1'] || 0,
      }
    }
  }

  // Manual calculation for global stats
  private async calculateGlobalStats(): Promise<ReviewStats> {
    const { data: reviews, error } = await this.supabase
      .from('enhanced_reviews')
      .select('rating')
      .eq('status', 'published')

    if (error || !reviews) {
      return {
        total_reviews: 0,
        average_rating: 0,
        rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }

    const total = reviews.length
    if (total === 0) {
      return {
        total_reviews: 0,
        average_rating: 0,
        rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    const average = sum / total

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      const rating = Math.floor(review.rating) as keyof typeof distribution
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++
      }
    })

    return {
      total_reviews: total,
      average_rating: average,
      rating_distribution: distribution
    }
  }

  // Manual calculation for specific page/product stats
  private async calculateStatsManually(pageType?: string, pageId?: string, productId?: string): Promise<ReviewStats> {
    let reviews: any[] = []

    if (pageType === 'experience' && pageId) {
      // Get reviews for this specific experience
      const assignments = await this.getPageReviews(pageType, pageId, productId, true)
      reviews = assignments
        .filter(assignment => assignment.review)
        .map(assignment => assignment.review!)
        .filter(review => review.status === 'published')
    } else if (productId) {
      // Get reviews by product ID
      reviews = await this.getReviewsByProduct(productId)
    }

    const total = reviews.length
    if (total === 0) {
      return {
        total_reviews: 0,
        average_rating: 0,
        rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }

    const sum = reviews.reduce((acc: number, review: any) => acc + review.rating, 0)
    const average = sum / total

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((review: any) => {
      const rating = Math.floor(review.rating) as keyof typeof distribution
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++
      }
    })

    return {
      total_reviews: total,
      average_rating: average,
      rating_distribution: distribution
    }
  }

  // ===== UTILITY FUNCTIONS =====

  async getCountryCodes(): Promise<Array<{ code: string, name: string }>> {
    // Return common countries - in a real app this might come from a separate service
    return [
      { code: 'US', name: 'United States' },
      { code: 'GB', name: 'United Kingdom' },
      { code: 'CA', name: 'Canada' },
      { code: 'AU', name: 'Australia' },
      { code: 'DE', name: 'Germany' },
      { code: 'FR', name: 'France' },
      { code: 'IT', name: 'Italy' },
      { code: 'ES', name: 'Spain' },
      { code: 'JP', name: 'Japan' },
      { code: 'KR', name: 'South Korea' },
      { code: 'CN', name: 'China' },
      { code: 'IN', name: 'India' },
      { code: 'BR', name: 'Brazil' },
      { code: 'MX', name: 'Mexico' },
      { code: 'NL', name: 'Netherlands' },
      { code: 'SE', name: 'Sweden' },
      { code: 'NO', name: 'Norway' },
      { code: 'DK', name: 'Denmark' },
      { code: 'FI', name: 'Finland' },
      { code: 'CH', name: 'Switzerland' },
      { code: 'AT', name: 'Austria' },
      { code: 'BE', name: 'Belgium' },
      { code: 'PT', name: 'Portugal' },
      { code: 'IE', name: 'Ireland' },
      { code: 'NZ', name: 'New Zealand' },
      { code: 'ZA', name: 'South Africa' },
      { code: 'SG', name: 'Singapore' },
      { code: 'MY', name: 'Malaysia' },
      { code: 'TH', name: 'Thailand' },
      { code: 'PH', name: 'Philippines' },
      { code: 'ID', name: 'Indonesia' },
      { code: 'VN', name: 'Vietnam' },
      { code: 'RU', name: 'Russia' },
      { code: 'PL', name: 'Poland' },
      { code: 'CZ', name: 'Czech Republic' },
      { code: 'HU', name: 'Hungary' },
      { code: 'RO', name: 'Romania' },
      { code: 'BG', name: 'Bulgaria' },
      { code: 'HR', name: 'Croatia' },
      { code: 'GR', name: 'Greece' },
      { code: 'TR', name: 'Turkey' },
      { code: 'IL', name: 'Israel' },
      { code: 'AE', name: 'United Arab Emirates' },
      { code: 'SA', name: 'Saudi Arabia' },
      { code: 'EG', name: 'Egypt' },
      { code: 'MA', name: 'Morocco' },
      { code: 'AR', name: 'Argentina' },
      { code: 'CL', name: 'Chile' },
      { code: 'CO', name: 'Colombia' },
      { code: 'PE', name: 'Peru' },
      { code: 'UY', name: 'Uruguay' }
    ]
  }

  // Auto-assign featured reviews to a page
  async autoAssignFeaturedReviews(pageType: string, pageId: string, count = 6): Promise<void> {
    // Get featured reviews that are not already assigned to this page
    const { data: featuredReviews } = await this.supabase
      .from('enhanced_reviews')
      .select('id')
      .eq('featured', true)
      .eq('status', 'published')
      .not('id', 'in', `(
        SELECT review_id FROM enhanced_review_assignments 
        WHERE page_type = '${pageType}' AND page_id = '${pageId}'
      )`)
      .limit(count)

    if (featuredReviews && featuredReviews.length > 0) {
      const assignments = featuredReviews.map((review, index) => ({
        review_id: review.id,
        page_type: pageType,
        page_id: pageId,
        display_order: index + 1,
        enabled: true
      }))

      await this.supabase
        .from('enhanced_review_assignments')
        .insert(assignments)
    }
  }
}

export const reviewsService = new ReviewsService()