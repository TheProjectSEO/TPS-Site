'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Plus, Eye, Trash2, Edit, GripVertical, Settings, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { travelGuideService, TravelGuideData } from '@/lib/supabase/travelGuideService'
import { CustomCTA, CTAPreview, defaultCTAConfigs } from '@/components/travel-guide/CustomCTASection'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase'
import { internalLinksService, InternalLinkCategory, InternalLink } from '@/lib/supabase/internalLinksService'
import { ImageUpload } from '@/components/ui/image-upload'

interface TravelGuideEditorProps {
  params: Promise<{ id: string }>
}

export default function TravelGuideEditor({ params }: TravelGuideEditorProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [guideId, setGuideId] = useState<string>('')
  const [guide, setGuide] = useState<TravelGuideData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    destination: '',
    tags: [] as string[],
    read_time_minutes: 5,
    published: false,
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    robots_index: true,
    robots_follow: true,
    robots_nosnippet: false,
    og_title: '',
    og_description: '',
    og_image: '',
    og_image_alt: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    twitter_image_alt: '',
    structured_data_type: 'Article',
    focus_keyword: '',
    schema_mode: 'default' as 'default' | 'custom',
    custom_schema: '',
    custom_json_ld: '',
    structured_data_enabled: true
  })

  // CTA state
  const [ctas, setCTAs] = useState<CustomCTA[]>([])
  const [editingCTA, setEditingCTA] = useState<CustomCTA | null>(null)
  const [showCTADialog, setShowCTADialog] = useState(false)

  // Itinerary state
  const [itineraryDays, setItineraryDays] = useState<any[]>([])
  const [editingDay, setEditingDay] = useState<any | null>(null)
  const [showDayDialog, setShowDayDialog] = useState(false)

  // FAQ state
  const [faqs, setFAQs] = useState<any[]>([])
  const [editingFAQ, setEditingFAQ] = useState<any | null>(null)
  const [showFAQDialog, setShowFAQDialog] = useState(false)

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')

  // CMS Sections state
  const [cmsSections, setCMSSections] = useState<any[]>([])
  const [editingSection, setEditingSection] = useState<any | null>(null)
  const [showSectionDialog, setShowSectionDialog] = useState(false)
  const [showItemsDialog, setShowItemsDialog] = useState(false)
  const [selectedSection, setSelectedSection] = useState<any | null>(null)
  const [experiences, setExperiences] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  // Internal Links state
  const [internalLinkCategories, setInternalLinkCategories] = useState<InternalLinkCategory[]>([])
  const [assignedCategories, setAssignedCategories] = useState<string[]>([])
  const [editingCategory, setEditingCategory] = useState<InternalLinkCategory | null>(null)
  const [editingLink, setEditingLink] = useState<InternalLink | null>(null)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [selectedCategoryForLinks, setSelectedCategoryForLinks] = useState<string | null>(null)
  const [availableItems, setAvailableItems] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  useEffect(() => {
    async function getGuideId() {
      const resolvedParams = await params
      setGuideId(resolvedParams.id)
      if (resolvedParams.id !== 'new') {
        fetchGuide(resolvedParams.id)
      } else {
        setLoading(false)
      }
    }
    getGuideId()
    fetchExperiencesAndCategories()
  }, [params])

  const fetchExperiencesAndCategories = async () => {
    try {
      const supabase = createClient()
      const [experiencesRes, categoriesRes] = await Promise.all([
        supabase
          .from('experiences')
          .select('id, title, slug, price, main_image_url, rating, featured')
          .order('title'),
        supabase
          .from('categories')
          .select('id, name, slug, description, image_url, experience_count')
          .order('name')
      ])
      
      setExperiences(experiencesRes.data || [])
      setCategories(categoriesRes.data || [])
    } catch (error) {
      console.error('Error fetching experiences and categories:', error)
    }
  }

  const fetchGuide = async (id: string) => {
    try {
      const data = await travelGuideService.getTravelGuide(id)
      if (data) {
        setGuide(data)
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || '',
          content: data.content || '',
          featured_image: data.featured_image || '',
          destination: data.destination || '',
          tags: data.tags || [],
          read_time_minutes: data.read_time_minutes || 5,
          published: data.published,
          seo_title: data.seo_title || '',
          seo_description: data.seo_description || '',
          seo_keywords: data.seo_keywords || '',
          robots_index: data.robots_index !== false,
          robots_follow: data.robots_follow !== false,
          robots_nosnippet: data.robots_nosnippet || false,
          og_title: data.og_title || '',
          og_description: data.og_description || '',
          og_image: data.og_image || '',
          og_image_alt: data.og_image_alt || '',
          twitter_title: data.twitter_title || '',
          twitter_description: data.twitter_description || '',
          twitter_image: data.twitter_image || '',
          twitter_image_alt: data.twitter_image_alt || '',
          structured_data_type: data.structured_data_type || 'Article',
          focus_keyword: data.focus_keyword || '',
          schema_mode: (data.schema_mode as 'default' | 'custom') || 'default',
          custom_schema: data.custom_schema ? JSON.stringify(data.custom_schema, null, 2) : '',
          custom_json_ld: data.custom_json_ld || '',
          structured_data_enabled: data.structured_data_enabled !== false
        })

        // Fetch related data
        const [ctaData, itineraryData, faqData, galleryData, cmsSectionsData, internalLinksData, allInternalLinkCategories] = await Promise.all([
          travelGuideService.getCTAs(id),
          travelGuideService.getItineraryDays(id),
          travelGuideService.getFAQs(id),
          travelGuideService.getGalleryImages(id),
          travelGuideService.getCMSSections(id),
          internalLinksService.getInternalLinksForGuide(id),
          internalLinksService.getInternalLinkCategories()
        ])

        setCTAs(ctaData)
        setItineraryDays(itineraryData)
        setFAQs(faqData)
        setGalleryImages(galleryData.map(img => img.image_url))
        setCMSSections(cmsSectionsData)
        setInternalLinkCategories(allInternalLinkCategories)
        setAssignedCategories(internalLinksData.map(cat => cat.id))
        
        // Load experiences and categories for CMS sections
        fetchExperiencesAndCategories()
      }
    } catch (error) {
      console.error('Error fetching guide:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      // Validate required fields with safety checks
      if (!formData.title?.trim()) {
        alert('Please enter a title')
        setSaving(false)
        return
      }
      
      if (!formData.content?.trim()) {
        alert('Please enter content')
        setSaving(false)
        return
      }
      
      if (!formData.excerpt?.trim()) {
        alert('Please enter an excerpt')
        setSaving(false)
        return
      }

      // Auto-generate slug if empty with safety checks
      const generateSlug = (text: string) => {
        return text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with dashes
          .replace(/-+/g, '-') // Replace multiple dashes with single dash
          .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
          .trim()
      }
      
      const slug = formData.slug?.trim() || generateSlug(formData.title || '')

      // Create clean save data with proper null handling
      const saveData: any = {
        title: formData.title?.trim() || '',
        slug,
        content: formData.content || '',
        excerpt: formData.excerpt?.trim() || '',
        read_time_minutes: Number(formData.read_time_minutes) || 5,
        published: Boolean(formData.published),
        author_name: 'Aditya Aman',
        author_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        tags: Array.isArray(formData.tags) ? formData.tags : []
      }

      // Only add optional fields if they have values
      if (formData.featured_image?.trim()) {
        saveData.featured_image = formData.featured_image.trim()
      }
      if (formData.destination?.trim()) {
        saveData.destination = formData.destination.trim()
      }
      if (formData.seo_title?.trim()) {
        saveData.seo_title = formData.seo_title.trim()
      }
      if (formData.seo_description?.trim()) {
        saveData.seo_description = formData.seo_description.trim()
      }
      if (formData.seo_keywords?.trim()) {
        saveData.seo_keywords = formData.seo_keywords.trim()
      }

      // SEO Robot settings
      saveData.robots_index = formData.robots_index
      saveData.robots_follow = formData.robots_follow
      saveData.robots_nosnippet = formData.robots_nosnippet

      // Open Graph fields
      if (formData.og_title?.trim()) {
        saveData.og_title = formData.og_title.trim()
      }
      if (formData.og_description?.trim()) {
        saveData.og_description = formData.og_description.trim()
      }
      if (formData.og_image?.trim()) {
        saveData.og_image = formData.og_image.trim()
      }
      if (formData.og_image_alt?.trim()) {
        saveData.og_image_alt = formData.og_image_alt.trim()
      }

      // Twitter fields
      if (formData.twitter_title?.trim()) {
        saveData.twitter_title = formData.twitter_title.trim()
      }
      if (formData.twitter_description?.trim()) {
        saveData.twitter_description = formData.twitter_description.trim()
      }
      if (formData.twitter_image?.trim()) {
        saveData.twitter_image = formData.twitter_image.trim()
      }
      if (formData.twitter_image_alt?.trim()) {
        saveData.twitter_image_alt = formData.twitter_image_alt.trim()
      }

      // Structured data fields
      saveData.structured_data_type = formData.structured_data_type
      if (formData.focus_keyword?.trim()) {
        saveData.focus_keyword = formData.focus_keyword.trim()
      }
      saveData.schema_mode = formData.schema_mode
      saveData.structured_data_enabled = formData.structured_data_enabled

      // Custom schema handling
      if (formData.custom_schema?.trim()) {
        try {
          saveData.custom_schema = JSON.parse(formData.custom_schema)
        } catch (error) {
          console.warn('Invalid custom schema JSON, saving as text')
          saveData.custom_json_ld = formData.custom_schema.trim()
        }
      }
      if (formData.custom_json_ld?.trim()) {
        saveData.custom_json_ld = formData.custom_json_ld.trim()
      }

      console.log('Saving guide with data:', saveData)

      let savedGuide: TravelGuideData

      if (guideId === 'new') {
        // Create new guide
        console.log('Creating new guide...')
        
        // Test with minimal data first
        const minimalData = {
          title: saveData.title,
          slug: saveData.slug,
          content: saveData.content || 'Default content',
          excerpt: saveData.excerpt || 'Default excerpt',
          author_name: saveData.author_name
        }
        
        console.log('Minimal data for creation:', minimalData)
        
        savedGuide = await travelGuideService.createTravelGuide({
          ...minimalData,
          published_at: formData.published ? new Date().toISOString() : null
        })
        console.log('Created guide successfully:', savedGuide)
        
        // Update the URL and state to reflect the new guide ID
        setGuideId(savedGuide.id)
        setGuide(savedGuide)
        window.history.replaceState({}, '', `/admin/travel-guide/edit/${savedGuide.id}`)
      } else {
        // Update existing guide
        console.log('Updating existing guide with ID:', guideId)
        savedGuide = await travelGuideService.updateTravelGuide(guideId, {
          ...saveData,
          published_at: formData.published && !guide?.published ? new Date().toISOString() : guide?.published_at
        })
        console.log('Updated guide successfully:', savedGuide)
        setGuide(savedGuide)
      }

      alert('Travel guide saved successfully!')
    } catch (error) {
      console.error('Error saving guide:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      
      // More detailed error handling
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
        alert(`Error saving guide: ${error.message}`)
      } else {
        console.error('Unknown error type:', typeof error)
        alert('Error saving guide. Please check console for details.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleCTASave = async (ctaData: Partial<CustomCTA>) => {
    try {
      // Ensure guide is saved first if this is a new guide
      if (guideId === 'new') {
        alert('Please save the guide first before adding CTAs')
        return
      }

      if (editingCTA) {
        // Update existing CTA
        const updated = await travelGuideService.updateCTA(editingCTA.id, ctaData)
        setCTAs(prev => prev.map(cta => cta.id === editingCTA.id ? updated : cta))
      } else {
        // Create new CTA with proper field mapping
        const ctaToSave = {
          ...ctaData,
          guide_id: guideId,
          button_icon: ctaData.button_icon || 'chevron-right',
          enabled: true
        }
        console.log('Creating CTA with data:', ctaToSave)
        const newCTA = await travelGuideService.createCTA(ctaToSave)
        setCTAs(prev => [...prev, newCTA])
      }
      setEditingCTA(null)
      setShowCTADialog(false)
    } catch (error) {
      console.error('Error saving CTA:', error)
      alert('Error saving CTA. Please try again.')
    }
  }

  const handleCTADelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this CTA?')) {
      try {
        await travelGuideService.deleteCTA(id)
        setCTAs(prev => prev.filter(cta => cta.id !== id))
      } catch (error) {
        console.error('Error deleting CTA:', error)
      }
    }
  }

  const addItineraryDay = () => {
    const newDay = {
      day_number: itineraryDays.length + 1,
      title: '',
      description: '',
      activities: [''],
      images: [''],
      tips: ['']
    }
    setEditingDay(newDay)
    setShowDayDialog(true)
  }

  const handleDaySave = async (dayData: any) => {
    try {
      // Ensure guide is saved first if this is a new guide
      if (guideId === 'new') {
        alert('Please save the guide first before adding itinerary days')
        return
      }

      if (editingDay?.id) {
        // Update existing day
        const updated = await travelGuideService.updateItineraryDay(editingDay.id, dayData)
        setItineraryDays(prev => prev.map(day => day.id === editingDay.id ? updated : day))
      } else {
        // Create new day
        const newDay = await travelGuideService.createItineraryDay({
          ...dayData,
          guide_id: guideId
        })
        setItineraryDays(prev => [...prev, newDay])
      }
      setEditingDay(null)
      setShowDayDialog(false)
    } catch (error) {
      console.error('Error saving day:', error)
      alert('Error saving itinerary day. Please try again.')
    }
  }

  const handleDayDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this day?')) {
      try {
        await travelGuideService.deleteItineraryDay(id)
        setItineraryDays(prev => prev.filter(day => day.id !== id))
      } catch (error) {
        console.error('Error deleting day:', error)
      }
    }
  }

  const addFAQ = () => {
    setEditingFAQ({ question: '', answer: '', position: faqs.length + 1 })
    setShowFAQDialog(true)
  }

  const handleFAQSave = async (faqData: any) => {
    try {
      // Ensure guide is saved first if this is a new guide
      if (guideId === 'new') {
        alert('Please save the guide first before adding FAQs')
        return
      }

      if (editingFAQ?.id) {
        // Update existing FAQ
        const updated = await travelGuideService.updateFAQ(editingFAQ.id, faqData)
        setFAQs(prev => prev.map(faq => faq.id === editingFAQ.id ? updated : faq))
      } else {
        // Create new FAQ
        const newFAQ = await travelGuideService.createFAQ({
          ...faqData,
          guide_id: guideId,
          position: faqs.length + 1,
          enabled: true
        })
        setFAQs(prev => [...prev, newFAQ])
      }
      setEditingFAQ(null)
      setShowFAQDialog(false)
    } catch (error) {
      console.error('Error saving FAQ:', error)
      alert('Error saving FAQ. Please try again.')
    }
  }

  const handleFAQDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await travelGuideService.deleteFAQ(id)
        setFAQs(prev => prev.filter(faq => faq.id !== id))
      } catch (error) {
        console.error('Error deleting FAQ:', error)
      }
    }
  }

  const addGalleryImage = async () => {
    if (!newImageUrl.trim()) {
      alert('Please enter an image URL')
      return
    }

    try {
      // Ensure guide is saved first if this is a new guide
      if (guideId === 'new') {
        alert('Please save the guide first before adding gallery images')
        return
      }

      await travelGuideService.addGalleryImage({
        guide_id: guideId,
        image_url: newImageUrl,
        position: galleryImages.length + 1
      })
      setGalleryImages(prev => [...prev, newImageUrl])
      setNewImageUrl('')
    } catch (error) {
      console.error('Error adding gallery image:', error)
      alert('Error adding gallery image. Please try again.')
    }
  }

  const addGalleryImageFromUrl = async (imageUrl: string) => {
    try {
      // Ensure guide is saved first if this is a new guide
      if (guideId === 'new') {
        alert('Please save the guide first before adding gallery images')
        return
      }

      await travelGuideService.addGalleryImage({
        guide_id: guideId,
        image_url: imageUrl,
        position: galleryImages.length + 1
      })
      setGalleryImages(prev => [...prev, imageUrl])
    } catch (error) {
      console.error('Error adding gallery image:', error)
      alert('Error adding gallery image. Please try again.')
    }
  }

  const deleteGalleryImage = async (imageUrl: string, index: number) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      if (guideId === 'new') {
        // For new guides, just remove from state
        setGalleryImages(prev => prev.filter((_, i) => i !== index))
        return
      }

      // Find the gallery image in database and delete it
      const galleryData = await travelGuideService.getGalleryImages(guideId)
      const imageToDelete = galleryData.find(img => img.image_url === imageUrl)
      
      if (imageToDelete) {
        await travelGuideService.deleteGalleryImage(imageToDelete.id)
      }
      
      // Update state
      setGalleryImages(prev => prev.filter((_, i) => i !== index))
    } catch (error) {
      console.error('Error deleting gallery image:', error)
      alert('Error deleting gallery image. Please try again.')
    }
  }

  // Dynamic content positioning
  const insertSectionMarker = (sectionId: string) => {
    const section = cmsSections.find(s => s.id === sectionId)
    if (!section) return

    const marker = `\n\n[SECTION:${section.title.replace(/\s+/g, '-').toLowerCase()}]\n\n`
    
    // Insert marker at the end of current content for now
    // In a real implementation, this would insert at cursor position
    setFormData(prev => ({
      ...prev,
      content: (prev.content || '') + marker
    }))
  }

  // CMS Sections management functions
  const addCMSSection = () => {
    setEditingSection({
      type: 'featured_category',
      title: '',
      subtitle: '',
      position: cmsSections.length + 1
    })
    setShowSectionDialog(true)
  }

  const handleSectionSave = async (sectionData: any) => {
    try {
      if (guideId === 'new') {
        alert('Please save the guide first before adding CMS sections')
        return
      }

      if (editingSection?.id) {
        // Update existing section
        const updated = await travelGuideService.updateCMSSection(editingSection.id, sectionData)
        setCMSSections(prev => prev.map(section => section.id === editingSection.id ? updated : section))
      } else {
        // Create new section
        const newSection = await travelGuideService.createCMSSection({
          ...sectionData,
          guide_id: guideId
        })
        setCMSSections(prev => [...prev, newSection])
      }
      setEditingSection(null)
      setShowSectionDialog(false)
    } catch (error) {
      console.error('Error saving section:', error)
      alert('Error saving CMS section. Please try again.')
    }
  }

  const handleSectionDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      try {
        await travelGuideService.deleteCMSSection(id)
        setCMSSections(prev => prev.filter(section => section.id !== id))
      } catch (error) {
        console.error('Error deleting section:', error)
      }
    }
  }

  const openItemsDialog = (section: any) => {
    setSelectedSection(section)
    const contentType = section.type.includes('category') ? 'category' : 'experience'
    const items = contentType === 'category' ? categories : experiences
    setAvailableItems(items)
    
    // Set currently selected items
    const currentItems = section.items?.map((item: any) => item.content_id) || []
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
        const itemsToInsert = selectedItems.map((itemId: string, index: number) => ({
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
      // Refresh sections to show updated item count
      const updatedSections = await travelGuideService.getCMSSections(guideId)
      setCMSSections(updatedSections)
    } catch (error) {
      console.error('Error saving items:', error)
      alert('Error saving section items. Please try again.')
    }
  }

  // Internal Links management functions
  const handleAssignCategories = async () => {
    if (guideId === 'new') {
      alert('Please save the guide first before assigning internal link categories')
      return
    }

    try {
      await internalLinksService.assignCategoriesToGuide(guideId, assignedCategories)
      alert('Categories assigned successfully!')
    } catch (error) {
      console.error('Error assigning categories:', error)
      alert('Error assigning categories. Please try again.')
    }
  }

  const handleCategorySave = async (categoryData: Partial<InternalLinkCategory>) => {
    try {
      if (editingCategory?.id) {
        // Update existing category
        const updated = await internalLinksService.updateCategory(editingCategory.id, categoryData)
        if (updated) {
          setInternalLinkCategories(prev => prev.map(cat => cat.id === editingCategory.id ? updated : cat))
        }
      } else {
        // Create new category
        const newCategory = await internalLinksService.createCategory(categoryData)
        if (newCategory) {
          setInternalLinkCategories(prev => [...prev, newCategory])
        }
      }
      setEditingCategory(null)
      setShowCategoryDialog(false)
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Error saving category. Please try again.')
    }
  }

  const handleCategoryDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? All associated links will also be deleted.')) {
      try {
        const success = await internalLinksService.deleteCategory(id)
        if (success) {
          setInternalLinkCategories(prev => prev.filter(cat => cat.id !== id))
          setAssignedCategories(prev => prev.filter(catId => catId !== id))
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Error deleting category. Please try again.')
      }
    }
  }

  const handleLinkSave = async (linkData: Partial<InternalLink>) => {
    if (!selectedCategoryForLinks) return

    try {
      if (editingLink?.id) {
        // Update existing link
        const updated = await internalLinksService.updateLink(editingLink.id, linkData)
        if (updated) {
          setInternalLinkCategories(prev => prev.map(cat => ({
            ...cat,
            links: cat.id === selectedCategoryForLinks 
              ? cat.links.map(link => link.id === editingLink.id ? updated : link)
              : cat.links
          })))
        }
      } else {
        // Create new link
        const newLink = await internalLinksService.createLink({
          ...linkData,
          category_id: selectedCategoryForLinks,
          display_order: internalLinkCategories.find(cat => cat.id === selectedCategoryForLinks)?.links.length || 0
        })
        if (newLink) {
          setInternalLinkCategories(prev => prev.map(cat => ({
            ...cat,
            links: cat.id === selectedCategoryForLinks ? [...cat.links, newLink] : cat.links
          })))
        }
      }
      setEditingLink(null)
      setShowLinkDialog(false)
      setSelectedCategoryForLinks(null)
    } catch (error) {
      console.error('Error saving link:', error)
      alert('Error saving link. Please try again.')
    }
  }

  const handleLinkDelete = async (linkId: string, categoryId: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      try {
        const success = await internalLinksService.deleteLink(linkId)
        if (success) {
          setInternalLinkCategories(prev => prev.map(cat => ({
            ...cat,
            links: cat.id === categoryId ? cat.links.filter(link => link.id !== linkId) : cat.links
          })))
        }
      } catch (error) {
        console.error('Error deleting link:', error)
        alert('Error deleting link. Please try again.')
      }
    }
  }

  // Show loading while auth or data is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600 font-medium">
            {authLoading ? 'Checking authentication...' : 'Loading travel guide...'}
          </p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to access this page.</p>
          <Button onClick={() => router.push('/admin/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/travel-guide')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Guides
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {guideId === 'new' ? 'Create New Guide' : 'Edit Travel Guide'}
              </h1>
              <p className="text-secondary font-medium mt-1">
                {guideId === 'new' ? 'Create a new comprehensive travel guide' : formData.title}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {guide?.published && (
              <Button variant="outline" asChild>
                <a href={`/travel-guide/${guide.slug}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </a>
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-primary text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Guide'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Editor */}
          <div className="lg:col-span-3">
            <Card className="card-brand">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-9">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="sections">CMS Sections</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                    <TabsTrigger value="ctas">CTAs</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="faqs">FAQs</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                    <TabsTrigger value="internal-links">Internal Links</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter guide title..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="guide-slug"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Brief description of the guide..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="destination">Destination</Label>
                        <Input
                          id="destination"
                          value={formData.destination || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                          placeholder="Rome, Italy"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="read_time">Read Time (minutes)</Label>
                        <Input
                          id="read_time"
                          type="number"
                          value={formData.read_time_minutes}
                          onChange={(e) => setFormData(prev => ({ ...prev, read_time_minutes: parseInt(e.target.value) || 5 }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="featured_image">Featured Image</Label>
                      <ImageUpload
                        value={formData.featured_image || ''}
                        onChange={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
                        folder="travel-guides/featured"
                        placeholder="Upload featured image or enter URL..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags.join(', ')}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        }))}
                        placeholder="Rome, Italy, 3 Days, History"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="content">Main Content</Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Insert CMS Section:</span>
                          <Select onValueChange={(sectionId) => insertSectionMarker(sectionId)}>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Choose section..." />
                            </SelectTrigger>
                            <SelectContent>
                              {cmsSections.map((section) => (
                                <SelectItem key={section.id} value={section.id}>
                                  {section.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <RichTextEditor
                        value={formData.content || ''}
                        onChange={(content) => setFormData(prev => ({ ...prev, content: content || '' }))}
                        placeholder="Write your comprehensive travel guide content here... Use the dropdown above to insert CMS sections at specific points."
                        minHeight="500px"
                      />
                      {cmsSections.length > 0 && (
                        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-md">
                          <strong>Tip:</strong> Place your cursor where you want to insert a section, then select it from the dropdown above. 
                          Markers like <code>[SECTION:section-name]</code> will be inserted and replaced with actual content on the frontend.
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="seo_title">SEO Title</Label>
                        <Input
                          id="seo_title"
                          value={formData.seo_title || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                          placeholder="SEO optimized title..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seo_keywords">SEO Keywords</Label>
                        <Input
                          id="seo_keywords"
                          value={formData.seo_keywords || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seo_description">SEO Description</Label>
                      <Textarea
                        id="seo_description"
                        value={formData.seo_description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                        placeholder="Meta description for search engines..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-6">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-4">Search Engine Optimization</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="focus_keyword">Focus Keyword</Label>
                            <Input
                              id="focus_keyword"
                              value={formData.focus_keyword || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, focus_keyword: e.target.value }))}
                              placeholder="Primary keyword for this guide"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="structured_data_type">Schema Type</Label>
                            <Select 
                              value={formData.structured_data_type || 'Article'} 
                              onValueChange={(value) => setFormData(prev => ({ ...prev, structured_data_type: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Article">Article</SelectItem>
                                <SelectItem value="BlogPosting">Blog Posting</SelectItem>
                                <SelectItem value="TravelGuide">Travel Guide</SelectItem>
                                <SelectItem value="Review">Review</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="robots_index"
                              checked={formData.robots_index}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, robots_index: checked }))}
                            />
                            <Label htmlFor="robots_index">Allow Indexing</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="robots_follow"
                              checked={formData.robots_follow}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, robots_follow: checked }))}
                            />
                            <Label htmlFor="robots_follow">Follow Links</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="robots_nosnippet"
                              checked={formData.robots_nosnippet}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, robots_nosnippet: checked }))}
                            />
                            <Label htmlFor="robots_nosnippet">No Snippet</Label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-4">Open Graph (Facebook)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="og_title">OG Title</Label>
                            <Input
                              id="og_title"
                              value={formData.og_title || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                              placeholder="Facebook share title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="og_image">OG Image</Label>
                            <ImageUpload
                              value={formData.og_image || ''}
                              onChange={(url) => setFormData(prev => ({ ...prev, og_image: url }))}
                              folder="travel-guides/og"
                              placeholder="Upload OG image for Facebook shares..."
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="og_description">OG Description</Label>
                            <Textarea
                              id="og_description"
                              value={formData.og_description || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
                              placeholder="Facebook share description"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="og_image_alt">OG Image Alt Text</Label>
                            <Input
                              id="og_image_alt"
                              value={formData.og_image_alt || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, og_image_alt: e.target.value }))}
                              placeholder="Alt text for OG image"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-4">Twitter Cards</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="twitter_title">Twitter Title</Label>
                            <Input
                              id="twitter_title"
                              value={formData.twitter_title || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, twitter_title: e.target.value }))}
                              placeholder="Twitter card title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="twitter_image">Twitter Image</Label>
                            <ImageUpload
                              value={formData.twitter_image || ''}
                              onChange={(url) => setFormData(prev => ({ ...prev, twitter_image: url }))}
                              folder="travel-guides/twitter"
                              placeholder="Upload Twitter card image..."
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="twitter_description">Twitter Description</Label>
                            <Textarea
                              id="twitter_description"
                              value={formData.twitter_description || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, twitter_description: e.target.value }))}
                              placeholder="Twitter card description"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="twitter_image_alt">Twitter Image Alt Text</Label>
                            <Input
                              id="twitter_image_alt"
                              value={formData.twitter_image_alt || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, twitter_image_alt: e.target.value }))}
                              placeholder="Alt text for Twitter image"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-4">Structured Data</h3>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="structured_data_enabled"
                              checked={formData.structured_data_enabled}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, structured_data_enabled: checked }))}
                            />
                            <Label htmlFor="structured_data_enabled">Enable Structured Data</Label>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="schema_mode">Schema Mode</Label>
                            <Select 
                              value={formData.schema_mode || 'default'} 
                              onValueChange={(value: 'default' | 'custom') => setFormData(prev => ({ ...prev, schema_mode: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="default">Auto-Generated</SelectItem>
                                <SelectItem value="custom">Custom Schema</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {formData.schema_mode === 'custom' && (
                            <div className="space-y-2">
                              <Label htmlFor="custom_schema">Custom JSON-LD Schema</Label>
                              <Textarea
                                id="custom_schema"
                                value={formData.custom_schema || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, custom_schema: e.target.value }))}
                                placeholder='{"@context": "https://schema.org", "@type": "Article", ...}'
                                rows={8}
                                className="font-mono text-sm"
                              />
                              <p className="text-sm text-gray-600">
                                Enter valid JSON-LD structured data. This will override the auto-generated schema.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="ctas" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-primary">Custom CTAs</h3>
                      {guideId !== 'new' ? (
                        <Button
                          onClick={() => {
                            setEditingCTA(null)
                            setShowCTADialog(true)
                          }}
                          className="bg-gradient-primary text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add CTA
                        </Button>
                      ) : (
                        <div className="text-sm text-gray-500 bg-yellow-50 px-3 py-2 rounded-md">
                          Save the guide first to add CTAs
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {ctas.length > 0 ? (
                        ctas.map((cta) => (
                          <CTAPreview
                            key={cta.id}
                            cta={cta}
                            onEdit={setEditingCTA}
                            onDelete={handleCTADelete}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No CTAs added yet
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="itinerary" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-primary">Itinerary Days</h3>
                      {guideId !== 'new' ? (
                        <Button
                          onClick={addItineraryDay}
                          className="bg-gradient-primary text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Day
                        </Button>
                      ) : (
                        <div className="text-sm text-gray-500 bg-yellow-50 px-3 py-2 rounded-md">
                          Save the guide first to add itinerary days
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {itineraryDays.map((day) => (
                        <Card key={day.id} className="card-brand">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-primary">Day {day.day_number}: {day.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{day.description}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingDay(day)
                                    setShowDayDialog(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDayDelete(day.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="faqs" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-primary">FAQ Items</h3>
                      {guideId !== 'new' ? (
                        <Button
                          onClick={addFAQ}
                          className="bg-gradient-primary text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add FAQ
                        </Button>
                      ) : (
                        <div className="text-sm text-gray-500 bg-yellow-50 px-3 py-2 rounded-md">
                          Save the guide first to add FAQs
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {faqs.map((faq) => (
                        <Card key={faq.id} className="card-brand">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-primary mb-2">{faq.question}</h4>
                                <p className="text-sm text-gray-600">{faq.answer}</p>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingFAQ(faq)
                                    setShowFAQDialog(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleFAQDelete(faq.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="sections" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-primary">Dynamic Content Sections</h3>
                        <p className="text-sm text-gray-600 mt-1">Add interactive sections like featured categories, products, and carousels to enhance your travel guide</p>
                      </div>
                      {guideId !== 'new' ? (
                        <Button
                          onClick={addCMSSection}
                          className="bg-gradient-primary text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Section
                        </Button>
                      ) : (
                        <div className="text-sm text-gray-500 bg-yellow-50 px-3 py-2 rounded-md">
                          Save the guide first to add CMS sections
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {cmsSections.length === 0 ? (
                        <Card>
                          <CardContent className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                              <Settings className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 mb-4">No dynamic sections added yet</p>
                            <p className="text-sm text-gray-400 mb-6">
                              Add dynamic content sections to showcase categories, featured products, or create engaging carousels
                            </p>
                            {guideId !== 'new' && (
                              <Button onClick={addCMSSection} variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Create First Section
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ) : (
                        cmsSections.map((section) => (
                          <Card key={section.id} className="hover:shadow-sm transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <CardTitle className="text-lg">{section.title}</CardTitle>
                                    <Badge variant={section.enabled ? 'default' : 'secondary'}>
                                      {section.enabled ? 'Enabled' : 'Disabled'}
                                    </Badge>
                                  </div>
                                  {section.subtitle && (
                                    <p className="text-sm text-gray-600">{section.subtitle}</p>
                                  )}
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                    <span>Type: {section.type.replace('_', ' ')}</span>
                                    <span>Position: {section.position}</span>
                                    <span>Items: {section.items?.length || 0}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingSection(section)
                                      setShowSectionDialog(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openItemsDialog(section)}
                                  >
                                    <List className="h-4 w-4 mr-1" />
                                    Items ({section.items?.length || 0})
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSectionDelete(section.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="gallery" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-primary">Photo Gallery</h3>
                      {guideId === 'new' && (
                        <div className="text-sm text-gray-500 bg-yellow-50 px-3 py-2 rounded-md">
                          Save the guide first to add gallery images
                        </div>
                      )}
                    </div>

                    {guideId !== 'new' ? (
                      <div className="space-y-6">
                        {/* Image Upload */}
                        <div className="space-y-2">
                          <Label>Upload Images</Label>
                          <ImageUpload
                            folder="travel-guides/gallery"
                            placeholder="Upload gallery images..."
                            acceptMultiple={true}
                            showUrlInput={true}
                            onMultipleChange={(urls) => {
                              // Add new images to the gallery
                              urls.forEach(url => {
                                if (url.trim()) {
                                  addGalleryImageFromUrl(url)
                                }
                              })
                            }}
                            onChange={(url) => {
                              // Handle single image from URL input
                              if (url.trim()) {
                                addGalleryImageFromUrl(url)
                              }
                            }}
                          />
                        </div>

                        {/* Gallery Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {galleryImages.map((image, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                              <img
                                src={image}
                                alt={`Gallery image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {/* Delete button */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteGalleryImage(image, index)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Save the guide to start adding gallery images
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="internal-links" className="space-y-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-primary">Internal Links Management</h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => {
                              setEditingCategory({ name: '', slug: '', title: '', description: '', display_order: internalLinkCategories.length, active: true, links: [] })
                              setShowCategoryDialog(true)
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            New Category
                          </Button>
                          <Button
                            onClick={handleAssignCategories}
                            className="bg-gradient-primary text-white"
                            disabled={guideId === 'new'}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Save Assignment
                          </Button>
                        </div>
                      </div>

                      {guideId === 'new' && (
                        <div className="text-sm text-gray-500 bg-yellow-50 px-3 py-2 rounded-md">
                          Save the guide first to assign internal link categories
                        </div>
                      )}

                      {/* Category Assignment */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Assign Categories to This Guide</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {internalLinkCategories.map((category) => (
                            <label key={category.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={assignedCategories.includes(category.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setAssignedCategories(prev => [...prev, category.id])
                                  } else {
                                    setAssignedCategories(prev => prev.filter(id => id !== category.id))
                                  }
                                }}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                              />
                              <span className="text-sm font-medium">{category.title}</span>
                              <Badge variant="outline" className="text-xs">{category.links.length} links</Badge>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Categories Management */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">All Categories</h4>
                        {internalLinkCategories.map((category) => (
                          <Card key={category.id} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h5 className="font-medium text-gray-900">{category.title}</h5>
                                <p className="text-sm text-gray-500">{category.description}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline">{category.name}</Badge>
                                  <Badge variant="secondary">{category.links.length} links</Badge>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  onClick={() => {
                                    setSelectedCategoryForLinks(category.id)
                                    setEditingLink({ title: '', url: '', description: '', display_order: category.links.length, active: true })
                                    setShowLinkDialog(true)
                                  }}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Link
                                </Button>
                                <Button
                                  onClick={() => {
                                    setEditingCategory(category)
                                    setShowCategoryDialog(true)
                                  }}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleCategoryDelete(category.id)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Links for this category */}
                            <div className="space-y-2">
                              {category.links.map((link) => (
                                <div key={link.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                  <div>
                                    <span className="text-sm font-medium">{link.title}</span>
                                    <span className="text-xs text-gray-500 ml-2">{link.url}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      onClick={() => {
                                        setSelectedCategoryForLinks(category.id)
                                        setEditingLink(link)
                                        setShowLinkDialog(true)
                                      }}
                                      variant="outline"
                                      size="sm"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      onClick={() => handleLinkDelete(link.id, category.id)}
                                      variant="destructive"
                                      size="sm"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                              {category.links.length === 0 && (
                                <div className="text-sm text-gray-500 italic p-2">
                                  No links added yet. Click "Add Link" to create the first one.
                                </div>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-brand">
              <CardHeader>
                <CardTitle className="text-primary">Guide Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={formData.published ? "default" : "secondary"}>
                    {formData.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">CTAs</span>
                  <Badge variant="outline">{ctas.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Itinerary Days</span>
                  <Badge variant="outline">{itineraryDays.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">FAQs</span>
                  <Badge variant="outline">{faqs.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Gallery Images</span>
                  <Badge variant="outline">{galleryImages.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Dialog */}
      <CTADialog
        open={showCTADialog}
        onOpenChange={setShowCTADialog}
        cta={editingCTA}
        onSave={handleCTASave}
      />

      {/* Day Dialog */}
      <DayDialog
        open={showDayDialog}
        onOpenChange={setShowDayDialog}
        day={editingDay}
        onSave={handleDaySave}
      />

      {/* FAQ Dialog */}
      <FAQDialog
        open={showFAQDialog}
        onOpenChange={setShowFAQDialog}
        faq={editingFAQ}
        onSave={handleFAQSave}
      />

      {/* CMS Section Dialog */}
      <SectionDialog
        open={showSectionDialog}
        onOpenChange={setShowSectionDialog}
        section={editingSection}
        onSave={handleSectionSave}
      />

      {/* Items Management Dialog */}
      <ItemsDialog
        open={showItemsDialog}
        onOpenChange={setShowItemsDialog}
        section={selectedSection}
        availableItems={availableItems}
        selectedItems={selectedItems}
        onSelectedItemsChange={setSelectedItems}
        onSave={handleSaveItems}
      />

      {/* Category Dialog */}
      <CategoryDialog
        open={showCategoryDialog}
        onOpenChange={setShowCategoryDialog}
        category={editingCategory}
        onSave={handleCategorySave}
      />

      {/* Link Dialog */}
      <LinkDialog
        open={showLinkDialog}
        onOpenChange={setShowLinkDialog}
        link={editingLink}
        onSave={handleLinkSave}
      />
    </div>
  )
}

// CTA Dialog Component
function CTADialog({ open, onOpenChange, cta, onSave }: any) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    button_text: '',
    button_link: '',
    button_icon: 'chevron-right',
    gradient_type: 'primary',
    layout: 'horizontal',
    position: 'middle',
    background_image: '',
    background_color: '',
    enabled: true
  })

  useEffect(() => {
    if (cta) {
      setFormData(cta)
    } else {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        button_text: '',
        button_link: '',
        button_icon: 'chevron-right',
        gradient_type: 'primary',
        layout: 'horizontal',
        position: 'middle',
        background_image: '',
        background_color: '',
        enabled: true
      })
    }
  }, [cta])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{cta ? 'Edit CTA' : 'Add CTA'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cta_title">Title</Label>
              <Input
                id="cta_title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="CTA Title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_subtitle">Subtitle</Label>
              <Input
                id="cta_subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Optional subtitle"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta_description">Description</Label>
            <Textarea
              id="cta_description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="CTA description"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cta_button_text">Button Text</Label>
              <Input
                id="cta_button_text"
                value={formData.button_text}
                onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                placeholder="Button text"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_button_link">Button Link</Label>
              <Input
                id="cta_button_link"
                value={formData.button_link}
                onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                placeholder="/tours"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cta_gradient">Gradient</Label>
              <Select value={formData.gradient_type} onValueChange={(value) => setFormData(prev => ({ ...prev, gradient_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="accent">Accent</SelectItem>
                  <SelectItem value="sunset">Sunset</SelectItem>
                  <SelectItem value="ocean">Ocean</SelectItem>
                  <SelectItem value="forest">Forest</SelectItem>
                  <SelectItem value="royal">Royal</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_layout">Layout</Label>
              <Select value={formData.layout} onValueChange={(value) => setFormData(prev => ({ ...prev, layout: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_position">Position</Label>
              <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="middle">Middle</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_icon">Icon</Label>
              <Select value={formData.button_icon} onValueChange={(value) => setFormData(prev => ({ ...prev, button_icon: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chevron-right">Chevron Right</SelectItem>
                  <SelectItem value="arrow-right">Arrow Right</SelectItem>
                  <SelectItem value="external-link">External Link</SelectItem>
                  <SelectItem value="star">Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Background Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Background Options</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cta_background_image">Background Image</Label>
                <ImageUpload
                  value={formData.background_image || ''}
                  onChange={(url) => setFormData(prev => ({ ...prev, background_image: url }))}
                  folder="travel-guides/cta"
                  placeholder="Upload CTA background image..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta_background_color">Background Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="cta_background_color"
                    type="color"
                    value={formData.background_color || '#ffffff'}
                    onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                    className="w-12 h-9 p-1 border rounded"
                  />
                  <Input
                    value={formData.background_color || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary text-white">
              {cta ? 'Update CTA' : 'Add CTA'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Day Dialog Component
function DayDialog({ open, onOpenChange, day, onSave }: any) {
  const [formData, setFormData] = useState({
    day_number: 1,
    title: '',
    description: '',
    activities: [''],
    images: [''],
    tips: ['']
  })

  useEffect(() => {
    if (day) {
      setFormData(day)
    } else {
      setFormData({
        day_number: 1,
        title: '',
        description: '',
        activities: [''],
        images: [''],
        tips: ['']
      })
    }
  }, [day])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      activities: formData.activities.filter(Boolean),
      images: formData.images.filter(Boolean),
      tips: formData.tips.filter(Boolean)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{day?.id ? 'Edit Day' : 'Add Day'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day_number">Day Number</Label>
              <Input
                id="day_number"
                type="number"
                value={formData.day_number}
                onChange={(e) => setFormData(prev => ({ ...prev, day_number: parseInt(e.target.value) }))}
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="day_title">Title</Label>
              <Input
                id="day_title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Day title"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="day_description">Description</Label>
            <Textarea
              id="day_description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Day description"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Activities</Label>
            {formData.activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={activity}
                  onChange={(e) => {
                    const newActivities = [...formData.activities]
                    newActivities[index] = e.target.value
                    setFormData(prev => ({ ...prev, activities: newActivities }))
                  }}
                  placeholder="Activity description"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newActivities = formData.activities.filter((_, i) => i !== index)
                    setFormData(prev => ({ ...prev, activities: newActivities }))
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFormData(prev => ({ ...prev, activities: [...prev.activities, ''] }))}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary text-white">
              {day?.id ? 'Update Day' : 'Add Day'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// FAQ Dialog Component
function FAQDialog({ open, onOpenChange, faq, onSave }: any) {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    position: 1,
    enabled: true
  })

  useEffect(() => {
    if (faq) {
      setFormData(faq)
    } else {
      setFormData({
        question: '',
        answer: '',
        position: 1,
        enabled: true
      })
    }
  }, [faq])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{faq?.id ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="faq_question">Question</Label>
            <Input
              id="faq_question"
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Frequently asked question"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faq_answer">Answer</Label>
            <Textarea
              id="faq_answer"
              value={formData.answer}
              onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
              placeholder="Detailed answer"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary text-white">
              {faq?.id ? 'Update FAQ' : 'Add FAQ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Section Dialog Component  
function SectionDialog({ open, onOpenChange, section, onSave }: any) {
  const [formData, setFormData] = useState({
    type: 'featured_category',
    title: '',
    subtitle: '',
    position: 0,
    enabled: true
  })

  useEffect(() => {
    if (section) {
      setFormData(section)
    } else {
      setFormData({
        type: 'featured_category',
        title: '',
        subtitle: '',
        position: 0,
        enabled: true
      })
    }
  }, [section])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {section?.id ? 'Edit Section' : 'Add New Section'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section_type">Section Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
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

          <div className="space-y-2">
            <Label htmlFor="section_title">Title</Label>
            <Input
              id="section_title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Recommended Tours"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section_subtitle">Subtitle (Optional)</Label>
            <Input
              id="section_subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="e.g., Discover the best experiences"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section_position">Position</Label>
            <Input
              id="section_position"
              type="number"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="section_enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
            />
            <Label htmlFor="section_enabled">Enabled</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary text-white">
              {section?.id ? 'Update' : 'Create'} Section
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Items Dialog Component
function ItemsDialog({ open, onOpenChange, section, availableItems, selectedItems, onSelectedItemsChange, onSave }: any) {
  const handleItemToggle = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectedItemsChange(selectedItems.filter((id: string) => id !== itemId))
    } else {
      onSelectedItemsChange([...selectedItems, itemId])
    }
  }

  const isCategory = section?.type?.includes('category')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Manage Items - {section?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Select {isCategory ? 'categories' : 'experiences'} to display in this section:
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {availableItems.map((item: any) => {
              const isSelected = selectedItems.includes(item.id)
              
              return (
                <div 
                  key={item.id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`} 
                  onClick={() => handleItemToggle(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {(item.main_image_url || item.image_url) ? (
                        <img 
                          src={item.main_image_url || item.image_url} 
                          alt={item.name || item.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium">
                          {item.name || item.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {isCategory 
                            ? `${item.experience_count || 0} experiences`
                            : `$${item.price || 0}`
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
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-gradient-primary text-white">
            Save Items
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Category Dialog Component
function CategoryDialog({ open, onOpenChange, category, onSave }: any) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    title: '',
    description: '',
    display_order: 0,
    active: true
  })

  useEffect(() => {
    if (category) {
      setFormData(category)
    } else {
      setFormData({
        name: '',
        slug: '',
        title: '',
        description: '',
        display_order: 0,
        active: true
      })
    }
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Auto-generate slug from name if not provided
    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    
    onSave({ ...formData, slug })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{category?.id ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category_name">Name</Label>
            <Input
              id="category_name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="rome"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category_title">Title</Label>
            <Input
              id="category_title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Rome"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_slug">Slug</Label>
            <Input
              id="category_slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="rome (auto-generated from name if empty)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_description">Description</Label>
            <Textarea
              id="category_description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Places and guides specific to Rome"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="category_active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="category_active">Active</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary text-white">
              {category?.id ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Link Dialog Component
function LinkDialog({ open, onOpenChange, link, onSave }: any) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    display_order: 0,
    active: true
  })

  useEffect(() => {
    if (link) {
      setFormData(link)
    } else {
      setFormData({
        title: '',
        url: '',
        description: '',
        display_order: 0,
        active: true
      })
    }
  }, [link])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{link?.id ? 'Edit Link' : 'Add Link'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link_title">Title</Label>
            <Input
              id="link_title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Best Places to Visit in Rome"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="link_url">URL</Label>
            <Input
              id="link_url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="/travel-guide/rome-attractions"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link_description">Description</Label>
            <Textarea
              id="link_description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Comprehensive guide to Rome's top attractions"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="link_active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="link_active">Active</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary text-white">
              {link?.id ? 'Update' : 'Create'} Link
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}