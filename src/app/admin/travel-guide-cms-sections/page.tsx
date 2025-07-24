'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, Trash2, ExternalLink, Settings, List } from 'lucide-react'
import { travelGuideService } from '@/lib/supabase/travelGuideService'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase'

interface TravelGuide {
  id: string
  title: string
  slug: string
}

interface CMSSection {
  id: string
  guide_id: string
  type: 'featured_category' | 'featured_product' | 'category_carousel' | 'product_carousel'
  title: string
  subtitle?: string
  position: number
  enabled: boolean
  items: any[]
}

interface Experience {
  id: string
  title: string
  slug: string
  price?: number
  main_image_url?: string
  rating?: number
  featured?: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  experience_count?: number
}

interface SectionItem {
  id: string
  section_id: string
  content_type: 'experience' | 'category'
  content_id: string
  position: number
  enabled: boolean
  content?: Experience | Category
}

export default function TravelGuideCMSSections() {
  const { user, loading: authLoading } = useAuth()
  const [guides, setGuides] = useState<TravelGuide[]>([])
  const [sections, setSections] = useState<CMSSection[]>([])
  const [selectedGuideId, setSelectedGuideId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  // Item management state
  const [showItemsDialog, setShowItemsDialog] = useState(false)
  const [selectedSection, setSelectedSection] = useState<CMSSection | null>(null)
  const [availableItems, setAvailableItems] = useState<(Experience | Category)[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  
  // Form state
  const [showSectionDialog, setShowSectionDialog] = useState(false)
  const [editingSection, setEditingSection] = useState<CMSSection | null>(null)
  const [sectionForm, setSectionForm] = useState({
    guide_id: '',
    type: 'featured_category' as 'featured_category' | 'featured_product' | 'category_carousel' | 'product_carousel',
    title: '',
    subtitle: '',
    position: 0,
    enabled: true
  })

  // Auth check
  if (authLoading) {
    return <div className="p-8">Loading...</div>
  }

  useEffect(() => {
    fetchGuides()
    fetchExperiences()
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedGuideId) {
      fetchSections(selectedGuideId)
    }
  }, [selectedGuideId])

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You need to be logged in to access this page.</p>
      </div>
    )
  }

  const fetchGuides = async () => {
    try {
      const data = await travelGuideService.getAllTravelGuides()
      setGuides(data)
      if (data.length > 0 && !selectedGuideId) {
        setSelectedGuideId(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching guides:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSections = async (guideId: string) => {
    try {
      const data = await travelGuideService.getCMSSections(guideId)
      setSections(data)
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const fetchExperiences = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('experiences')
        .select('id, title, slug, price, main_image_url, rating, featured')
        .order('title')
      
      if (error) throw error
      setExperiences(data || [])
    } catch (error) {
      console.error('Error fetching experiences:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description, image_url, experience_count')
        .order('name')
      
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingSection) {
        await travelGuideService.updateCMSSection(editingSection.id, sectionForm)
      } else {
        await travelGuideService.createCMSSection({
          ...sectionForm,
          guide_id: selectedGuideId
        })
      }
      setShowSectionDialog(false)
      resetSectionForm()
      fetchSections(selectedGuideId)
    } catch (error) {
      console.error('Error saving section:', error)
    }
  }

  const handleDeleteSection = async (id: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      try {
        await travelGuideService.deleteCMSSection(id)
        fetchSections(selectedGuideId)
      } catch (error) {
        console.error('Error deleting section:', error)
      }
    }
  }

  const resetSectionForm = () => {
    setSectionForm({
      guide_id: '',
      type: 'featured_category',
      title: '',
      subtitle: '',
      position: 0,
      enabled: true
    })
    setEditingSection(null)
  }

  const openSectionDialog = (section?: CMSSection) => {
    if (section) {
      setEditingSection(section)
      setSectionForm({
        guide_id: section.guide_id,
        type: section.type,
        title: section.title,
        subtitle: section.subtitle || '',
        position: section.position,
        enabled: section.enabled
      })
    } else {
      resetSectionForm()
    }
    setShowSectionDialog(true)
  }

  const openItemsDialog = (section: CMSSection) => {
    setSelectedSection(section)
    const contentType = section.type.includes('category') ? 'category' : 'experience'
    const items = contentType === 'category' ? categories : experiences
    setAvailableItems(items)
    
    // Set currently selected items
    const currentItems = section.items?.map(item => item.content_id) || []
    setSelectedItems(currentItems)
    setShowItemsDialog(true)
  }

  const handleSaveItems = async () => {
    if (!selectedSection) return
    
    try {
      const supabase = createClient()
      
      // First, remove all existing items for this section
      await supabase
        .from('travel_guide_section_items')
        .delete()
        .eq('section_id', selectedSection.id)
      
      // Then add the new selected items
      if (selectedItems.length > 0) {
        const contentType = selectedSection.type.includes('category') ? 'category' : 'experience'
        const itemsToInsert = selectedItems.map((itemId, index) => ({
          section_id: selectedSection.id,
          content_type: contentType,
          content_id: itemId,
          position: index,
          enabled: true
        }))
        
        const { error } = await supabase
          .from('travel_guide_section_items')
          .insert(itemsToInsert)
        
        if (error) throw error
      }
      
      setShowItemsDialog(false)
      fetchSections(selectedGuideId)
    } catch (error) {
      console.error('Error saving items:', error)
    }
  }

  if (loading) {
    return <div className="p-8">Loading CMS sections...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Travel Guide CMS Sections</h1>
        <p className="text-gray-600">Manage dynamic content sections for travel guides.</p>
      </div>

      <div className="mb-6">
        <Label htmlFor="guide-select">Select Travel Guide</Label>
        <Select value={selectedGuideId} onValueChange={setSelectedGuideId}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Select a travel guide" />
          </SelectTrigger>
          <SelectContent>
            {guides.map((guide) => (
              <SelectItem key={guide.id} value={guide.id}>
                {guide.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedGuideId && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">CMS Sections</h2>
            <Button onClick={() => openSectionDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {sections.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">No CMS sections found for this travel guide.</p>
                  <Button onClick={() => openSectionDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Section
                  </Button>
                </CardContent>
              </Card>
            ) : (
              sections.map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        {section.subtitle && (
                          <p className="text-sm text-gray-600 mt-1">{section.subtitle}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={section.enabled ? 'default' : 'secondary'}>
                          {section.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Type: {section.type.replace('_', ' ')}</span>
                      <span>Position: {section.position}</span>
                      <span>Items: {section.items?.length || 0}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSectionDialog(section)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openItemsDialog(section)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Manage Items
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Section Dialog */}
      <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingSection ? 'Edit Section' : 'Add New Section'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSectionSubmit} className="space-y-4">
            <div>
              <Label htmlFor="section-type">Section Type</Label>
              <Select 
                value={sectionForm.type} 
                onValueChange={(value: any) => setSectionForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured_category">Featured Categories</SelectItem>
                  <SelectItem value="featured_product">Featured Products</SelectItem>
                  <SelectItem value="category_carousel">Category Carousel</SelectItem>
                  <SelectItem value="product_carousel">Product Carousel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="section-title">Title</Label>
              <Input
                id="section-title"
                value={sectionForm.title}
                onChange={(e) => setSectionForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Recommended Tours"
                required
              />
            </div>
            <div>
              <Label htmlFor="section-subtitle">Subtitle (Optional)</Label>
              <Input
                id="section-subtitle"
                value={sectionForm.subtitle}
                onChange={(e) => setSectionForm(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="e.g., Discover the best experiences"
              />
            </div>
            <div>
              <Label htmlFor="section-position">Position</Label>
              <Input
                id="section-position"
                type="number"
                value={sectionForm.position}
                onChange={(e) => setSectionForm(prev => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="section-enabled"
                checked={sectionForm.enabled}
                onCheckedChange={(checked) => setSectionForm(prev => ({ ...prev, enabled: checked }))}
              />
              <Label htmlFor="section-enabled">Enabled</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowSectionDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingSection ? 'Update' : 'Create'} Section
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Items Management Dialog */}
      <Dialog open={showItemsDialog} onOpenChange={setShowItemsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Manage Items - {selectedSection?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Select {selectedSection?.type.includes('category') ? 'categories' : 'experiences'} to display in this section:
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {availableItems.map((item) => {
                const isSelected = selectedItems.includes(item.id)
                const isCategory = 'name' in item
                
                return (
                  <div key={item.id} className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`} onClick={() => {
                    if (isSelected) {
                      setSelectedItems(prev => prev.filter(id => id !== item.id))
                    } else {
                      setSelectedItems(prev => [...prev, item.id])
                    }
                  }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {(item as any).main_image_url || (item as any).image_url ? (
                          <img 
                            src={(item as any).main_image_url || (item as any).image_url} 
                            alt={isCategory ? (item as Category).name : (item as Experience).title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">No Image</span>
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">
                            {isCategory ? (item as Category).name : (item as Experience).title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {isCategory 
                              ? `${(item as Category).experience_count || 0} experiences`
                              : `$${(item as Experience).price || 0}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded border-2 ${
                        isSelected 
                          ? 'border-primary bg-primary' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="text-xs text-gray-500">
              Selected: {selectedItems.length} items
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowItemsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItems}>
              Save Items
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}