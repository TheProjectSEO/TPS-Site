'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Upload, 
  Search, 
  Edit, 
  Trash2, 
  Star, 
  Shield, 
  Download,
  Users,
  TrendingUp,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  EnhancedReview, 
  ReviewStats, 
  reviewsService 
} from '@/lib/supabase/reviewsService'

export default function ReviewsAdminPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<EnhancedReview[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [featuredFilter, setFeaturedFilter] = useState<string>('all')
  const [productFilter, setProductFilter] = useState<string>('all')
  const [showCSVDialog, setShowCSVDialog] = useState(false)
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    loadReviews()
    loadStats()
  }, [statusFilter, countryFilter, featuredFilter, productFilter])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const filters: any = {}
      
      if (statusFilter !== 'all') filters.status = statusFilter
      if (countryFilter !== 'all') filters.country_code = countryFilter
      if (featuredFilter === 'featured') filters.featured = true
      if (featuredFilter === 'not-featured') filters.featured = false
      if (productFilter !== 'all') filters.product_id = productFilter

      const data = await reviewsService.getAllReviews(filters)
      setReviews(data)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await reviewsService.getReviewStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.reviewer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.review_text.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      await reviewsService.updateReview(reviewId, { status: newStatus as any })
      await loadReviews()
    } catch (error) {
      console.error('Error updating review status:', error)
    }
  }

  const handleFeaturedToggle = async (reviewId: string, featured: boolean) => {
    try {
      await reviewsService.updateReview(reviewId, { featured })
      await loadReviews()
    } catch (error) {
      console.error('Error updating review featured status:', error)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewsService.deleteReview(reviewId)
        await loadReviews()
      } catch (error) {
        console.error('Error deleting review:', error)
      }
    }
  }

  const handleBulkStatusChange = async (status: 'published' | 'pending' | 'rejected') => {
    if (selectedReviews.length === 0) return
    
    try {
      await reviewsService.bulkUpdateReviewStatus(selectedReviews, status)
      setSelectedReviews([])
      await loadReviews()
    } catch (error) {
      console.error('Error updating review statuses:', error)
    }
  }

  const handlePublishAllPending = async () => {
    if (confirm('Are you sure you want to publish all pending reviews?')) {
      try {
        const count = await reviewsService.publishAllPendingReviews()
        alert(`Successfully published ${count} reviews`)
        await loadReviews()
      } catch (error) {
        console.error('Error publishing pending reviews:', error)
      }
    }
  }

  const handleSelectReview = (reviewId: string) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    )
  }

  const handleSelectAll = () => {
    setSelectedReviews(prev => 
      prev.length === filteredReviews.length 
        ? []
        : filteredReviews.map(r => r.id)
    )
  }

  const getCountryFlag = (countryCode: string) => {
    const flags: { [key: string]: string } = {
      'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺', 'DE': '🇩🇪',
      'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸', 'JP': '🇯🇵', 'KR': '🇰🇷',
      'CN': '🇨🇳', 'IN': '🇮🇳', 'BR': '🇧🇷', 'MX': '🇲🇽', 'NL': '🇳🇱'
    }
    return flags[countryCode] || '🌍'
  }

  const exportCSV = () => {
    const csvContent = [
      ['Reviewer Name', 'Country', 'Rating', 'Title', 'Review', 'Date', 'Status', 'Featured'].join(','),
      ...filteredReviews.map(review => [
        `"${review.reviewer_name}"`,
        `"${review.country_name}"`,
        review.rating,
        `"${review.title}"`,
        `"${review.review_text.replace(/"/g, '""')}"`,
        review.review_date,
        review.status,
        review.featured
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reviews-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Reviews Management</h1>
          <p className="text-secondary font-medium mt-1">
            Manage customer reviews and testimonials
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={showCSVDialog} onOpenChange={setShowCSVDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Reviews from CSV</DialogTitle>
              </DialogHeader>
              <CSVUploadForm onSuccess={() => {
                setShowCSVDialog(false)
                loadReviews()
              }} />
            </DialogContent>
          </Dialog>
          <Button 
            onClick={handlePublishAllPending}
            variant="outline"
            className="text-green-600 hover:bg-green-50"
          >
            Publish All Pending
          </Button>
          <Button 
            onClick={() => router.push('/admin/reviews/new')}
            className="bg-gradient-primary text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Review
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold">{stats.total_reviews}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold">{stats.average_rating.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">5-Star Reviews</p>
                  <p className="text-2xl font-bold">{stats.rating_distribution[5]}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Countries</p>
                  <p className="text-2xl font-bold">
                    {new Set(reviews.map(r => r.country_code)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="not-featured">Not Featured</SelectItem>
              </SelectContent>
            </Select>

            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {Array.from(new Set(reviews.map(r => r.product_id).filter(Boolean))).map(productId => (
                  <SelectItem key={productId} value={productId!}>
                    {productId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {Array.from(new Set(reviews.map(r => r.country_code))).map(code => {
                  const country = reviews.find(r => r.country_code === code)
                  return (
                    <SelectItem key={code} value={code}>
                      {getCountryFlag(code)} {country?.country_name}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                {selectedReviews.length === filteredReviews.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedReviews.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedReviews.length} review{selectedReviews.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkStatusChange('published')}
                    className="text-green-600 hover:bg-green-50"
                  >
                    Publish
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkStatusChange('pending')}
                    className="text-yellow-600 hover:bg-yellow-50"
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkStatusChange('rejected')}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews ({filteredReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map(review => (
                <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(review.id)}
                          onChange={() => handleSelectReview(review.id)}
                          className="mt-1 mr-2"
                        />
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center text-lg">
                          {getCountryFlag(review.country_code)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {review.reviewer_name}
                          </h4>
                          <Badge variant="outline">{review.country_name}</Badge>
                          {review.product_id && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {review.product_id}
                            </Badge>
                          )}
                          {review.verified && (
                            <Shield className="w-4 h-4 text-green-500" />
                          )}
                          {review.featured && (
                            <Badge variant="secondary">Featured</Badge>
                          )}
                          <Badge 
                            variant={
                              review.status === 'published' ? 'default' :
                              review.status === 'pending' ? 'secondary' :
                              'destructive'
                            }
                          >
                            {review.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i <= review.rating 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                        
                        <h5 className="font-medium text-gray-900 mb-1">
                          {review.title}
                        </h5>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {review.review_text}
                        </p>
                        
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(review.review_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFeaturedToggle(review.id, !review.featured)}
                      >
                        <Star className={`h-4 w-4 ${review.featured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                      
                      <Select
                        value={review.status}
                        onValueChange={(value) => handleStatusChange(review.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/reviews/edit/${review.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// CSV Upload Form Component
function CSVUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      // Parse CSV file
      const text = await file.text()
      const lines = text.split('\n')
      const headers = lines[0].split(',')
      
      // Validate headers
      const requiredHeaders = ['reviewer_name', 'country_code', 'country_name', 'rating', 'title', 'review_text', 'product_id']
      const missingHeaders = requiredHeaders.filter(header => !headers.includes(header))
      
      if (missingHeaders.length > 0) {
        alert(`Missing required headers: ${missingHeaders.join(', ')}`)
        return
      }

      // Parse data rows
      const csvData = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',')
        const row: any = {}
        headers.forEach((header, index) => {
          let value = values[index]?.replace(/^"|"$/g, '') // Remove quotes
          
          // Type conversions
          if (header === 'rating') value = parseFloat(value)
          if (header === 'verified' || header === 'featured') value = value === 'true'
          
          row[header] = value
        })
        return row
      })

      // Create upload log
      const uploadLog = await reviewsService.createCSVUploadLog({
        filename: file.name,
        total_rows: csvData.length,
        uploaded_by: 'Admin User'
      })

      // Process the CSV data
      const result = await reviewsService.processCSVReviews(csvData, uploadLog.id)
      setUploadResult(result)

      if (result.successful > 0) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error uploading CSV:', error)
      alert('Error processing CSV file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Upload a CSV file with reviews. Required columns: reviewer_name, country_code, country_name, rating, title, review_text, product_id
        </p>
        
        <a 
          href="/CSV_Reviews_Template.csv" 
          download
          className="text-primary hover:underline text-sm"
        >
          Download CSV Template
        </a>
      </div>

      <Input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />

      {file && (
        <p className="text-sm text-gray-600">
          Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </p>
      )}

      {uploadResult && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Upload Results:</h4>
          <p className="text-green-600">✓ {uploadResult.successful} reviews imported successfully</p>
          {uploadResult.failed > 0 && (
            <p className="text-red-600">✗ {uploadResult.failed} reviews failed</p>
          )}
          {uploadResult.errors.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm">View Errors</summary>
              <ul className="text-xs text-red-600 mt-1 space-y-1">
                {uploadResult.errors.map((error: string, index: number) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-gradient-primary text-white"
        >
          {uploading ? 'Uploading...' : 'Upload Reviews'}
        </Button>
      </div>
    </div>
  )
}