import { createClient } from '@/lib/supabase'

export interface InternalLinkCategory {
  id: string
  name: string
  slug: string
  title: string
  description?: string
  display_order: number
  active: boolean
  links: InternalLink[]
}

export interface InternalLink {
  id: string
  category_id: string
  title: string
  url: string
  description?: string
  display_order: number
  active: boolean
}

export interface InternalLinkAssignment {
  id: string
  guide_id: string
  category_id: string
  display_order: number
}

class InternalLinksService {
  private supabase = createClient()

  async getInternalLinkCategories(): Promise<InternalLinkCategory[]> {
    const { data: categories, error: categoriesError } = await this.supabase
      .from('travel_guide_internal_link_categories')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true })

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError)
      return []
    }

    const { data: links, error: linksError } = await this.supabase
      .from('travel_guide_internal_links')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true })

    if (linksError) {
      console.error('Error fetching links:', linksError)
      return []
    }

    // Group links by category
    const categoriesWithLinks = categories?.map(category => ({
      ...category,
      links: links?.filter(link => link.category_id === category.id) || []
    })) || []

    return categoriesWithLinks
  }

  async getInternalLinksForGuide(guideId: string): Promise<InternalLinkCategory[]> {
    // Get assigned categories for this guide
    const { data: assignments, error: assignmentsError } = await this.supabase
      .from('travel_guide_link_assignments')
      .select(`
        category_id,
        display_order,
        travel_guide_internal_link_categories!inner(
          id,
          name,
          slug,
          title,
          description,
          display_order,
          active
        )
      `)
      .eq('guide_id', guideId)
      .eq('travel_guide_internal_link_categories.active', true)
      .order('display_order', { ascending: true })

    if (assignmentsError) {
      console.error('Error fetching guide assignments:', assignmentsError)
      return []
    }

    if (!assignments || assignments.length === 0) {
      // If no specific assignments, return all categories
      return this.getInternalLinkCategories()
    }

    // Get links for assigned categories
    const categoryIds = assignments.map(a => a.category_id)
    const { data: links, error: linksError } = await this.supabase
      .from('travel_guide_internal_links')
      .select('*')
      .in('category_id', categoryIds)
      .eq('active', true)
      .order('display_order', { ascending: true })

    if (linksError) {
      console.error('Error fetching links:', linksError)
      return []
    }

    // Build the result with proper typing
    const categoriesWithLinks = assignments.map(assignment => {
      const category = assignment.travel_guide_internal_link_categories as any
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        title: category.title,
        description: category.description,
        display_order: category.display_order,
        active: category.active,
        links: links?.filter(link => link.category_id === category.id) || []
      }
    })

    return categoriesWithLinks
  }

  async createCategory(data: Partial<InternalLinkCategory>): Promise<InternalLinkCategory | null> {
    const { data: result, error } = await this.supabase
      .from('travel_guide_internal_link_categories')
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      return null
    }

    return { ...result, links: [] }
  }

  async updateCategory(id: string, data: Partial<InternalLinkCategory>): Promise<InternalLinkCategory | null> {
    const { data: result, error } = await this.supabase
      .from('travel_guide_internal_link_categories')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      return null
    }

    return { ...result, links: [] }
  }

  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('travel_guide_internal_link_categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting category:', error)
      return false
    }

    return true
  }

  async createLink(data: Partial<InternalLink>): Promise<InternalLink | null> {
    const { data: result, error } = await this.supabase
      .from('travel_guide_internal_links')
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error('Error creating link:', error)
      return null
    }

    return result
  }

  async updateLink(id: string, data: Partial<InternalLink>): Promise<InternalLink | null> {
    const { data: result, error } = await this.supabase
      .from('travel_guide_internal_links')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating link:', error)
      return null
    }

    return result
  }

  async deleteLink(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('travel_guide_internal_links')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting link:', error)
      return false
    }

    return true
  }

  async assignCategoriesToGuide(guideId: string, categoryIds: string[]): Promise<boolean> {
    // First, remove existing assignments
    await this.supabase
      .from('travel_guide_link_assignments')
      .delete()
      .eq('guide_id', guideId)

    if (categoryIds.length === 0) {
      return true
    }

    // Create new assignments
    const assignments = categoryIds.map((categoryId, index) => ({
      guide_id: guideId,
      category_id: categoryId,
      display_order: index
    }))

    const { error } = await this.supabase
      .from('travel_guide_link_assignments')
      .insert(assignments)

    if (error) {
      console.error('Error assigning categories:', error)
      return false
    }

    return true
  }
}

export const internalLinksService = new InternalLinksService()