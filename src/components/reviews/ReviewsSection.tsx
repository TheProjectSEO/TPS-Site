'use client'

import { useState, useEffect } from 'react'
import { Star, ThumbsUp } from 'lucide-react'
import { EnhancedReview, ReviewStats, reviewsService } from '@/lib/supabase/reviewsService'

interface ReviewsSectionProps {
  pageType: string
  pageId: string
  productId?: string
  title?: string
  showRatingSummary?: boolean
  displayCount?: number
  className?: string
}

export function ReviewsSection({
  pageType,
  pageId,
  productId,
  title = "Customer Reviews",
  showRatingSummary = true,
  displayCount = 6,
  className = ''
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<EnhancedReview[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    loadReviews()
  }, [pageType, pageId, productId])

  const loadReviews = async () => {
    try {
      setLoading(true)

      // Check if reviews are enabled for this page
      const settings = await reviewsService.getPageReviewSettings(pageType, pageId, productId)
      if (!settings?.reviews_enabled) {
        setIsEnabled(false)
        setLoading(false)
        return
      }

      setIsEnabled(true)

      // Load reviews assigned to this page
      const assignments = await reviewsService.getPageReviews(pageType, pageId, productId, true)
      const reviewsData = assignments
        .filter(assignment => assignment.review)
        .map(assignment => assignment.review!)
        .filter(review => review.status === 'published')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setReviews(reviewsData)

      // Load statistics if enabled
      if (showRatingSummary) {
        const statsData = await reviewsService.getReviewStats(pageType, pageId, productId)
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderRatingBar = (rating: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0
    
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="w-12 text-gray-700 font-medium">{rating} star{rating !== 1 ? 's' : ''}</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[100px] sm:min-w-[200px]">
          <div 
            className="bg-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-8 text-right text-gray-700 font-medium">{count}</span>
      </div>
    )
  }

  const formatReviewDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const getAvatarGradient = (avatarIcon: number) => {
    const gradients = [
      'bg-gradient-to-br from-secondary to-green-600', // Dark Green to Green
      'bg-gradient-to-br from-highlight to-pink-500', // Pink to Pink  
      'bg-gradient-to-br from-blue-600 to-secondary', // Blue to Dark Green
      'bg-gradient-to-br from-orange-500 to-yellow-500', // Orange to Yellow
      'bg-gradient-to-br from-teal-600 to-cyan-500', // Teal to Cyan
      'bg-gradient-to-br from-red-500 to-pink-500', // Red to Pink
      'bg-gradient-to-br from-indigo-600 to-blue-500' // Indigo to Blue
    ]
    return gradients[(avatarIcon - 1) % gradients.length] || gradients[0]
  }

  if (loading) {
    return (
      <div className={`animate-pulse py-8 ${className}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!isEnabled) {
    return null
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
          
          {/* Review Count Header */}
          {showRatingSummary && stats && stats.total_reviews > 0 && (
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">{stats.average_rating.toFixed(1)}</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i <= Math.round(stats.average_rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span>({stats.total_reviews.toLocaleString()} reviews)</span>
              </div>
            </div>
          )}
          
          {/* Rating Summary */}
          {showRatingSummary && stats && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <p className="text-center text-sm text-gray-600 mb-6">
                Total reviews and rating from Cuddly Nest
              </p>
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12">
                {/* Overall Rating */}
                <div className="flex flex-col items-center text-center min-w-[120px]">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {stats.total_reviews > 0 ? stats.average_rating.toFixed(1) : '0.0'}
                  </div>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          stats.total_reviews > 0 && i <= Math.round(stats.average_rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    {stats.total_reviews > 0 
                      ? `based on ${stats.total_reviews.toLocaleString()} reviews`
                      : 'No reviews yet'
                    }
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 w-full space-y-3">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating}>
                      {renderRatingBar(
                        rating, 
                        stats.rating_distribution[rating as keyof typeof stats.rating_distribution] || 0,
                        stats.total_reviews
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-4 h-4 rounded-full bg-gray-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>We perform checks on reviews</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.slice(0, displayCount).map((review) => (
            <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full ${getAvatarGradient(review.avatar_icon)} flex items-center justify-center text-white font-medium text-base flex-shrink-0 shadow-md`}>
                  {review.reviewer_name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-3">
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
                  
                  {/* Review Title */}
                  <h3 className="font-semibold text-gray-900 mb-3 text-base sm:text-lg">
                    {review.title}
                  </h3>
                  
                  {/* Reviewer Info */}
                  <p className="text-sm text-gray-600 mb-4">
                    {review.reviewer_name}, {formatReviewDate(review.review_date)}
                  </p>
                  
                  {/* Review Text */}
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-5">
                    {review.review_text}
                  </p>
                  
                  {/* Helpful Button */}
                  <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors text-sm bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}