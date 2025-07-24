'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { reviewsService } from '@/lib/supabase/reviewsService'

export default function NewReviewPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    reviewer_name: '',
    reviewer_email: '',
    country_code: 'US',
    country_name: 'United States',
    rating: 5,
    title: '',
    review_text: '',
    product_id: '',
    verified: false,
    featured: false,
    status: 'pending' as 'pending' | 'published' | 'rejected',
    tags: ''
  })

  const countries = [
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
    { code: 'NL', name: 'Netherlands' }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode)
    setFormData(prev => ({
      ...prev,
      country_code: countryCode,
      country_name: country?.name || ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.reviewer_name || !formData.title || !formData.review_text || !formData.product_id) {
      alert('Please fill in all required fields including Product ID')
      return
    }

    setLoading(true)
    
    try {
      await reviewsService.createReview({
        reviewer_name: formData.reviewer_name,
        reviewer_email: formData.reviewer_email || undefined,
        country_code: formData.country_code,
        country_name: formData.country_name,
        rating: formData.rating,
        title: formData.title,
        review_text: formData.review_text,
        product_id: formData.product_id || undefined,
        verified: formData.verified,
        featured: formData.featured,
        status: formData.status,
        source: 'manual',
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        review_date: new Date().toISOString().split('T')[0]
      })

      router.push('/admin/reviews')
    } catch (error) {
      console.error('Error creating review:', error)
      alert('Failed to create review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/reviews')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Reviews</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">Add New Review</h1>
            <p className="text-secondary font-medium mt-1">
              Create a new customer review
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reviewer_name">Reviewer Name *</Label>
                    <Input
                      id="reviewer_name"
                      value={formData.reviewer_name}
                      onChange={(e) => handleInputChange('reviewer_name', e.target.value)}
                      placeholder="Enter reviewer name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reviewer_email">Email (Optional)</Label>
                    <Input
                      id="reviewer_email"
                      type="email"
                      value={formData.reviewer_email}
                      onChange={(e) => handleInputChange('reviewer_email', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select value={formData.country_code} onValueChange={handleCountryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="product_id">Product ID *</Label>
                    <Input
                      id="product_id"
                      value={formData.product_id}
                      onChange={(e) => handleInputChange('product_id', e.target.value)}
                      placeholder="e.g., tour_001, category_001"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Select 
                    value={formData.rating.toString()} 
                    onValueChange={(value) => handleInputChange('rating', parseFloat(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Review Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter review title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="review_text">Review Text *</Label>
                  <Textarea
                    id="review_text"
                    value={formData.review_text}
                    onChange={(e) => handleInputChange('review_text', e.target.value)}
                    placeholder="Enter the review content"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (Optional)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="Enter tags separated by commas"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Example: amazing, guides, planning
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: 'pending' | 'published' | 'rejected') => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={formData.verified}
                    onChange={(e) => handleInputChange('verified', e.target.checked)}
                  />
                  <Label htmlFor="verified">Verified Review</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                  />
                  <Label htmlFor="featured">Featured Review</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-primary text-white"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Review
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}