'use client'

import { Star, Shield, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EnhancedReview } from '@/lib/supabase/reviewsService'

interface ReviewCardProps {
  review: EnhancedReview
  showFullText?: boolean
  className?: string
}

// Avatar icon mapping (using consistent icons for each number)
const AVATAR_ICONS = {
  1: '👤', // Generic person
  2: '🧑‍💼', // Business person
  3: '👩‍🦱', // Woman with curly hair
  4: '🧑‍🎓', // Graduate
  5: '👩‍💻', // Woman technologist
  6: '🧑‍🍳', // Chef
  7: '👩‍🎨', // Woman artist
}

// Country flag emoji mapping (using most common countries)
const COUNTRY_FLAGS: { [key: string]: string } = {
  'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺', 'DE': '🇩🇪',
  'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸', 'JP': '🇯🇵', 'KR': '🇰🇷',
  'CN': '🇨🇳', 'IN': '🇮🇳', 'BR': '🇧🇷', 'MX': '🇲🇽', 'NL': '🇳🇱',
  'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'CH': '🇨🇭',
  'AT': '🇦🇹', 'BE': '🇧🇪', 'PT': '🇵🇹', 'IE': '🇮🇪', 'NZ': '🇳🇿',
  'ZA': '🇿🇦', 'SG': '🇸🇬', 'MY': '🇲🇾', 'TH': '🇹🇭', 'PH': '🇵🇭',
  'ID': '🇮🇩', 'VN': '🇻🇳', 'RU': '🇷🇺', 'PL': '🇵🇱', 'CZ': '🇨🇿',
  'HU': '🇭🇺', 'RO': '🇷🇴', 'BG': '🇧🇬', 'HR': '🇭🇷', 'GR': '🇬🇷',
  'TR': '🇹🇷', 'IL': '🇮🇱', 'AE': '🇦🇪', 'SA': '🇸🇦', 'EG': '🇪🇬',
  'MA': '🇲🇦', 'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪',
  'UY': '🇺🇾'
}

export function ReviewCard({ review, showFullText = false, className = '' }: ReviewCardProps) {
  const avatarIcon = AVATAR_ICONS[review.avatar_icon as keyof typeof AVATAR_ICONS] || AVATAR_ICONS[1]
  const countryFlag = COUNTRY_FLAGS[review.country_code] || '🌍'
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-4 h-4">
          <Star className="absolute w-4 h-4 text-gray-300" />
          <div className="absolute overflow-hidden w-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )
    }

    while (stars.length < 5) {
      stars.push(
        <Star key={stars.length} className="w-4 h-4 text-gray-300" />
      )
    }

    return stars
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  return (
    <Card className={`relative overflow-hidden hover:shadow-md transition-shadow duration-300 ${className}`}>
      <CardContent className="p-6">
        {/* Header with avatar, name, and country */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center text-2xl">
              {avatarIcon}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900 truncate">
                {review.reviewer_name}
              </h4>
              {review.verified && (
                <Shield className="w-4 h-4 text-green-500" title="Verified Review" />
              )}
              {review.featured && (
                <Badge variant="secondary" className="text-xs">
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-lg">{countryFlag}</span>
              <span>{review.country_name}</span>
              <span>•</span>
              <span>{formatDate(review.review_date)}</span>
            </div>
          </div>
        </div>

        {/* Rating and title */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {review.rating.toFixed(1)}
            </span>
          </div>
          
          <h5 className="font-semibold text-gray-900 mb-2">
            {review.title}
          </h5>
        </div>

        {/* Review text */}
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">
            {showFullText 
              ? review.review_text 
              : truncateText(review.review_text, 150)
            }
          </p>
        </div>

        {/* Tags */}
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {review.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {review.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{review.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer with helpful count */}
        {review.helpful_count > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Heart className="w-4 h-4" />
            <span>{review.helpful_count} found this helpful</span>
          </div>
        )}

        {/* Status indicator for admin views */}
        {review.status !== 'published' && (
          <div className="absolute top-2 right-2">
            <Badge 
              variant={review.status === 'pending' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {review.status}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}