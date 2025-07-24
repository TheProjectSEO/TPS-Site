'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, ExternalLink, Settings, Link } from 'lucide-react'
import { 
  InternalLinkCategory, 
  InternalLink, 
  internalLinksService 
} from '@/lib/supabase/internalLinksService'
import { useAuth } from '@/components/providers/AuthProvider'

export default function TravelGuideLinksManager() {
  const { user, loading: authLoading } = useAuth()
  const [categories, setCategories] = useState<InternalLinkCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('categories')
  
  // Category form state
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<InternalLinkCategory | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    title: '',
    description: '',
    slug: '',
    display_order: 0,
    active: true
  })

  // Link form state
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [editingLink, setEditingLink] = useState<InternalLink | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [linkForm, setLinkForm] = useState({
    category_id: '',
    title: '',
    url: '',
    description: '',
    display_order: 0,
    active: true
  })

  // Auth check
  if (authLoading) {
    return <div className="p-8">Loading...</div>
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You need to be logged in to access this page.</p>
      </div>
    )
  }

  const fetchCategories = async () => {
    try {
      const data = await internalLinksService.getInternalLinkCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await internalLinksService.updateCategory(editingCategory.id, categoryForm)
      } else {
        await internalLinksService.createCategory(categoryForm)
      }
      setShowCategoryDialog(false)
      resetCategoryForm()
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingLink) {
        await internalLinksService.updateLink(editingLink.id, linkForm)
      } else {
        await internalLinksService.createLink(linkForm)
      }
      setShowLinkDialog(false)
      resetLinkForm()
      fetchCategories()
    } catch (error) {
      console.error('Error saving link:', error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure? This will delete all links in this category.')) {
      try {
        await internalLinksService.deleteCategory(id)
        fetchCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      try {
        await internalLinksService.deleteLink(id)
        fetchCategories()
      } catch (error) {
        console.error('Error deleting link:', error)
      }
    }
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      title: '',
      description: '',
      slug: '',
      display_order: 0,
      active: true
    })
    setEditingCategory(null)
  }

  const resetLinkForm = () => {
    setLinkForm({
      category_id: '',
      title: '',
      url: '',
      description: '',
      display_order: 0,
      active: true
    })
    setEditingLink(null)
  }

  const openCategoryDialog = (category?: InternalLinkCategory) => {
    if (category) {
      setEditingCategory(category)
      setCategoryForm({
        name: category.name,
        title: category.title,
        description: category.description || '',
        slug: category.slug,
        display_order: category.display_order,
        active: category.active
      })
    } else {
      resetCategoryForm()
    }
    setShowCategoryDialog(true)
  }

  const openLinkDialog = (categoryId?: string, link?: InternalLink) => {
    if (link) {
      setEditingLink(link)
      setLinkForm({
        category_id: link.category_id,
        title: link.title,
        url: link.url,
        description: link.description || '',
        display_order: link.display_order,
        active: link.active
      })
    } else {
      resetLinkForm()
      if (categoryId) {
        setLinkForm(prev => ({ ...prev, category_id: categoryId }))
      }
    }
    setShowLinkDialog(true)
  }

  if (loading) {
    return <div className="p-8">Loading travel guide links...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Travel Guide Links Manager</h1>
        <p className="text-gray-600">Manage internal link categories and individual links for travel guides.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Link Categories</h2>
            <Button onClick={() => openCategoryDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">/{category.slug}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={category.active ? 'default' : 'secondary'}>
                        {category.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{category.links.length} links</span>
                    <span>Order: {category.display_order}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openCategoryDialog(category)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="links" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Internal Links</h2>
            <Button onClick={() => openLinkDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>

          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openLinkDialog(category.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {category.links.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No links in this category yet.</p>
                ) : (
                  <div className="space-y-3">
                    {category.links.map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <Link className="h-4 w-4 text-gray-400" />
                            <div>
                              <h4 className="font-medium">{link.title}</h4>
                              <p className="text-sm text-gray-600">{link.url}</p>
                              {link.description && (
                                <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={link.active ? 'default' : 'secondary'} className="text-xs">
                            {link.active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openLinkDialog(undefined, link)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLink(link.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={categoryForm.name}
                onChange={(e) => {
                  const name = e.target.value
                  setCategoryForm(prev => ({
                    ...prev,
                    name,
                    slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                  }))
                }}
                placeholder="e.g., rome"
                required
              />
            </div>
            <div>
              <Label htmlFor="category-title">Title</Label>
              <Input
                id="category-title"
                value={categoryForm.title}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Rome Travel Resources"
                required
              />
            </div>
            <div>
              <Label htmlFor="category-slug">Slug</Label>
              <Input
                id="category-slug"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="Automatically generated from name"
                required
              />
            </div>
            <div>
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description for this category"
              />
            </div>
            <div>
              <Label htmlFor="category-order">Display Order</Label>
              <Input
                id="category-order"
                type="number"
                value={categoryForm.display_order}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="category-active"
                checked={categoryForm.active}
                onCheckedChange={(checked) => setCategoryForm(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="category-active">Active</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCategoryDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCategory ? 'Update' : 'Create'} Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingLink ? 'Edit Link' : 'Add New Link'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLinkSubmit} className="space-y-4">
            <div>
              <Label htmlFor="link-category">Category</Label>
              <Select 
                value={linkForm.category_id} 
                onValueChange={(value) => setLinkForm(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="link-title">Title</Label>
              <Input
                id="link-title"
                value={linkForm.title}
                onChange={(e) => setLinkForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Ultimate Rome Food Guide"
                required
              />
            </div>
            <div>
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={linkForm.url}
                onChange={(e) => setLinkForm(prev => ({ ...prev, url: e.target.value }))}
                placeholder="e.g., /travel-guide/rome-food-guide"
                required
              />
            </div>
            <div>
              <Label htmlFor="link-description">Description</Label>
              <Textarea
                id="link-description"
                value={linkForm.description}
                onChange={(e) => setLinkForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description for this link"
              />
            </div>
            <div>
              <Label htmlFor="link-order">Display Order</Label>
              <Input
                id="link-order"
                type="number"
                value={linkForm.display_order}
                onChange={(e) => setLinkForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="link-active"
                checked={linkForm.active}
                onCheckedChange={(checked) => setLinkForm(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="link-active">Active</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowLinkDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingLink ? 'Update' : 'Create'} Link
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}