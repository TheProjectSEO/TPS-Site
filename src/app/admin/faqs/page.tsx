'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, Save, X, ChevronUp, ChevronDown, Check, ChevronsUpDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { sanitizeUuidFields } from '@/lib/utils/form-helpers'

interface FAQ {
  id: string
  question: string
  answer: string
  sort_order: number
  enabled: boolean
  experience_id?: string
  show_on_tour_page: boolean
  category: string
  created_at: string
  updated_at: string
  experiences?: { title: string; slug: string }
}

interface Experience {
  id: string
  title: string
  slug: string
}

export default function FAQsManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    experience_id: '',
    category: 'general',
    show_on_tour_page: false,
    sort_order: 1,
    enabled: true
  })
  const [showNewForm, setShowNewForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()

    try {
      // Fetch FAQs using API route
      const response = await fetch('/api/admin/faqs')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch FAQs')
      }

      setFaqs(result.faqs || [])

      // Fetch experiences for dropdown
      const { data: experiencesData, error: experiencesError } = await supabase
        .from('experiences')
        .select('id, title, slug')
        .eq('status', 'active')
        .order('title')

      if (experiencesError) throw experiencesError
      setExperiences(experiencesData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newFAQ.question.trim() || !newFAQ.answer.trim()) return

    try {
      const faqData = {
        question: newFAQ.question.trim(),
        answer: newFAQ.answer.trim(),
        experience_id: newFAQ.experience_id || null, // Convert empty string to null
        category: newFAQ.category,
        show_on_tour_page: newFAQ.show_on_tour_page,
        sort_order: newFAQ.sort_order,
        enabled: newFAQ.enabled
      }

      // Additional validation for experience_id
      if (faqData.experience_id === '' || faqData.experience_id === 'undefined') {
        faqData.experience_id = null
      }

      console.log('Creating FAQ with data:', faqData) // Debug log

      const response = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faqData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create FAQ')
      }

      setNewFAQ({
        question: '',
        answer: '',
        experience_id: '',
        category: 'general',
        show_on_tour_page: false,
        sort_order: 1,
        enabled: true
      })
      setShowNewForm(false)
      fetchData()
    } catch (error) {
      console.error('Error creating FAQ:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert('Error creating FAQ: ' + errorMessage)
    }
  }

  const handleUpdate = async (id: string, updates: Partial<FAQ>) => {
    try {
      // Handle experience_id properly
      const sanitizedUpdates = { ...updates }
      if ('experience_id' in sanitizedUpdates) {
        if (sanitizedUpdates.experience_id === '' || sanitizedUpdates.experience_id === 'undefined') {
          sanitizedUpdates.experience_id = null
        }
      }

      console.log('Updating FAQ with data:', sanitizedUpdates) // Debug log

      const response = await fetch('/api/admin/faqs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...sanitizedUpdates }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update FAQ')
      }
      
      setEditingId(null)
      fetchData()
    } catch (error) {
      console.error('Error updating FAQ:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert('Error updating FAQ: ' + errorMessage)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return

    try {
      const response = await fetch(`/api/admin/faqs?id=${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete FAQ')
      }

      fetchData()
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert('Error deleting FAQ: ' + errorMessage)
    }
  }

  const toggleEnabled = async (id: string, enabled: boolean) => {
    await handleUpdate(id, { enabled })
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading FAQs...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQs Management</h1>
          <p className="text-gray-600 mt-2">Manage frequently asked questions for your tours</p>
        </div>
        <Button onClick={() => setShowNewForm(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {/* New FAQ Form */}
      {showNewForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="new-experience">Tour (Optional)</Label>
              <SearchableTourSelect
                experiences={experiences}
                value={newFAQ.experience_id}
                onValueChange={(value) => setNewFAQ(prev => ({ ...prev, experience_id: value }))}
                placeholder="Search tours by name or ID..."
              />
            </div>

            <div>
              <Label htmlFor="new-question">Question</Label>
              <Input
                id="new-question"
                value={newFAQ.question}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter the question"
              />
            </div>

            <div>
              <Label htmlFor="new-answer">Answer</Label>
              <Textarea
                id="new-answer"
                value={newFAQ.answer}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="Enter the answer"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-category">Category</Label>
                <select
                  id="new-category"
                  value={newFAQ.category}
                  onChange={(e) => setNewFAQ(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="general">General</option>
                  <option value="booking">Booking</option>
                  <option value="pricing">Pricing</option>
                  <option value="weather">Weather</option>
                  <option value="accessibility">Accessibility</option>
                  <option value="equipment">Equipment</option>
                  <option value="cancellation">Cancellation</option>
                </select>
              </div>

              <div className="flex items-end">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="new-show-on-tour"
                    checked={newFAQ.show_on_tour_page}
                    onChange={(e) => setNewFAQ(prev => ({ ...prev, show_on_tour_page: e.target.checked }))}
                    className="mr-2"
                  />
                  <Label htmlFor="new-show-on-tour">Show on Tour Pages</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <Label htmlFor="new-sort-order">Sort Order</Label>
                <Input
                  id="new-sort-order"
                  type="number"
                  value={newFAQ.sort_order}
                  onChange={(e) => setNewFAQ(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 1 }))}
                  className="w-20"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="new-enabled"
                  checked={newFAQ.enabled}
                  onChange={(e) => setNewFAQ(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="mr-2"
                />
                <Label htmlFor="new-enabled">Enabled</Label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleCreate}>
                <Save className="h-4 w-4 mr-2" />
                Save FAQ
              </Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQs List */}
      <div className="space-y-4">
        {faqs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No FAQs found. Create your first FAQ to get started.</p>
            </CardContent>
          </Card>
        ) : (
          faqs.map((faq) => (
            <Card key={faq.id} className={`${!faq.enabled ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                {editingId === faq.id ? (
                  <EditFAQForm
                    faq={faq}
                    experiences={experiences}
                    onSave={(updates) => handleUpdate(faq.id, updates)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                          {!faq.enabled && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">Disabled</span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{faq.answer}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {faq.category || 'general'}
                          </span>
                          {faq.show_on_tour_page && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              Shows on Tour Pages
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {faq.experience_id && (faq as any).experiences ? 
                            `Tour: ${(faq as any).experiences.title}` : 
                            'General FAQ (All Tours)'
                          } • Sort: {faq.sort_order}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEnabled(faq.id, !faq.enabled)}
                        >
                          {faq.enabled ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                          {faq.enabled ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(faq.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(faq.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

// Searchable Tour Select Component
interface SearchableTourSelectProps {
  experiences: Experience[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

function SearchableTourSelect({ experiences, value, onValueChange, placeholder }: SearchableTourSelectProps) {
  const [open, setOpen] = useState(false)
  
  const selectedExperience = experiences.find(exp => exp.id === value)
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedExperience ? selectedExperience.title : "General FAQ (All Tours)"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder || "Search tours..."} />
          <CommandEmpty>No tours found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            <CommandItem
              value=""
              onSelect={() => {
                onValueChange("")
                setOpen(false)
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === "" ? "opacity-100" : "opacity-0"
                )}
              />
              General FAQ (All Tours)
            </CommandItem>
            {experiences.map((experience) => (
              <CommandItem
                key={experience.id}
                value={`${experience.title} ${experience.id} ${experience.slug}`.toLowerCase()}
                onSelect={() => {
                  onValueChange(experience.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === experience.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{experience.title}</span>
                  <span className="text-xs text-gray-500">ID: {experience.id} • Slug: {experience.slug}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Edit FAQ Form Component
function EditFAQForm({ 
  faq, 
  experiences, 
  onSave, 
  onCancel 
}: { 
  faq: FAQ
  experiences: Experience[]
  onSave: (updates: Partial<FAQ>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    question: faq.question,
    answer: faq.answer,
    experience_id: faq.experience_id || '',
    category: faq.category || 'general',
    show_on_tour_page: faq.show_on_tour_page || false,
    sort_order: faq.sort_order,
    enabled: faq.enabled
  })

  const handleSave = () => {
    if (!formData.question.trim() || !formData.answer.trim()) return
    
    // Handle experience_id properly
    let experienceId = formData.experience_id
    if (experienceId === '' || experienceId === 'undefined') {
      experienceId = null
    }
    
    onSave({
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      experience_id: experienceId,
      category: formData.category,
      show_on_tour_page: formData.show_on_tour_page,
      sort_order: formData.sort_order,
      enabled: formData.enabled
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Tour (Optional)</Label>
        <SearchableTourSelect
          experiences={experiences}
          value={formData.experience_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, experience_id: value }))}
          placeholder="Search tours by name or ID..."
        />
      </div>

      <div>
        <Label>Question</Label>
        <Input
          value={formData.question}
          onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
        />
      </div>

      <div>
        <Label>Answer</Label>
        <Textarea
          value={formData.answer}
          onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Category</Label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="general">General</option>
            <option value="booking">Booking</option>
            <option value="pricing">Pricing</option>
            <option value="weather">Weather</option>
            <option value="accessibility">Accessibility</option>
            <option value="equipment">Equipment</option>
            <option value="cancellation">Cancellation</option>
          </select>
        </div>

        <div className="flex items-end">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.show_on_tour_page}
              onChange={(e) => setFormData(prev => ({ ...prev, show_on_tour_page: e.target.checked }))}
              className="mr-2"
            />
            <Label>Show on Tour Pages</Label>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div>
          <Label>Sort Order</Label>
          <Input
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 1 }))}
            className="w-20"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.enabled}
            onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
            className="mr-2"
          />
          <Label>Enabled</Label>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  )
}