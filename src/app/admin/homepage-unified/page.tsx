'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { SchemaEditor } from '@/components/admin/SchemaEditor'
import { SEOFormFields, SEOFormData } from '@/components/seo/SEOFormFields'
import { Save, Plus, X, GripVertical } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  experience_count: number
}

interface Experience {
  id: string
  title: string
  slug: string
  short_description: string
  price: number
  main_image_url: string
  rating: number
  review_count: number
}

interface HomepageData {
  id: string
  page_title: string
  page_description: string
  
  // Hero Section (New v0 design)
  hero_main_title: string
  hero_tagline: string
  hero_cta_text: string
  hero_cta_link: string
  hero_background_image: string | null
  hero_enabled: boolean
  
  // Legacy Hero Section (for backward compatibility)
  hero_title: string
  hero_subtitle: string
  hero_description: string
  hero_button_text: string
  hero_button_link: string
  
  // Why Choose Us Section
  why_choose_us_enabled: boolean
  why_choose_us_title: string
  why_choose_us_description: string
  feature_1_title: string
  feature_1_description: string
  feature_1_color: string
  feature_2_title: string
  feature_2_description: string
  feature_2_color: string
  feature_3_title: string
  feature_3_description: string
  feature_3_color: string
  
  // Top Tickets Section
  top_tickets_enabled: boolean
  top_tickets_title: string
  top_tickets_subtitle: string
  
  // Reviews Section
  reviews_enabled: boolean
  reviews_title: string
  reviews_overall_rating: number
  reviews_total_count: number
  
  // Complete Guide Section
  guide_enabled: boolean
  guide_title: string
  guide_subtitle: string
  
  // Things to Do Section
  things_todo_enabled: boolean
  things_todo_title: string
  things_todo_subtitle: string
  
  // Transportation Section
  transport_enabled: boolean
  transport_title: string
  transport_subtitle: string
  
  // History Section
  history_enabled: boolean
  history_title: string
  history_subtitle: string
  
  // Why Visit Section
  why_visit_enabled: boolean
  why_visit_title: string
  why_visit_description: string
  
  // Photography Section
  photography_enabled: boolean
  photography_title: string
  photography_subtitle: string
  
  // Dining Section
  dining_enabled: boolean
  dining_title: string
  dining_subtitle: string
  
  // Floor Details Section
  floors_enabled: boolean
  floors_title: string
  floors_subtitle: string
  
  // FAQs Section
  homepage_faqs_enabled: boolean
  homepage_faqs_title: string
  homepage_faqs_subtitle: string
  
  // Local Area Section
  local_area_enabled: boolean
  local_area_title: string
  local_area_subtitle: string
  
  // Legacy sections for backward compatibility
  featured_categories_enabled: boolean
  featured_categories_title: string
  featured_categories_subtitle: string
  
  // Featured Categories Section (New CMS fields)
  featured_categories_section_enabled: boolean
  featured_categories_section_title: string
  featured_categories_section_subtitle: string
  featured_experiences_enabled: boolean
  featured_experiences_title: string
  featured_experiences_subtitle: string
  featured_experiences_description: string
  testimonials_enabled: boolean
  testimonials_title: string
  testimonials_subtitle: string
  faq_section_enabled: boolean
  faq_section_title: string
  faq_section_subtitle: string
  internal_links_enabled: boolean
  internal_links_title: string
  internal_links_subtitle: string
  
  // Schema and SEO
  schema_mode: 'default' | 'custom'
  custom_schema: any
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
  focus_keyword?: string
  structured_data_type?: string
  updated_at: string
}

export default function UnifiedHomepageManagement() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [homepageId, setHomepageId] = useState<string | null>(null)
  const [customSchema, setCustomSchema] = useState<string | null>(null)
  const [schemaMode, setSchemaMode] = useState<'default' | 'custom'>('default')
  const [seoData, setSeoData] = useState<SEOFormData>({
    robots_index: true,
    robots_follow: true,
    robots_nosnippet: false,
    focus_keyword: '',
    structured_data_type: 'WebSite'
  })
  
  // Content selection state
  const [availableCategories, setAvailableCategories] = useState<Category[]>([])
  const [availableExperiences, setAvailableExperiences] = useState<Experience[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([])
  const [categorySelectionLoading, setCategorySelectionLoading] = useState(false)
  const [experienceSelectionLoading, setExperienceSelectionLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    page_title: 'TPS Site - Tours & Experiences',
    page_description: 'Book the best tours and experiences worldwide',
    
    // New Hero Section (v0 design)
    hero_main_title: 'Eiffel Tower Tickets',
    hero_tagline: 'Skip the Line | Instant Confirmation | Mobile Tickets',
    hero_cta_text: 'Browse All Tickets',
    hero_cta_link: '/tours',
    hero_background_image: '/images/eiffel-tower-tickets.webp',
    hero_enabled: true,
    
    // Legacy Hero Section (for backward compatibility)
    hero_title: 'Discover Amazing Experiences',
    hero_subtitle: 'Your Adventure Starts Here',
    hero_description: 'Book unforgettable tours and activities around the world',
    hero_button_text: 'Explore Tours',
    hero_button_link: '/tours',
    
    // Why Choose Us Section
    why_choose_us_enabled: true,
    why_choose_us_title: 'Skip the Line Eiffel Tower Tickets - Book Official Tickets Online',
    why_choose_us_description: 'Experience Paris\'s most iconic landmark without the wait. Our official Eiffel Tower tickets guarantee skip-the-line access, instant confirmation, and the best prices available.',
    feature_1_title: 'Official Eiffel Tower Partner',
    feature_1_description: 'We\'re an authorized ticket reseller with direct access to official Eiffel Tower reservations.',
    feature_1_color: 'blue',
    feature_2_title: 'Best Price Guarantee', 
    feature_2_description: 'Find a lower price elsewhere? We\'ll match it and give you an extra 5% off.',
    feature_2_color: 'green',
    feature_3_title: 'Instant Mobile Tickets',
    feature_3_description: 'No printing required! Receive your tickets instantly via email and SMS.',
    feature_3_color: 'purple',
    
    // Top Tickets Section
    top_tickets_enabled: true,
    top_tickets_title: 'Best Eiffel Tower Tickets 2025 - Compare Prices & Options',
    top_tickets_subtitle: 'Choose from our most popular Eiffel Tower experiences with skip-the-line access and instant confirmation.',
    
    // Reviews Section
    reviews_enabled: true,
    reviews_title: 'What Travelers Are Saying',
    reviews_overall_rating: 4.8,
    reviews_total_count: 47382,
    
    // Complete Guide Section
    guide_enabled: true,
    guide_title: 'Complete Guide to Visiting the Eiffel Tower in 2025',
    guide_subtitle: 'Everything you need to know for the perfect Eiffel Tower experience, from ticket types to insider tips.',
    
    // Things to Do Section
    things_todo_enabled: true,
    things_todo_title: 'Top Things to Do in Paris',
    things_todo_subtitle: 'Discover more of Paris\'s iconic attractions and experiences while you\'re in the City of Light.',
    
    // Transportation Section
    transport_enabled: true,
    transport_title: 'How to Get to the Eiffel Tower - Transportation Guide 2025',
    transport_subtitle: 'Multiple convenient transportation options to reach Paris\'s most famous landmark.',
    
    // History Section
    history_enabled: true,
    history_title: 'Eiffel Tower History, Facts & Architecture',
    history_subtitle: 'Discover the fascinating story behind Paris\'s most famous landmark and architectural marvel.',
    
    // Why Visit Section
    why_visit_enabled: true,
    why_visit_title: 'Why Visit the Eiffel Tower?',
    why_visit_description: 'Standing 330 meters tall, the Eiffel Tower was built by Gustave Eiffel for the 1889 World\'s Fair.',
    
    // Photography Section
    photography_enabled: true,
    photography_title: 'Best Photo Spots & Instagram Guide for Eiffel Tower',
    photography_subtitle: 'Capture the perfect shot with our insider photography guide.',
    
    // Dining Section
    dining_enabled: true,
    dining_title: 'Dining at the Eiffel Tower',
    dining_subtitle: 'From casual dining to Michelin-starred cuisine, enjoy exceptional meals with unparalleled views.',
    
    // Floor Details Section
    floors_enabled: true,
    floors_title: 'What to See on Each Floor of the Eiffel Tower',
    floors_subtitle: 'Discover what awaits you on each level of this iconic monument.',
    
    // FAQs Section
    homepage_faqs_enabled: true,
    homepage_faqs_title: 'Eiffel Tower Tickets FAQ 2025 - Common Questions Answered',
    homepage_faqs_subtitle: 'Get instant answers to the most common questions about visiting the Eiffel Tower',
    
    // Local Area Section
    local_area_enabled: true,
    local_area_title: 'What to Do Near the Eiffel Tower - Local Area Guide',
    local_area_subtitle: 'Make the most of your visit with our guide to attractions, restaurants, and activities.',
    
    // Legacy sections for backward compatibility
    featured_categories_enabled: true,
    featured_categories_title: 'Explore by Category',
    featured_categories_subtitle: 'Choose your adventure',
    
    // Featured Categories Section (New CMS fields)
    featured_categories_section_enabled: true,
    featured_categories_section_title: 'Explore Paris Top Attractions',
    featured_categories_section_subtitle: 'Discover the most popular destinations and experiences in the City of Light',
    featured_experiences_enabled: true,
    featured_experiences_title: 'Featured Experiences',
    featured_experiences_subtitle: 'Handpicked adventures just for you',
    featured_experiences_description: 'Discover our most popular tours and activities',
    testimonials_enabled: true,
    testimonials_title: 'What Our Customers Say',
    testimonials_subtitle: 'Real experiences from real travelers',
    faq_section_enabled: true,
    faq_section_title: 'Frequently Asked Questions',
    faq_section_subtitle: 'Everything you need to know',
    internal_links_enabled: true,
    internal_links_title: 'Useful Links',
    internal_links_subtitle: 'Quick access to important pages'
  })

  useEffect(() => {
    fetchHomepageData()
    fetchAvailableContent()
  }, [])

  async function fetchAvailableContent() {
    try {
      const supabase = createClient()
      
      // Fetch available categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug, icon, experience_count')
        .order('name')

      if (!categoriesError && categories) {
        setAvailableCategories(categories)
      }

      // Fetch available experiences
      const { data: experiences, error: experiencesError } = await supabase
        .from('experiences')
        .select('id, title, slug, short_description, price, main_image_url, rating, review_count')
        .eq('status', 'published')
        .order('title')

      if (!experiencesError && experiences) {
        setAvailableExperiences(experiences)
      }

      // Fetch current selections
      const { data: selectedCats } = await supabase
        .from('homepage_category_selections')
        .select('category_id')
        .eq('is_active', true)
        .order('display_order')

      if (selectedCats) {
        setSelectedCategories(selectedCats.map(cat => cat.category_id))
      }

      const { data: selectedExps } = await supabase
        .from('homepage_experience_selections')
        .select('experience_id')
        .eq('is_active', true)
        .order('display_order')

      if (selectedExps) {
        setSelectedExperiences(selectedExps.map(exp => exp.experience_id))
      }

    } catch (error) {
      console.error('Error fetching available content:', error)
    }
  }

  async function fetchHomepageData() {
    try {
      const supabase = createClient()
      
      // Check if we have a unified homepage record
      const { data: unifiedData, error: unifiedError } = await supabase
        .from('homepage_unified')
        .select('*')
        .single()

      if (unifiedData) {
        // Load from unified table
        setHomepageId(unifiedData.id)
        setFormData({
          page_title: unifiedData.page_title || 'TPS Site - Tours & Experiences',
          page_description: unifiedData.page_description || 'Book the best tours and experiences worldwide',
          hero_title: unifiedData.hero_title || 'Discover Amazing Experiences',
          hero_subtitle: unifiedData.hero_subtitle || 'Your Adventure Starts Here',
          hero_description: unifiedData.hero_description || 'Book unforgettable tours and activities',
          hero_button_text: unifiedData.hero_button_text || 'Explore Tours',
          hero_button_link: unifiedData.hero_button_link || '/tours',
          hero_background_image: unifiedData.hero_background_image || '',
          hero_enabled: unifiedData.hero_enabled !== false,
          featured_categories_enabled: unifiedData.featured_categories_enabled !== false,
          featured_categories_title: unifiedData.featured_categories_title || 'Explore by Category',
          featured_categories_subtitle: unifiedData.featured_categories_subtitle || 'Choose your adventure',
          featured_experiences_enabled: unifiedData.featured_experiences_enabled !== false,
          featured_experiences_title: unifiedData.featured_experiences_title || 'Featured Experiences',
          featured_experiences_subtitle: unifiedData.featured_experiences_subtitle || 'Handpicked adventures just for you',
          featured_experiences_description: unifiedData.featured_experiences_description || 'Discover our most popular tours and activities',
          testimonials_enabled: unifiedData.testimonials_enabled !== false,
          testimonials_title: unifiedData.testimonials_title || 'What Our Customers Say',
          testimonials_subtitle: unifiedData.testimonials_subtitle || 'Real experiences from real travelers',
          faq_section_enabled: unifiedData.faq_section_enabled !== false,
          faq_section_title: unifiedData.faq_section_title || 'Frequently Asked Questions',
          faq_section_subtitle: unifiedData.faq_section_subtitle || 'Everything you need to know',
          internal_links_enabled: unifiedData.internal_links_enabled !== false,
          internal_links_title: unifiedData.internal_links_title || 'Useful Links',
          internal_links_subtitle: unifiedData.internal_links_subtitle || 'Quick access to important pages'
        })

        setSeoData({
          seo_title: unifiedData.seo_title || '',
          seo_description: unifiedData.seo_description || '',
          seo_keywords: unifiedData.seo_keywords || '',
          canonical_url: unifiedData.canonical_url || '',
          robots_index: unifiedData.robots_index !== false,
          robots_follow: unifiedData.robots_follow !== false,
          robots_nosnippet: unifiedData.robots_nosnippet || false,
          og_title: unifiedData.og_title || '',
          og_description: unifiedData.og_description || '',
          og_image: unifiedData.og_image || '',
          og_image_alt: unifiedData.og_image_alt || '',
          twitter_title: unifiedData.twitter_title || '',
          twitter_description: unifiedData.twitter_description || '',
          twitter_image: unifiedData.twitter_image || '',
          twitter_image_alt: unifiedData.twitter_image_alt || '',
          focus_keyword: unifiedData.focus_keyword || '',
          structured_data_type: unifiedData.structured_data_type || 'WebSite'
        })

        setSchemaMode(unifiedData.schema_mode || 'default')
        setCustomSchema(unifiedData.custom_schema ? JSON.stringify(unifiedData.custom_schema, null, 2) : null)
      } else {
        // Migrate from old sections-based system
        await migrateFromOldSystem()
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function migrateFromOldSystem() {
    try {
      const supabase = createClient()
      
      // Get hero section data
      const { data: heroData } = await supabase
        .from('homepage_settings')
        .select('*')
        .eq('section_name', 'hero_section')
        .single()

      if (heroData) {
        setFormData(prev => ({
          ...prev,
          hero_title: heroData.title || prev.hero_title,
          hero_subtitle: heroData.subtitle || prev.hero_subtitle,
          hero_description: heroData.description || prev.hero_description,
          hero_button_text: heroData.button_text || prev.hero_button_text,
          hero_button_link: heroData.button_link || prev.hero_button_link,
          hero_background_image: heroData.background_image || '',
          hero_enabled: heroData.enabled !== false
        }))
      }

      // Check section enablement
      const { data: sectionsData } = await supabase
        .from('homepage_settings')
        .select('section_name, enabled')

      if (sectionsData) {
        const sectionSettings = sectionsData.reduce((acc, section) => {
          acc[section.section_name] = section.enabled
          return acc
        }, {} as Record<string, boolean>)

        setFormData(prev => ({
          ...prev,
          featured_experiences_enabled: sectionSettings.featured_experiences !== false,
          faq_section_enabled: sectionSettings.faq_section !== false,
          internal_links_enabled: sectionSettings.internal_links_section !== false
        }))
      }
    } catch (error) {
      console.error('Error migrating from old system:', error)
    }
  }

  const handleSEOChange = (field: keyof SEOFormData, value: any) => {
    setSeoData(prev => ({ ...prev, [field]: value }))
  }

  async function saveCategorySelections() {
    const supabase = createClient()

    // Clear existing selections
    await supabase
      .from('homepage_category_selections')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    // Insert new selections
    if (selectedCategories.length > 0) {
      const categoryData = selectedCategories.map((categoryId, index) => ({
        category_id: categoryId,
        display_order: index,
        is_active: true
      }))

      await supabase
        .from('homepage_category_selections')
        .insert(categoryData)
    }
  }

  async function saveExperienceSelections() {
    const supabase = createClient()

    // Clear existing selections
    await supabase
      .from('homepage_experience_selections')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    // Insert new selections
    if (selectedExperiences.length > 0) {
      const experienceData = selectedExperiences.map((experienceId, index) => ({
        experience_id: experienceId,
        display_order: index,
        is_active: true
      }))

      await supabase
        .from('homepage_experience_selections')
        .insert(experienceData)
    }
  }

  const handleCategorySelection = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId])
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId))
    }
  }

  const handleExperienceSelection = (experienceId: string, checked: boolean) => {
    if (checked) {
      setSelectedExperiences(prev => [...prev, experienceId])
    } else {
      setSelectedExperiences(prev => prev.filter(id => id !== experienceId))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const supabase = createClient()
      
      const updateData = {
        ...(homepageId && { id: homepageId }),
        ...formData,
        schema_mode: schemaMode,
        custom_schema: (() => {
          if (schemaMode === 'custom' && customSchema && customSchema.trim()) {
            try {
              return JSON.parse(customSchema)
            } catch (e) {
              console.error('Failed to parse custom schema:', e)
              return null
            }
          }
          return null
        })(),
        ...seoData,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('homepage_unified')
        .upsert(updateData)

      if (error) {
        throw error
      }

      // Save category and experience selections
      await saveCategorySelections()
      await saveExperienceSelections()

      alert('Homepage updated successfully!')
    } catch (error: any) {
      console.error('Error saving homepage:', error)
      alert(`Error saving homepage: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading homepage data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Homepage Management</h1>
        <p className="text-gray-600 mt-2">Manage your homepage content, sections, and SEO settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Page Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Page Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="page_title">Page Title</Label>
                  <Input
                    id="page_title"
                    value={formData.page_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, page_title: e.target.value }))}
                    placeholder="Enter page title"
                  />
                </div>
                <div>
                  <Label htmlFor="page_description">Page Description</Label>
                  <Textarea
                    id="page_description"
                    value={formData.page_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, page_description: e.target.value }))}
                    placeholder="Enter page description"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hero_enabled"
                    checked={formData.hero_enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hero_enabled: checked }))}
                  />
                  <Label htmlFor="hero_enabled">Enable Hero Section</Label>
                </div>

                {formData.hero_enabled && (
                  <div className="space-y-4 border-l-4 border-blue-500 pl-4">
                    <div>
                      <Label htmlFor="hero_title">Hero Title</Label>
                      <Input
                        id="hero_title"
                        value={formData.hero_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, hero_title: e.target.value }))}
                        placeholder="Enter hero title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                      <Input
                        id="hero_subtitle"
                        value={formData.hero_subtitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                        placeholder="Enter hero subtitle"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero_description">Hero Description</Label>
                      <Textarea
                        id="hero_description"
                        value={formData.hero_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, hero_description: e.target.value }))}
                        placeholder="Enter hero description"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hero_button_text">Button Text</Label>
                        <Input
                          id="hero_button_text"
                          value={formData.hero_button_text}
                          onChange={(e) => setFormData(prev => ({ ...prev, hero_button_text: e.target.value }))}
                          placeholder="e.g., Explore Tours"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hero_button_link">Button Link</Label>
                        <Input
                          id="hero_button_link"
                          value={formData.hero_button_link}
                          onChange={(e) => setFormData(prev => ({ ...prev, hero_button_link: e.target.value }))}
                          placeholder="e.g., /tours"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="hero_background_image">Background Image URL</Label>
                      <Input
                        id="hero_background_image"
                        value={formData.hero_background_image}
                        onChange={(e) => setFormData(prev => ({ ...prev, hero_background_image: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        type="url"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Featured Categories Section */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Categories Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured_categories_enabled"
                    checked={formData.featured_categories_enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured_categories_enabled: checked }))}
                  />
                  <Label htmlFor="featured_categories_enabled">Enable Featured Categories Section</Label>
                </div>

                {formData.featured_categories_enabled && (
                  <div className="space-y-4 border-l-4 border-green-500 pl-4">
                    <div>
                      <Label htmlFor="featured_categories_title">Section Title</Label>
                      <Input
                        id="featured_categories_title"
                        value={formData.featured_categories_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured_categories_title: e.target.value }))}
                        placeholder="Enter section title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="featured_categories_subtitle">Section Subtitle</Label>
                      <Input
                        id="featured_categories_subtitle"
                        value={formData.featured_categories_subtitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured_categories_subtitle: e.target.value }))}
                        placeholder="Enter section subtitle"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Featured Experiences Section */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Experiences Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured_experiences_enabled"
                    checked={formData.featured_experiences_enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured_experiences_enabled: checked }))}
                  />
                  <Label htmlFor="featured_experiences_enabled">Enable Featured Experiences Section</Label>
                </div>

                {formData.featured_experiences_enabled && (
                  <div className="space-y-4 border-l-4 border-purple-500 pl-4">
                    <div>
                      <Label htmlFor="featured_experiences_title">Section Title</Label>
                      <Input
                        id="featured_experiences_title"
                        value={formData.featured_experiences_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured_experiences_title: e.target.value }))}
                        placeholder="Enter section title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="featured_experiences_subtitle">Section Subtitle</Label>
                      <Input
                        id="featured_experiences_subtitle"
                        value={formData.featured_experiences_subtitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured_experiences_subtitle: e.target.value }))}
                        placeholder="Enter section subtitle"
                      />
                    </div>
                    <div>
                      <Label htmlFor="featured_experiences_description">Section Description</Label>
                      <Textarea
                        id="featured_experiences_description"
                        value={formData.featured_experiences_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured_experiences_description: e.target.value }))}
                        placeholder="Enter section description"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <CardHeader>
                <CardTitle>Testimonials Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="testimonials_enabled"
                    checked={formData.testimonials_enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, testimonials_enabled: checked }))}
                  />
                  <Label htmlFor="testimonials_enabled">Enable Testimonials Section</Label>
                </div>

                {formData.testimonials_enabled && (
                  <div className="space-y-4 border-l-4 border-yellow-500 pl-4">
                    <div>
                      <Label htmlFor="testimonials_title">Section Title</Label>
                      <Input
                        id="testimonials_title"
                        value={formData.testimonials_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, testimonials_title: e.target.value }))}
                        placeholder="Enter section title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="testimonials_subtitle">Section Subtitle</Label>
                      <Input
                        id="testimonials_subtitle"
                        value={formData.testimonials_subtitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, testimonials_subtitle: e.target.value }))}
                        placeholder="Enter section subtitle"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>FAQ Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="faq_section_enabled"
                    checked={formData.faq_section_enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, faq_section_enabled: checked }))}
                  />
                  <Label htmlFor="faq_section_enabled">Enable FAQ Section</Label>
                </div>

                {formData.faq_section_enabled && (
                  <div className="space-y-4 border-l-4 border-red-500 pl-4">
                    <div>
                      <Label htmlFor="faq_section_title">Section Title</Label>
                      <Input
                        id="faq_section_title"
                        value={formData.faq_section_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, faq_section_title: e.target.value }))}
                        placeholder="Enter section title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="faq_section_subtitle">Section Subtitle</Label>
                      <Input
                        id="faq_section_subtitle"
                        value={formData.faq_section_subtitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, faq_section_subtitle: e.target.value }))}
                        placeholder="Enter section subtitle"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Internal Links Section */}
            <Card>
              <CardHeader>
                <CardTitle>Internal Links Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="internal_links_enabled"
                    checked={formData.internal_links_enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, internal_links_enabled: checked }))}
                  />
                  <Label htmlFor="internal_links_enabled">Enable Internal Links Section</Label>
                </div>

                {formData.internal_links_enabled && (
                  <div className="space-y-4 border-l-4 border-indigo-500 pl-4">
                    <div>
                      <Label htmlFor="internal_links_title">Section Title</Label>
                      <Input
                        id="internal_links_title"
                        value={formData.internal_links_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, internal_links_title: e.target.value }))}
                        placeholder="Enter section title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="internal_links_subtitle">Section Subtitle</Label>
                      <Input
                        id="internal_links_subtitle"
                        value={formData.internal_links_subtitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, internal_links_subtitle: e.target.value }))}
                        placeholder="Enter section subtitle"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Featured Categories Section */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Categories Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured_categories_section_enabled"
                    checked={formData.featured_categories_section_enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured_categories_section_enabled: checked }))}
                  />
                  <Label htmlFor="featured_categories_section_enabled">Enable Featured Categories Section</Label>
                </div>

                {formData.featured_categories_section_enabled && (
                  <div className="space-y-4 border-l-4 border-blue-500 pl-4">
                    <div>
                      <Label htmlFor="featured_categories_section_title">Section Title</Label>
                      <Input
                        id="featured_categories_section_title"
                        value={formData.featured_categories_section_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured_categories_section_title: e.target.value }))}
                        placeholder="Enter section title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="featured_categories_section_subtitle">Section Subtitle</Label>
                      <Textarea
                        id="featured_categories_section_subtitle"
                        value={formData.featured_categories_section_subtitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured_categories_section_subtitle: e.target.value }))}
                        placeholder="Enter section subtitle"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category Selection Section */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Categories Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Select which categories to display in the Featured Categories section on the homepage.
                </p>
                
                {formData.featured_categories_enabled ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                    {availableCategories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => handleCategorySelection(category.id, checked as boolean)}
                        />
                        <div className="flex items-center space-x-2 flex-1">
                          <span className="text-lg">{category.icon || '📂'}</span>
                          <div>
                            <Label htmlFor={`category-${category.id}`} className="font-medium cursor-pointer">
                              {category.name}
                            </Label>
                            <p className="text-xs text-gray-500">
                              {category.experience_count} experiences
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Featured Categories section is disabled. Enable it above to select categories.
                  </p>
                )}
                
                {selectedCategories.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      Selected: {selectedCategories.length} categories
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Experience Selection Section */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Experiences Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Select which experiences to display in the Featured Experiences section on the homepage.
                </p>
                
                {formData.featured_experiences_enabled ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                    {availableExperiences.map((experience) => (
                      <div key={experience.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={`experience-${experience.id}`}
                          checked={selectedExperiences.includes(experience.id)}
                          onCheckedChange={(checked) => handleExperienceSelection(experience.id, checked as boolean)}
                        />
                        <div className="flex items-center space-x-3 flex-1">
                          {experience.main_image_url && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                              <img 
                                src={experience.main_image_url} 
                                alt={experience.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <Label htmlFor={`experience-${experience.id}`} className="font-medium cursor-pointer line-clamp-1">
                              {experience.title}
                            </Label>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {experience.short_description}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <span>${experience.price}</span>
                              {experience.rating && (
                                <span>⭐ {experience.rating} ({experience.review_count} reviews)</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Featured Experiences section is disabled. Enable it above to select experiences.
                  </p>
                )}
                
                {selectedExperiences.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      Selected: {selectedExperiences.length} experiences
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Featured Categories Management Section */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Categories Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Manage the categories displayed in the "Explore Paris Top Attractions" section. You can reorder, add, or remove categories.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Current Categories</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('/admin/homepage-unified/categories', '_blank')}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Manage Categories
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Categories are loaded from the featured_categories_selections table and will appear in the order specified by display_order.
                  </div>
                  
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <p className="text-sm text-gray-700">
                      <strong>Current Categories:</strong> Eiffel Tower, Louvre Museum, Arc de Triomphe, Notre Dame, Montmartre, Versailles
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      To modify these categories, you can directly edit the featured_categories_selections table in the database or we can build a dedicated management interface.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Section */}
            <SEOFormFields
              data={seoData}
              onChange={handleSEOChange}
              baseUrl={process.env.NEXT_PUBLIC_SITE_URL || 'https://tps-site.com'}
              slug=""
              contentType="page"
            />

            {/* Schema Section */}
            <Card>
              <CardHeader>
                <CardTitle>Schema Management</CardTitle>
              </CardHeader>
              <CardContent>
                <SchemaEditor
                  value={customSchema}
                  onChange={setCustomSchema}
                  pageType="homepage"
                  schemaMode={schemaMode}
                  onSchemaModeChange={setSchemaMode}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Section Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Section Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Hero Section</span>
                  <div className={`w-3 h-3 rounded-full ${formData.hero_enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Featured Categories</span>
                  <div className={`w-3 h-3 rounded-full ${formData.featured_categories_enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Featured Experiences</span>
                  <div className={`w-3 h-3 rounded-full ${formData.featured_experiences_enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Testimonials</span>
                  <div className={`w-3 h-3 rounded-full ${formData.testimonials_enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">FAQ Section</span>
                  <div className={`w-3 h-3 rounded-full ${formData.faq_section_enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Internal Links</span>
                  <div className={`w-3 h-3 rounded-full ${formData.internal_links_enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
              </CardContent>
            </Card>

            {/* Schema Status */}
            <Card>
              <CardHeader>
                <CardTitle>Schema Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Schema Mode</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    schemaMode === 'custom' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {schemaMode === 'custom' ? 'Custom' : 'Default'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="sticky top-6">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Update Homepage'}
              </Button>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      hero_enabled: true,
                      featured_categories_enabled: true,
                      featured_experiences_enabled: true,
                      testimonials_enabled: true,
                      faq_section_enabled: true,
                      internal_links_enabled: true
                    }))
                  }}
                >
                  Enable All Sections
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      hero_enabled: false,
                      featured_categories_enabled: false,
                      featured_experiences_enabled: false,
                      testimonials_enabled: false,
                      faq_section_enabled: false,
                      internal_links_enabled: false
                    }))
                  }}
                >
                  Disable All Sections
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}