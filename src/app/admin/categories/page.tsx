'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Save, Plus, Edit, Trash2, Eye, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SchemaEditor } from '@/components/admin/SchemaEditor'

interface CategoryPage {
  id: string
  category_slug: string
  category_name: string
  hero_title: string
  hero_subtitle: string
  hero_rating: number
  hero_rating_count: number
  hero_from_price: number
  hero_currency: string
  hero_badges: string[]
  hero_benefit_bullets: string[]
  hero_image_url: string
  hero_primary_cta_label: string
  primary_ticket_list_heading: string
  primary_ticket_list_enabled: boolean
  primary_ticket_list_experience_ids: string[]
  category_tags: string[]
  destination_upsell_heading: string
  destination_upsell_enabled: boolean
  seo_intro_heading: string
  seo_intro_content: string
  things_to_know_heading: string
  things_to_know_items: any[]
  snapshot_guide_heading: string
  snapshot_guide_col1_heading: string
  snapshot_guide_col1_content: string
  snapshot_guide_col2_heading: string
  snapshot_guide_col2_content: string
  snapshot_guide_col3_heading: string
  snapshot_guide_col3_content: string
  ticket_scope_heading: string
  ticket_scope_inclusions: any[]
  ticket_scope_exclusions: any[]
  ticket_scope_notes: string
  photo_gallery_heading: string
  photo_gallery_images: any[]
  onsite_experiences_heading: string
  onsite_experiences_items: any[]
  reviews_heading: string
  reviews_avg_rating: number
  reviews_total_count: number
  reviews_distribution: any
  faq_heading: string
  faq_items: any[]
  related_content_heading: string
  related_content_items: any[]
  seo_tags: string[]
  is_active: boolean
}

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

interface UpsellItem {
  id: string
  category_slug: string
  title: string
  teaser: string
  image_url: string
  price_from: number
  rating: number
  link_url: string
  link_type: string
  display_order: number
  is_active: boolean
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<CategoryPage[]>([])
  const [upsellItems, setUpsellItems] = useState<UpsellItem[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [selectedCategory, setSelectedCategory] = useState<CategoryPage | null>(null)
  const [selectedUpsells, setSelectedUpsells] = useState<UpsellItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchUpsellItems()
    fetchExperiences()
  }, [])

  async function fetchCategories() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('category_pages')
        .select('*')
        .order('category_name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  async function fetchUpsellItems() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('category_upsell_items')
        .select('*')
        .order('category_slug', { ascending: true })
        .order('display_order', { ascending: true })

      if (error) throw error
      setUpsellItems(data || [])
    } catch (error) {
      console.error('Error fetching upsell items:', error)
    }
  }

  async function fetchExperiences() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('experiences')
        .select(`
          *,
          cities:city_id(name),
          categories:category_id(name)
        `)
        .eq('status', 'active')
        .order('title')

      if (error) throw error
      setExperiences(data || [])
    } catch (error) {
      console.error('Error fetching experiences:', error)
    }
  }

  async function saveCategory(categoryData: Partial<CategoryPage>) {
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      
      // Ensure required fields have defaults
      const dataToSave = {
        ...categoryData,
        primary_ticket_list_heading: categoryData.primary_ticket_list_heading || 'Available Tickets & Tours',
        primary_ticket_list_enabled: categoryData.primary_ticket_list_enabled ?? true,
        primary_ticket_list_experience_ids: categoryData.primary_ticket_list_experience_ids || [],
        category_tags: categoryData.category_tags || [],
        destination_upsell_heading: categoryData.destination_upsell_heading || 'Make the most of Paris',
        destination_upsell_enabled: categoryData.destination_upsell_enabled ?? true,
      }
      
      if (categoryData.id) {
        // Update existing
        const { error } = await supabase
          .from('category_pages')
          .update(dataToSave)
          .eq('id', categoryData.id)
        
        if (error) throw error
        setSuccess('Category updated successfully')
      } else {
        // Create new
        const { error } = await supabase
          .from('category_pages')
          .insert([dataToSave])
        
        if (error) throw error
        setSuccess('Category created successfully')
      }
      
      await fetchCategories()
      setSelectedCategory(null)
      setIsEditing(false)
      setShowCreateForm(false)
    } catch (error: any) {
      console.error('Error saving category:', error)
      setError(error.message || 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category page?')) return
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('category_pages')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setSuccess('Category deleted successfully')
      await fetchCategories()
      setSelectedCategory(null)
    } catch (error: any) {
      console.error('Error deleting category:', error)
      setError(error.message || 'Failed to delete category')
    }
  }

  function selectCategory(category: CategoryPage) {
    setSelectedCategory(category)
    const categoryUpsells = upsellItems.filter(item => item.category_slug === category.category_slug)
    setSelectedUpsells(categoryUpsells)
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Category Pages Management</h1>
          <p className="text-gray-600 mt-2">Manage comprehensive category page templates with all content sections</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Category
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Categories List */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Pages ({categories.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCategory?.id === category.id 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => selectCategory(category)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{category.category_name}</h3>
                      <p className="text-sm text-gray-600">/{category.category_slug}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          €{category.hero_from_price} • {category.hero_rating}★
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Category Details */}
        <div className="lg:col-span-8">
          {selectedCategory ? (
            <CategoryEditor
              category={selectedCategory}
              upsellItems={selectedUpsells}
              experiences={experiences}
              isEditing={isEditing}
              saving={saving}
              onEdit={() => setIsEditing(true)}
              onSave={saveCategory}
              onCancel={() => setIsEditing(false)}
              onDelete={() => deleteCategory(selectedCategory.id)}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">Select a category to view and edit its content</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Category Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Category Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <CreateCategoryForm
              onSave={saveCategory}
              onCancel={() => setShowCreateForm(false)}
              saving={saving}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CategoryEditorProps {
  category: CategoryPage
  upsellItems: UpsellItem[]
  experiences: Experience[]
  isEditing: boolean
  saving: boolean
  onEdit: () => void
  onSave: (data: Partial<CategoryPage>) => void
  onCancel: () => void
  onDelete: () => void
}

function CategoryEditor({ category, upsellItems, experiences, isEditing, saving, onEdit, onSave, onCancel, onDelete }: CategoryEditorProps) {
  const [formData, setFormData] = useState<CategoryPage>(category)

  useEffect(() => {
    setFormData(category)
  }, [category])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(formData)
  }

  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{category.category_name}</CardTitle>
              <p className="text-gray-600">/{category.category_slug}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`/C/${category.category_slug}`} target="_blank">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CategoryPreview category={category} upsellItems={upsellItems} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit {category.category_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CategoryForm formData={formData} setFormData={setFormData} experiences={experiences} />
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

interface CategoryFormProps {
  formData: CategoryPage
  setFormData: (data: CategoryPage) => void
  experiences: Experience[]
}

function CategoryForm({ formData, setFormData, experiences }: CategoryFormProps) {
  function updateField(field: keyof CategoryPage, value: any) {
    setFormData({ ...formData, [field]: value })
  }

  function updateArrayField(field: keyof CategoryPage, index: number, value: any) {
    const array = [...(formData[field] as any[])]
    array[index] = value
    updateField(field, array)
  }

  function addArrayItem(field: keyof CategoryPage, defaultItem: any) {
    const array = [...(formData[field] as any[]), defaultItem]
    updateField(field, array)
  }

  function removeArrayItem(field: keyof CategoryPage, index: number) {
    const array = (formData[field] as any[]).filter((_, i) => i !== index)
    updateField(field, array)
  }

  return (
    <Accordion type="multiple" className="w-full">
      {/* Basic Info */}
      <AccordionItem value="basic">
        <AccordionTrigger>Basic Information</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category_name">Category Name</Label>
              <Input
                id="category_name"
                value={formData.category_name}
                onChange={(e) => updateField('category_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category_slug">Category Slug</Label>
              <Input
                id="category_slug"
                value={formData.category_slug}
                onChange={(e) => updateField('category_slug', e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => updateField('is_active', checked)}
            />
            <Label>Active</Label>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* S1 - Hero Section */}
      <AccordionItem value="hero">
        <AccordionTrigger>S1 - Hero Section</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label htmlFor="hero_title">Hero Title</Label>
            <Input
              id="hero_title"
              value={formData.hero_title}
              onChange={(e) => updateField('hero_title', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
            <Textarea
              id="hero_subtitle"
              value={formData.hero_subtitle}
              onChange={(e) => updateField('hero_subtitle', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="hero_rating">Rating</Label>
              <Input
                id="hero_rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.hero_rating}
                onChange={(e) => updateField('hero_rating', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="hero_rating_count">Rating Count</Label>
              <Input
                id="hero_rating_count"
                type="number"
                value={formData.hero_rating_count}
                onChange={(e) => updateField('hero_rating_count', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="hero_from_price">From Price</Label>
              <Input
                id="hero_from_price"
                type="number"
                value={formData.hero_from_price}
                onChange={(e) => updateField('hero_from_price', parseInt(e.target.value))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="hero_image_url">Hero Image URL</Label>
            <Input
              id="hero_image_url"
              value={formData.hero_image_url}
              onChange={(e) => updateField('hero_image_url', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hero_primary_cta_label">Primary CTA Label</Label>
            <Input
              id="hero_primary_cta_label"
              value={formData.hero_primary_cta_label}
              onChange={(e) => updateField('hero_primary_cta_label', e.target.value)}
            />
          </div>
          
          {/* Badges */}
          <div>
            <Label>Hero Badges</Label>
            {formData.hero_badges?.map((badge, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={badge}
                  onChange={(e) => updateArrayField('hero_badges', index, e.target.value)}
                  placeholder="Badge text"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('hero_badges', index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayItem('hero_badges', '')}
            >
              Add Badge
            </Button>
          </div>

          {/* Benefits */}
          <div>
            <Label>Hero Benefits</Label>
            {formData.hero_benefit_bullets?.map((benefit, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={benefit}
                  onChange={(e) => updateArrayField('hero_benefit_bullets', index, e.target.value)}
                  placeholder="Benefit text"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('hero_benefit_bullets', index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayItem('hero_benefit_bullets', '')}
            >
              Add Benefit
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* S2 - Primary Ticket List */}
      <AccordionItem value="primary-ticket-list">
        <AccordionTrigger>S2 - Primary Ticket List</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label htmlFor="primary_ticket_list_heading">Primary Ticket List Heading</Label>
            <Input
              id="primary_ticket_list_heading"
              value={formData.primary_ticket_list_heading || 'Available Tickets & Tours'}
              onChange={(e) => updateField('primary_ticket_list_heading', e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.primary_ticket_list_enabled ?? true}
              onCheckedChange={(checked) => updateField('primary_ticket_list_enabled', checked)}
            />
            <Label>Enable Primary Ticket List</Label>
          </div>
          
          <div>
            <Label>Select Experiences/Tours to Display</Label>
            <div className="grid grid-cols-1 gap-2 mt-2 max-h-60 overflow-y-auto border rounded p-2">
              {experiences.map((experience) => (
                <div key={experience.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`experience-${experience.id}`}
                    checked={formData.primary_ticket_list_experience_ids?.includes(experience.id) || false}
                    onChange={(e) => {
                      const currentIds = formData.primary_ticket_list_experience_ids || []
                      if (e.target.checked) {
                        updateField('primary_ticket_list_experience_ids', [...currentIds, experience.id])
                      } else {
                        updateField('primary_ticket_list_experience_ids', currentIds.filter(id => id !== experience.id))
                      }
                    }}
                    className="rounded"
                  />
                  <label htmlFor={`experience-${experience.id}`} className="text-sm flex-1 cursor-pointer">
                    <div className="font-medium">{experience.title}</div>
                    <div className="text-gray-500 text-xs">${experience.price} • {experience.duration} • {experience.rating}★</div>
                  </label>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected {formData.primary_ticket_list_experience_ids?.length || 0} experiences
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* S3 - Category Tags */}
      <AccordionItem value="category-tags">
        <AccordionTrigger>S3 - Category/Topic Tags</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label>Category Tags</Label>
            {formData.category_tags?.map((tag, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={tag}
                  onChange={(e) => updateArrayField('category_tags', index, e.target.value)}
                  placeholder="Tag name"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('category_tags', index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayItem('category_tags', '')}
            >
              Add Tag
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* S4 - Destination Upsell Carousel */}
      <AccordionItem value="destination-upsell">
        <AccordionTrigger>S4 - Destination Upsell Carousel</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label htmlFor="destination_upsell_heading">Destination Upsell Heading</Label>
            <Input
              id="destination_upsell_heading"
              value={formData.destination_upsell_heading || 'Make the most of Paris'}
              onChange={(e) => updateField('destination_upsell_heading', e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.destination_upsell_enabled ?? true}
              onCheckedChange={(checked) => updateField('destination_upsell_enabled', checked)}
            />
            <Label>Enable Destination Upsell</Label>
          </div>
          <p className="text-sm text-gray-500">
            Upsell items are managed separately in the category upsell items table.
          </p>
        </AccordionContent>
      </AccordionItem>

      {/* S5 - SEO Intro */}
      <AccordionItem value="seo-intro">
        <AccordionTrigger>S5 - SEO Intro Content</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label htmlFor="seo_intro_heading">SEO Intro Heading</Label>
            <Input
              id="seo_intro_heading"
              value={formData.seo_intro_heading}
              onChange={(e) => updateField('seo_intro_heading', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="seo_intro_content">SEO Intro Content (HTML)</Label>
            <Textarea
              id="seo_intro_content"
              rows={6}
              value={formData.seo_intro_content}
              onChange={(e) => updateField('seo_intro_content', e.target.value)}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Snapshot Guide */}
      <AccordionItem value="snapshot-guide">
        <AccordionTrigger>S7 - 3-Column Snapshot Guide</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label htmlFor="snapshot_guide_heading">Snapshot Guide Heading</Label>
            <Input
              id="snapshot_guide_heading"
              value={formData.snapshot_guide_heading}
              onChange={(e) => updateField('snapshot_guide_heading', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="snapshot_guide_col1_heading">Column 1 Heading</Label>
              <Input
                id="snapshot_guide_col1_heading"
                value={formData.snapshot_guide_col1_heading}
                onChange={(e) => updateField('snapshot_guide_col1_heading', e.target.value)}
              />
              <Label htmlFor="snapshot_guide_col1_content" className="mt-2">Column 1 Content</Label>
              <Textarea
                id="snapshot_guide_col1_content"
                rows={4}
                value={formData.snapshot_guide_col1_content}
                onChange={(e) => updateField('snapshot_guide_col1_content', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="snapshot_guide_col2_heading">Column 2 Heading</Label>
              <Input
                id="snapshot_guide_col2_heading"
                value={formData.snapshot_guide_col2_heading}
                onChange={(e) => updateField('snapshot_guide_col2_heading', e.target.value)}
              />
              <Label htmlFor="snapshot_guide_col2_content" className="mt-2">Column 2 Content</Label>
              <Textarea
                id="snapshot_guide_col2_content"
                rows={4}
                value={formData.snapshot_guide_col2_content}
                onChange={(e) => updateField('snapshot_guide_col2_content', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="snapshot_guide_col3_heading">Column 3 Heading</Label>
              <Input
                id="snapshot_guide_col3_heading"
                value={formData.snapshot_guide_col3_heading}
                onChange={(e) => updateField('snapshot_guide_col3_heading', e.target.value)}
              />
              <Label htmlFor="snapshot_guide_col3_content" className="mt-2">Column 3 Content</Label>
              <Textarea
                id="snapshot_guide_col3_content"
                rows={4}
                value={formData.snapshot_guide_col3_content}
                onChange={(e) => updateField('snapshot_guide_col3_content', e.target.value)}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Things To Know */}
      <AccordionItem value="things-to-know">
        <AccordionTrigger>S6 - Things To Know</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label htmlFor="things_to_know_heading">Things To Know Heading</Label>
            <Input
              id="things_to_know_heading"
              value={formData.things_to_know_heading}
              onChange={(e) => updateField('things_to_know_heading', e.target.value)}
            />
          </div>
          
          <div>
            <Label>Things To Know Items</Label>
            {formData.things_to_know_items?.map((item, index) => (
              <div key={index} className="border p-4 rounded-lg mt-2">
                <div className="space-y-2">
                  <Input
                    value={item.label || ''}
                    onChange={(e) => updateArrayField('things_to_know_items', index, { ...item, label: e.target.value })}
                    placeholder="Label (e.g., Duration)"
                  />
                  <Input
                    value={item.text || ''}
                    onChange={(e) => updateArrayField('things_to_know_items', index, { ...item, text: e.target.value })}
                    placeholder="Text (e.g., 2-3 hours)"
                  />
                  <Input
                    value={item.icon || ''}
                    onChange={(e) => updateArrayField('things_to_know_items', index, { ...item, icon: e.target.value })}
                    placeholder="Icon (clock, mobile, cancel, wheelchair, bag, camera)"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('things_to_know_items', index)}
                  >
                    Remove Item
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayItem('things_to_know_items', { label: '', text: '', icon: 'clock' })}
            >
              Add Item
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Ticket Scope */}
      <AccordionItem value="ticket-scope">
        <AccordionTrigger>S8 - Ticket Scope (What's Included/Excluded)</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label htmlFor="ticket_scope_heading">Ticket Scope Heading</Label>
            <Input
              id="ticket_scope_heading"
              value={formData.ticket_scope_heading}
              onChange={(e) => updateField('ticket_scope_heading', e.target.value)}
            />
          </div>
          
          <div>
            <Label>Inclusions</Label>
            {formData.ticket_scope_inclusions?.map((item, index) => (
              <div key={index} className="border p-4 rounded-lg mt-2">
                <div className="space-y-2">
                  <Input
                    value={item.label || ''}
                    onChange={(e) => updateArrayField('ticket_scope_inclusions', index, { ...item, label: e.target.value })}
                    placeholder="Inclusion label"
                  />
                  <Input
                    value={item.text || ''}
                    onChange={(e) => updateArrayField('ticket_scope_inclusions', index, { ...item, text: e.target.value })}
                    placeholder="Inclusion description"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('ticket_scope_inclusions', index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayItem('ticket_scope_inclusions', { label: '', text: '' })}
            >
              Add Inclusion
            </Button>
          </div>

          <div>
            <Label>Exclusions</Label>
            {formData.ticket_scope_exclusions?.map((item, index) => (
              <div key={index} className="border p-4 rounded-lg mt-2">
                <div className="space-y-2">
                  <Input
                    value={item.label || ''}
                    onChange={(e) => updateArrayField('ticket_scope_exclusions', index, { ...item, label: e.target.value })}
                    placeholder="Exclusion label"
                  />
                  <Input
                    value={item.text || ''}
                    onChange={(e) => updateArrayField('ticket_scope_exclusions', index, { ...item, text: e.target.value })}
                    placeholder="Exclusion description"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('ticket_scope_exclusions', index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayItem('ticket_scope_exclusions', { label: '', text: '' })}
            >
              Add Exclusion
            </Button>
          </div>

          <div>
            <Label htmlFor="ticket_scope_notes">Additional Notes</Label>
            <Textarea
              id="ticket_scope_notes"
              value={formData.ticket_scope_notes}
              onChange={(e) => updateField('ticket_scope_notes', e.target.value)}
              placeholder="Any additional notes about inclusions/exclusions"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Photo Gallery */}
      <AccordionItem value="photo-gallery">
        <AccordionTrigger>S9 - Photo Gallery</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label htmlFor="photo_gallery_heading">Photo Gallery Heading</Label>
            <Input
              id="photo_gallery_heading"
              value={formData.photo_gallery_heading}
              onChange={(e) => updateField('photo_gallery_heading', e.target.value)}
            />
          </div>
          
          <div>
            <Label>Gallery Images</Label>
            {formData.photo_gallery_images?.map((image, index) => (
              <div key={index} className="border p-4 rounded-lg mt-2">
                <div className="space-y-2">
                  <Input
                    value={image.url || ''}
                    onChange={(e) => updateArrayField('photo_gallery_images', index, { ...image, url: e.target.value })}
                    placeholder="Image URL"
                  />
                  <Input
                    value={image.alt || ''}
                    onChange={(e) => updateArrayField('photo_gallery_images', index, { ...image, alt: e.target.value })}
                    placeholder="Alt text"
                  />
                  <Input
                    value={image.caption || ''}
                    onChange={(e) => updateArrayField('photo_gallery_images', index, { ...image, caption: e.target.value })}
                    placeholder="Caption (optional)"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('photo_gallery_images', index)}
                  >
                    Remove Image
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayItem('photo_gallery_images', { url: '', alt: '', caption: '' })}
            >
              Add Image
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* On-Site Experiences */}
      <AccordionItem value="onsite-experiences">
        <AccordionTrigger>S10 - On-Site Experiences</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label htmlFor="onsite_experiences_heading">On-Site Experiences Heading</Label>
            <Input
              id="onsite_experiences_heading"
              value={formData.onsite_experiences_heading}
              onChange={(e) => updateField('onsite_experiences_heading', e.target.value)}
            />
          </div>
          
          <div>
            <Label>Experience Items</Label>
            {formData.onsite_experiences_items?.map((item, index) => (
              <div key={index} className="border p-4 rounded-lg mt-2">
                <div className="space-y-2">
                  <Input
                    value={item.title || ''}
                    onChange={(e) => updateArrayField('onsite_experiences_items', index, { ...item, title: e.target.value })}
                    placeholder="Experience title"
                  />
                  <Input
                    value={item.teaser || ''}
                    onChange={(e) => updateArrayField('onsite_experiences_items', index, { ...item, teaser: e.target.value })}
                    placeholder="Experience description"
                  />
                  <Input
                    value={item.image_url || ''}
                    onChange={(e) => updateArrayField('onsite_experiences_items', index, { ...item, image_url: e.target.value })}
                    placeholder="Image URL"
                  />
                  <Input
                    value={item.link_url || ''}
                    onChange={(e) => updateArrayField('onsite_experiences_items', index, { ...item, link_url: e.target.value })}
                    placeholder="Link URL (optional)"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('onsite_experiences_items', index)}
                  >
                    Remove Experience
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayItem('onsite_experiences_items', { title: '', teaser: '', image_url: '', link_url: '' })}
            >
              Add Experience
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Reviews */}
      <AccordionItem value="reviews">
        <AccordionTrigger>S11 - Reviews Summary</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label htmlFor="reviews_heading">Reviews Heading</Label>
            <Input
              id="reviews_heading"
              value={formData.reviews_heading}
              onChange={(e) => updateField('reviews_heading', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reviews_avg_rating">Average Rating</Label>
              <Input
                id="reviews_avg_rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.reviews_avg_rating}
                onChange={(e) => updateField('reviews_avg_rating', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="reviews_total_count">Total Reviews</Label>
              <Input
                id="reviews_total_count"
                type="number"
                value={formData.reviews_total_count}
                onChange={(e) => updateField('reviews_total_count', parseInt(e.target.value))}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* FAQ Section */}
      <AccordionItem value="faq">
        <AccordionTrigger>S12 - FAQ Section</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label htmlFor="faq_heading">FAQ Heading</Label>
            <Input
              id="faq_heading"
              value={formData.faq_heading}
              onChange={(e) => updateField('faq_heading', e.target.value)}
            />
          </div>
          
          <div>
            <Label>FAQ Items</Label>
            {formData.faq_items?.map((faq, index) => (
              <div key={index} className="border p-4 rounded-lg mt-2">
                <div className="space-y-2">
                  <Input
                    value={faq.question || ''}
                    onChange={(e) => updateArrayField('faq_items', index, { ...faq, question: e.target.value })}
                    placeholder="Question"
                  />
                  <Textarea
                    value={faq.answer || ''}
                    onChange={(e) => updateArrayField('faq_items', index, { ...faq, answer: e.target.value })}
                    placeholder="Answer"
                    rows={3}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('faq_items', index)}
                  >
                    Remove FAQ
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayItem('faq_items', { question: '', answer: '' })}
            >
              Add FAQ
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Related Content */}
      <AccordionItem value="related-content">
        <AccordionTrigger>S13 - Related Content</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label htmlFor="related_content_heading">Related Content Heading</Label>
            <Input
              id="related_content_heading"
              value={formData.related_content_heading}
              onChange={(e) => updateField('related_content_heading', e.target.value)}
            />
          </div>
          
          <div>
            <Label>Related Articles</Label>
            {formData.related_content_items?.map((item, index) => (
              <div key={index} className="border p-4 rounded-lg mt-2">
                <div className="space-y-2">
                  <Input
                    value={item.title || ''}
                    onChange={(e) => updateArrayField('related_content_items', index, { ...item, title: e.target.value })}
                    placeholder="Article title"
                  />
                  <Input
                    value={item.excerpt || ''}
                    onChange={(e) => updateArrayField('related_content_items', index, { ...item, excerpt: e.target.value })}
                    placeholder="Article excerpt"
                  />
                  <Input
                    value={item.image_url || ''}
                    onChange={(e) => updateArrayField('related_content_items', index, { ...item, image_url: e.target.value })}
                    placeholder="Image URL"
                  />
                  <Input
                    value={item.url || ''}
                    onChange={(e) => updateArrayField('related_content_items', index, { ...item, url: e.target.value })}
                    placeholder="Article URL"
                  />
                  <Input
                    value={item.read_time || ''}
                    onChange={(e) => updateArrayField('related_content_items', index, { ...item, read_time: e.target.value })}
                    placeholder="Read time (e.g., 5 min)"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('related_content_items', index)}
                  >
                    Remove Article
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayItem('related_content_items', { title: '', excerpt: '', image_url: '', url: '', read_time: '' })}
            >
              Add Article
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* SEO & Schema Configuration */}
      <AccordionItem value="seo-section">
        <AccordionTrigger>S14 - SEO & Schema Configuration</AccordionTrigger>
        <AccordionContent className="space-y-6">
          <Tabs defaultValue="seo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="seo">SEO Settings</TabsTrigger>
              <TabsTrigger value="schema">Custom Schema</TabsTrigger>
            </TabsList>
            
            <TabsContent value="seo" className="space-y-6">
              {/* Basic SEO */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Basic SEO</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                      id="seo_title"
                      value={(formData as any).seo_title || ''}
                      onChange={(e) => updateField('seo_title', e.target.value)}
                      placeholder="Page title for search engines"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <Textarea
                      id="seo_description"
                      value={(formData as any).seo_description || ''}
                      onChange={(e) => updateField('seo_description', e.target.value)}
                      placeholder="Meta description for search engines"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_keywords">SEO Keywords</Label>
                    <Input
                      id="seo_keywords"
                      value={(formData as any).seo_keywords || ''}
                      onChange={(e) => updateField('seo_keywords', e.target.value)}
                      placeholder="Comma-separated keywords"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_focus_keyword">Focus Keyword</Label>
                    <Input
                      id="seo_focus_keyword"
                      value={(formData as any).seo_focus_keyword || ''}
                      onChange={(e) => updateField('seo_focus_keyword', e.target.value)}
                      placeholder="Primary keyword for this page"
                    />
                  </div>
                </div>
              </div>

              {/* Technical SEO */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Technical SEO</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="seo_canonical_url">Canonical URL</Label>
                    <Input
                      id="seo_canonical_url"
                      value={(formData as any).seo_canonical_url || ''}
                      onChange={(e) => updateField('seo_canonical_url', e.target.value)}
                      placeholder="https://example.com/canonical-url"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_robots">Robots Meta Tag</Label>
                    <Input
                      id="seo_robots"
                      value={(formData as any).seo_robots || 'index, follow'}
                      onChange={(e) => updateField('seo_robots', e.target.value)}
                      placeholder="index, follow"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="seo_priority">Sitemap Priority</Label>
                      <Input
                        id="seo_priority"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={(formData as any).seo_priority || 0.8}
                        onChange={(e) => updateField('seo_priority', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="seo_change_frequency">Change Frequency</Label>
                      <Input
                        id="seo_change_frequency"
                        value={(formData as any).seo_change_frequency || 'weekly'}
                        onChange={(e) => updateField('seo_change_frequency', e.target.value)}
                        placeholder="daily, weekly, monthly"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Open Graph */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Open Graph (Facebook)</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="seo_og_title">OG Title</Label>
                    <Input
                      id="seo_og_title"
                      value={(formData as any).seo_og_title || ''}
                      onChange={(e) => updateField('seo_og_title', e.target.value)}
                      placeholder="Facebook share title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_og_description">OG Description</Label>
                    <Textarea
                      id="seo_og_description"
                      value={(formData as any).seo_og_description || ''}
                      onChange={(e) => updateField('seo_og_description', e.target.value)}
                      placeholder="Facebook share description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_og_image">OG Image</Label>
                    <Input
                      id="seo_og_image"
                      value={(formData as any).seo_og_image || ''}
                      onChange={(e) => updateField('seo_og_image', e.target.value)}
                      placeholder="https://example.com/og-image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_og_type">OG Type</Label>
                    <Input
                      id="seo_og_type"
                      value={(formData as any).seo_og_type || 'website'}
                      onChange={(e) => updateField('seo_og_type', e.target.value)}
                      placeholder="website, article, product"
                    />
                  </div>
                </div>
              </div>

              {/* Twitter Cards */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Twitter Cards</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="seo_twitter_title">Twitter Title</Label>
                    <Input
                      id="seo_twitter_title"
                      value={(formData as any).seo_twitter_title || ''}
                      onChange={(e) => updateField('seo_twitter_title', e.target.value)}
                      placeholder="Twitter share title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_twitter_description">Twitter Description</Label>
                    <Textarea
                      id="seo_twitter_description"
                      value={(formData as any).seo_twitter_description || ''}
                      onChange={(e) => updateField('seo_twitter_description', e.target.value)}
                      placeholder="Twitter share description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_twitter_image">Twitter Image</Label>
                    <Input
                      id="seo_twitter_image"
                      value={(formData as any).seo_twitter_image || ''}
                      onChange={(e) => updateField('seo_twitter_image', e.target.value)}
                      placeholder="https://example.com/twitter-image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_twitter_card">Twitter Card Type</Label>
                    <Input
                      id="seo_twitter_card"
                      value={(formData as any).seo_twitter_card || 'summary_large_image'}
                      onChange={(e) => updateField('seo_twitter_card', e.target.value)}
                      placeholder="summary_large_image, summary"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schema" className="space-y-6">
              <SchemaEditor
                schemaMode={(formData as any).schema_mode || 'default'}
                customSchema={(formData as any).custom_schema}
                onSchemaModeChange={(mode) => updateField('schema_mode', mode)}
                onCustomSchemaChange={(schema) => updateField('custom_schema', schema)}
                schemaType="category"
              />
            </TabsContent>
          </Tabs>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function CategoryPreview({ category, upsellItems }: { category: CategoryPage, upsellItems: UpsellItem[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Basic Info</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Status:</strong> {category.is_active ? 'Active' : 'Inactive'}
          </div>
          <div>
            <strong>Slug:</strong> /{category.category_slug}
          </div>
          <div>
            <strong>Rating:</strong> {category.hero_rating} ({category.hero_rating_count} reviews)
          </div>
          <div>
            <strong>Price:</strong> {category.hero_currency}{category.hero_from_price}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Hero Section</h3>
        <div className="text-sm space-y-2">
          <div><strong>Title:</strong> {category.hero_title}</div>
          <div><strong>Subtitle:</strong> {category.hero_subtitle}</div>
          {category.hero_badges?.length > 0 && (
            <div><strong>Badges:</strong> {category.hero_badges.join(', ')}</div>
          )}
          {category.hero_benefit_bullets?.length > 0 && (
            <div><strong>Benefits:</strong> {category.hero_benefit_bullets.length} items</div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Content Sections</h3>
        <div className="text-sm space-y-1">
          <div>SEO Intro: {category.seo_intro_heading ? '✓' : '✗'}</div>
          <div>Snapshot Guide: {category.snapshot_guide_heading ? '✓' : '✗'}</div>
          <div>FAQ Items: {category.faq_items?.length || 0}</div>
          <div>Photo Gallery: {category.photo_gallery_images?.length || 0} images</div>
        </div>
      </div>

      {upsellItems.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Upsell Items ({upsellItems.length})</h3>
          <div className="space-y-1 text-sm">
            {upsellItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.title}</span>
                <span>€{item.price_from}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CreateCategoryForm({ onSave, onCancel, saving }: { onSave: (data: Partial<CategoryPage>) => void, onCancel: () => void, saving: boolean }) {
  const [formData, setFormData] = useState<Partial<CategoryPage>>({
    category_name: '',
    category_slug: '',
    hero_title: '',
    hero_subtitle: '',
    hero_rating: 4.8,
    hero_rating_count: 0,
    hero_from_price: 0,
    hero_currency: '€',
    hero_badges: [],
    hero_benefit_bullets: [],
    hero_image_url: '',
    hero_primary_cta_label: 'See Tickets & Prices',
    primary_ticket_list_heading: 'Available Tickets & Tours',
    primary_ticket_list_enabled: true,
    primary_ticket_list_experience_ids: [],
    category_tags: ['Skip the Line', 'Mobile Tickets', 'Instant Confirmation'],
    destination_upsell_heading: 'Make the most of Paris',
    destination_upsell_enabled: true,
    seo_intro_heading: '',
    seo_intro_content: '',
    things_to_know_heading: 'Good to Know',
    things_to_know_items: [],
    snapshot_guide_heading: 'Quick Guide',
    snapshot_guide_col1_heading: '',
    snapshot_guide_col1_content: '',
    snapshot_guide_col2_heading: '',
    snapshot_guide_col2_content: '',
    snapshot_guide_col3_heading: '',
    snapshot_guide_col3_content: '',
    ticket_scope_heading: 'What\'s Included',
    ticket_scope_inclusions: [],
    ticket_scope_exclusions: [],
    ticket_scope_notes: '',
    photo_gallery_heading: 'Photo Gallery',
    photo_gallery_images: [],
    onsite_experiences_heading: 'On-Site Experiences',
    onsite_experiences_items: [],
    reviews_heading: 'Reviews',
    reviews_avg_rating: 4.8,
    reviews_total_count: 0,
    reviews_distribution: {},
    faq_heading: 'Frequently Asked Questions',
    faq_items: [],
    related_content_heading: 'Related Articles',
    related_content_items: [],
    seo_tags: [],
    schema_mode: 'default',
    custom_schema: null,
    is_active: true
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category_name">Category Name *</Label>
          <Input
            id="category_name"
            required
            value={formData.category_name || ''}
            onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="category_slug">Category Slug *</Label>
          <Input
            id="category_slug"
            required
            value={formData.category_slug || ''}
            onChange={(e) => setFormData({ ...formData, category_slug: e.target.value })}
            placeholder="e.g., eiffel-tower"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="hero_title">Hero Title *</Label>
        <Input
          id="hero_title"
          required
          value={formData.hero_title || ''}
          onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
        <Textarea
          id="hero_subtitle"
          value={formData.hero_subtitle || ''}
          onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="hero_image_url">Hero Image URL *</Label>
        <Input
          id="hero_image_url"
          required
          value={formData.hero_image_url || ''}
          onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create Category'}
        </Button>
      </div>
    </form>
  )
}