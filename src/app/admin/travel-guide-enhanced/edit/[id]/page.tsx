'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Plus, Eye, Trash2, Edit, GripVertical } from 'lucide-react'
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
import { travelGuideService, TravelGuideData, GalleryImage } from '@/lib/supabase/travelGuideService'
import { CustomCTA, CTAPreview, defaultCTAConfigs } from '@/components/travel-guide/CustomCTASection'
import { ImageUpload } from '@/components/ui/image-upload'

interface TravelGuideEditorProps {
  params: Promise<{ id: string }>
}

export default function TravelGuideEditor({ params }: TravelGuideEditorProps) {
  const router = useRouter()
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
    seo_keywords: ''
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
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null)
  const [showGalleryDialog, setShowGalleryDialog] = useState(false)

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
  }, [params])

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
          seo_keywords: data.seo_keywords || ''
        })

        // Fetch related data
        const [ctaData, itineraryData, faqData, galleryData] = await Promise.all([
          travelGuideService.getCTAs(id),
          travelGuideService.getItineraryDays(id),
          travelGuideService.getFAQs(id),
          travelGuideService.getGalleryImages(id)
        ])

        setCTAs(ctaData)
        setItineraryDays(itineraryData)
        setFAQs(faqData)
        setGalleryImages(galleryData)
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
      let savedGuide: TravelGuideData

      if (guideId === 'new') {
        // Create new guide
        savedGuide = await travelGuideService.createTravelGuide({
          ...formData,
          author_name: 'Aditya Aman',
          author_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          published_at: formData.published ? new Date().toISOString() : null
        })
        router.push(`/admin/travel-guide-enhanced/edit/${savedGuide.id}`)
      } else {
        // Update existing guide
        savedGuide = await travelGuideService.updateTravelGuide(guideId, {
          ...formData,
          published_at: formData.published && !guide?.published ? new Date().toISOString() : guide?.published_at
        })
        setGuide(savedGuide)
      }

      alert('Travel guide saved successfully!')
    } catch (error) {
      console.error('Error saving guide:', error)
      alert('Error saving guide. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCTASave = async (ctaData: Partial<CustomCTA>) => {
    try {
      if (editingCTA) {
        // Update existing CTA
        const updated = await travelGuideService.updateCTA(editingCTA.id, ctaData)
        setCTAs(prev => prev.map(cta => cta.id === editingCTA.id ? updated : cta))
      } else {
        // Create new CTA
        const newCTA = await travelGuideService.createCTA({
          ...ctaData,
          guide_id: guideId
        })
        setCTAs(prev => [...prev, newCTA])
      }
      setEditingCTA(null)
      setShowCTADialog(false)
    } catch (error) {
      console.error('Error saving CTA:', error)
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
      if (editingDay.id) {
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
      if (editingFAQ.id) {
        // Update existing FAQ
        const updated = await travelGuideService.updateFAQ(editingFAQ.id, faqData)
        setFAQs(prev => prev.map(faq => faq.id === editingFAQ.id ? updated : faq))
      } else {
        // Create new FAQ
        const newFAQ = await travelGuideService.createFAQ({
          ...faqData,
          guide_id: guideId
        })
        setFAQs(prev => [...prev, newFAQ])
      }
      setEditingFAQ(null)
      setShowFAQDialog(false)
    } catch (error) {
      console.error('Error saving FAQ:', error)
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

  const handleGalleryImageSave = async (imageData: any) => {
    try {
      if (editingGalleryImage?.id) {
        // Update existing image
        const updated = await travelGuideService.updateGalleryImage(editingGalleryImage.id, imageData)
        setGalleryImages(prev => prev.map(img => img.id === editingGalleryImage.id ? updated : img))
      } else {
        // Create new image
        const newImage = await travelGuideService.addGalleryImage({
          ...imageData,
          guide_id: guideId,
          position: galleryImages.length + 1
        })
        setGalleryImages(prev => [...prev, newImage])
      }
      setEditingGalleryImage(null)
      setShowGalleryDialog(false)
    } catch (error) {
      console.error('Error saving gallery image:', error)
    }
  }

  const handleGalleryImageDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await travelGuideService.deleteGalleryImage(id)
        setGalleryImages(prev => prev.filter(img => img.id !== id))
      } catch (error) {
        console.error('Error deleting gallery image:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600 font-medium">Loading travel guide...</p>
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
              onClick={() => router.push('/admin/travel-guide-enhanced')}
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
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="ctas">CTAs</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="faqs">FAQs</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter guide title..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="guide-slug"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
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
                          value={formData.destination}
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
                          onChange={(e) => setFormData(prev => ({ ...prev, read_time_minutes: parseInt(e.target.value) }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="featured_image">Featured Image URL</Label>
                      <Input
                        id="featured_image"
                        value={formData.featured_image}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
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
                      <Label htmlFor="content">Main Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Write your comprehensive travel guide content here..."
                        rows={20}
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="seo_title">SEO Title</Label>
                        <Input
                          id="seo_title"
                          value={formData.seo_title}
                          onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                          placeholder="SEO optimized title..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seo_keywords">SEO Keywords</Label>
                        <Input
                          id="seo_keywords"
                          value={formData.seo_keywords}
                          onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seo_description">SEO Description</Label>
                      <Textarea
                        id="seo_description"
                        value={formData.seo_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                        placeholder="Meta description for search engines..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="ctas" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-primary">Custom CTAs</h3>
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
                    </div>

                    <div className="space-y-4">
                      {ctas.map((cta) => (
                        <CTAPreview
                          key={cta.id}
                          cta={cta}
                          onEdit={setEditingCTA}
                          onDelete={handleCTADelete}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="itinerary" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-primary">Itinerary Days</h3>
                      <Button
                        onClick={addItineraryDay}
                        className="bg-gradient-primary text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Day
                      </Button>
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
                      <Button
                        onClick={addFAQ}
                        className="bg-gradient-primary text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add FAQ
                      </Button>
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

                  <TabsContent value="gallery" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-primary">Photo Gallery</h3>
                      <Button
                        onClick={() => {
                          setEditingGalleryImage(null)
                          setShowGalleryDialog(true)
                        }}
                        className="bg-gradient-primary text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Image
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {galleryImages.map((image, index) => (
                        <Card key={image.id} className="overflow-hidden">
                          <div className="relative aspect-square">
                            <img
                              src={image.image_url}
                              alt={image.alt_text || `Gallery image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 flex space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingGalleryImage(image)
                                  setShowGalleryDialog(true)
                                }}
                                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGalleryImageDelete(image.id)}
                                className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <div className="space-y-1">
                              <p className="text-sm font-medium truncate">
                                {image.alt_text || 'No alt text'}
                              </p>
                              {image.caption && (
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {image.caption}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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

      {/* Gallery Image Dialog */}
      <GalleryImageDialog
        open={showGalleryDialog}
        onOpenChange={setShowGalleryDialog}
        image={editingGalleryImage}
        onSave={handleGalleryImageSave}
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

// Gallery Image Dialog Component
function GalleryImageDialog({ open, onOpenChange, image, onSave }: any) {
  const [formData, setFormData] = useState({
    image_url: '',
    alt_text: '',
    caption: ''
  })

  useEffect(() => {
    if (image) {
      setFormData({
        image_url: image.image_url || '',
        alt_text: image.alt_text || '',
        caption: image.caption || ''
      })
    } else {
      setFormData({
        image_url: '',
        alt_text: '',
        caption: ''
      })
    }
  }, [image])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{image?.id ? 'Edit Gallery Image' : 'Add Gallery Image'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload
              value={formData.image_url}
              onChange={handleImageUpload}
              folder="gallery"
              placeholder="Upload image or enter URL..."
              className="w-full"
            />
          </div>

          {/* Alt Text */}
          <div className="space-y-2">
            <Label htmlFor="alt_text">Alt Text</Label>
            <Input
              id="alt_text"
              value={formData.alt_text}
              onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
              placeholder="Describe the image for accessibility..."
              required
            />
            <p className="text-sm text-gray-500">
              Describe what's in the image for screen readers and SEO
            </p>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (Optional)</Label>
            <Textarea
              id="caption"
              value={formData.caption}
              onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              placeholder="Optional caption displayed in lightbox..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-primary text-white"
              disabled={!formData.image_url.trim() || !formData.alt_text.trim()}
            >
              {image?.id ? 'Update Image' : 'Add Image'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}