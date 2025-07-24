import { createClient } from "@/lib/supabase/server"

export interface RAGContent {
  id: string
  type: 'experience' | 'category' | 'blog_post'
  title: string
  description: string
  slug: string
  url: string
  metadata: {
    price?: string
    rating?: number
    duration?: string
    highlights?: string[]
    category?: string
    city?: string
    keywords?: string[]
    image?: string
    reviewCount?: number
  }
}

export class RAGContentService {
  private supabase: any

  constructor() {
    try {
      this.supabase = createClient()
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      this.supabase = null
    }
  }

  async getAllContent(): Promise<RAGContent[]> {
    if (!this.supabase) {
      console.error('Supabase client not initialized')
      return []
    }

    try {
      const [experiences, categories, blogPosts] = await Promise.all([
        this.getExperienceContent(),
        this.getCategoryContent(),
        this.getBlogContent()
      ])

      return [...experiences, ...categories, ...blogPosts]
    } catch (error) {
      console.error('Error getting all content:', error)
      return []
    }
  }

  async getExperienceContent(): Promise<RAGContent[]> {
    if (!this.supabase) return []

    try {
      const { data: experiences, error } = await this.supabase
        .from('experiences')
        .select(`
          id,
          title,
          slug,
          description,
          short_description,
          price,
          currency,
          rating,
          review_count,
          duration,
          highlights,
          main_image_url,
          focus_keyword,
          seo_keywords,
          cities(name),
          categories(name, slug)
        `)
        .eq('status', 'active')
        .order('rating', { ascending: false })
        .limit(100)

      if (error || !experiences) {
        console.error('Error fetching experiences:', error)
        return []
      }

      return experiences.map(exp => ({
        id: exp.id,
        type: 'experience' as const,
        title: exp.title,
        description: exp.short_description || exp.description || '',
        slug: exp.slug,
        url: `/tour/${exp.slug}`,
        metadata: {
          price: exp.price ? `${exp.currency || '€'}${exp.price}` : undefined,
          rating: exp.rating,
          duration: exp.duration,
          highlights: exp.highlights || [],
          category: exp.categories?.name,
          city: exp.cities?.name,
          keywords: exp.seo_keywords ? exp.seo_keywords.split(',').map(k => k.trim()) : [],
          image: exp.main_image_url,
          reviewCount: exp.review_count
        }
      }))
    } catch (error) {
      console.error('Error in getExperienceContent:', error)
      return []
    }
  }

  async getCategoryContent(): Promise<RAGContent[]> {
    if (!this.supabase) return []

    try {
      const { data: categories, error } = await this.supabase
        .from('categories')
        .select('id, name, slug, description, experience_count, image_url')
        .eq('status', 'active')
        .order('experience_count', { ascending: false })

      if (error || !categories) {
        console.error('Error fetching categories:', error)
        return []
      }

      return categories.map(cat => ({
        id: cat.id,
        type: 'category' as const,
        title: cat.name,
        description: cat.description || `Explore ${cat.name} experiences in Paris`,
        slug: cat.slug,
        url: `/tours/${cat.slug}`,
        metadata: {
          keywords: [cat.name.toLowerCase()],
          image: cat.image_url,
          reviewCount: cat.experience_count
        }
      }))
    } catch (error) {
      console.error('Error in getCategoryContent:', error)
      return []
    }
  }

  async getBlogContent(): Promise<RAGContent[]> {
    if (!this.supabase) return []

    try {
      const { data: blogPosts, error } = await this.supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          content,
          focus_keyword,
          seo_keywords,
          featured_image,
          read_time_minutes,
          view_count,
          categories(name)
        `)
        .eq('published', true)
        .order('view_count', { ascending: false })
        .limit(50)

      if (error || !blogPosts) {
        console.error('Error fetching blog posts:', error)
        return []
      }

      return blogPosts.map(post => ({
        id: post.id,
        type: 'blog_post' as const,
        title: post.title,
        description: post.excerpt || post.content?.substring(0, 200) + '...' || '',
        slug: post.slug,
        url: `/travel-guide/${post.slug}`,
        metadata: {
          keywords: post.seo_keywords ? post.seo_keywords.split(',').map(k => k.trim()) : [],
          image: post.featured_image,
          category: post.categories?.name,
          duration: post.read_time_minutes ? `${post.read_time_minutes} min read` : undefined
        }
      }))
    } catch (error) {
      console.error('Error in getBlogContent:', error)
      return []
    }
  }

  async searchContent(query: string, type?: 'experience' | 'category' | 'blog_post'): Promise<RAGContent[]> {
    const content = await this.getAllContent()
    
    const searchTerms = query.toLowerCase().split(' ')
    
    return content
      .filter(item => {
        if (type && item.type !== type) return false
        
        const searchableText = [
          item.title,
          item.description,
          ...(item.metadata.keywords || []),
          item.metadata.category,
          item.metadata.city
        ].join(' ').toLowerCase()
        
        return searchTerms.some(term => searchableText.includes(term))
      })
      .sort((a, b) => {
        // Sort by relevance score
        const aScore = this.calculateRelevanceScore(a, searchTerms)
        const bScore = this.calculateRelevanceScore(b, searchTerms)
        return bScore - aScore
      })
      .slice(0, 20)
  }

  private calculateRelevanceScore(item: RAGContent, searchTerms: string[]): number {
    let score = 0
    const titleLower = item.title.toLowerCase()
    const descLower = item.description.toLowerCase()
    
    searchTerms.forEach(term => {
      if (titleLower.includes(term)) score += 10
      if (descLower.includes(term)) score += 5
      if (item.metadata.keywords?.some(k => k.toLowerCase().includes(term))) score += 3
      if (item.metadata.category?.toLowerCase().includes(term)) score += 7
    })
    
    // Boost popular content
    if (item.metadata.rating && item.metadata.rating > 4.5) score += 2
    if (item.metadata.reviewCount && item.metadata.reviewCount > 100) score += 1
    
    return score
  }

  async getRecommendationsByInterests(interests: string[]): Promise<RAGContent[]> {
    const interestMap = {
      'art & museums': ['museum', 'art', 'louvre', 'orsay', 'picasso'],
      'architecture': ['architecture', 'building', 'gothic', 'eiffel', 'arc de triomphe'],
      'food & wine': ['food', 'wine', 'restaurant', 'cooking', 'culinary', 'bistro'],
      'history': ['history', 'historical', 'heritage', 'medieval', 'revolution'],
      'shopping': ['shopping', 'boutique', 'fashion', 'champs elysees', 'marche'],
      'romance': ['romantic', 'romance', 'couple', 'sunset', 'cruise', 'dinner'],
      'photography': ['photo', 'view', 'panoramic', 'scenic', 'instagram'],
      'nightlife': ['nightlife', 'bar', 'club', 'evening', 'night', 'cabaret'],
      'parks & gardens': ['park', 'garden', 'tuileries', 'luxembourg', 'nature'],
      'culture': ['culture', 'cultural', 'tradition', 'local', 'authentic'],
      'local experiences': ['local', 'authentic', 'hidden', 'neighborhood', 'walking'],
      'fashion': ['fashion', 'boutique', 'designer', 'shopping', 'style'],
      'music': ['music', 'concert', 'opera', 'jazz', 'performance'],
      'theater': ['theater', 'show', 'performance', 'cabaret', 'moulin rouge'],
      'cafes': ['cafe', 'coffee', 'bistro', 'brasserie', 'terrace'],
      'markets': ['market', 'marche', 'flea market', 'antiques', 'shopping']
    }

    const searchTerms = interests.flatMap(interest => 
      interestMap[interest.toLowerCase() as keyof typeof interestMap] || [interest.toLowerCase()]
    )

    const content = await this.getAllContent()
    
    return content
      .filter(item => {
        const searchableText = [
          item.title,
          item.description,
          ...(item.metadata.keywords || []),
          item.metadata.category,
          ...(item.metadata.highlights || [])
        ].join(' ').toLowerCase()
        
        return searchTerms.some(term => searchableText.includes(term))
      })
      .sort((a, b) => {
        const aScore = this.calculateRelevanceScore(a, searchTerms)
        const bScore = this.calculateRelevanceScore(b, searchTerms)
        return bScore - aScore
      })
      .slice(0, 15)
  }

  async getRecommendationsByBudget(budgetRange: string): Promise<RAGContent[]> {
    const budgetRanges = {
      'under-500': { min: 0, max: 50 },
      '500-1000': { min: 30, max: 100 },
      '1000-2000': { min: 80, max: 200 },
      '2000-5000': { min: 150, max: 500 },
      '5000-plus': { min: 300, max: 1000 }
    }

    const range = budgetRanges[budgetRange as keyof typeof budgetRanges]
    if (!range) return []

    const experiences = await this.getExperienceContent()
    
    return experiences.filter(exp => {
      if (!exp.metadata.price) return true
      const price = parseFloat(exp.metadata.price.replace(/[€$£]/g, ''))
      return price >= range.min && price <= range.max
    })
  }
}