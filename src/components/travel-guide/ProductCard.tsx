import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, Users, Heart, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  experience: {
    id: string
    title: string
    slug: string
    short_description?: string
    price: number
    original_price?: number
    currency?: string
    main_image_url?: string
    duration?: string
    max_group_size?: number
    rating?: number
    review_count?: number
    featured?: boolean
    bestseller?: boolean
    cities?: { name: string }
    categories?: { name: string }
  }
  className?: string
}

export function ProductCard({ experience, className = '' }: ProductCardProps) {
  const {
    id,
    title,
    slug,
    short_description,
    price,
    original_price,
    currency = 'USD',
    main_image_url,
    duration,
    max_group_size,
    rating,
    review_count = 0,
    featured,
    bestseller,
    cities,
    categories
  } = experience

  const formatPrice = (amount: number) => {
    if (currency === 'USD') return `$${amount}`
    if (currency === 'EUR') return `€${amount}`
    if (currency === 'GBP') return `£${amount}`
    return `${currency} ${amount}`
  }

  const hasDiscount = original_price && original_price > price

  return (
    <Card className={`group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/tour/${slug}`}>
            <div className="relative h-36 sm:h-44 md:h-48 overflow-hidden">
              {main_image_url ? (
                <Image
                  src={main_image_url}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {bestseller && (
                  <Badge className="bg-orange-500 text-white">
                    Bestseller
                  </Badge>
                )}
                {featured && (
                  <Badge className="bg-primary text-white">
                    Featured
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge className="bg-red-500 text-white">
                    {Math.round(((original_price! - price) / original_price!) * 100)}% Off
                  </Badge>
                )}
              </div>

              {/* Wishlist Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 bg-white/80 hover:bg-white/90"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </Link>
        </div>

        <div className="p-3 md:p-4">
          {/* Location and Rating */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
            <div className="flex items-center space-x-2">
              {cities?.name && (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{cities.name}</span>
                </div>
              )}
              {categories?.name && !cities?.name && (
                <span className="text-sm text-gray-600 truncate">{categories.name}</span>
              )}
            </div>
            {rating && rating > 0 && (
              <div className="flex items-center justify-center sm:justify-start space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                {review_count > 0 && (
                  <span className="text-sm text-gray-500">({review_count})</span>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <Link href={`/tour/${slug}`}>
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2 text-center sm:text-left">
              {title}
            </h3>
          </Link>

          {/* Short Description */}
          {short_description && (
            <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 text-center sm:text-left">
              {short_description}
            </p>
          )}

          {/* Details */}
          <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4 mb-3 text-sm text-gray-600">
            {duration && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">{duration}</span>
              </div>
            )}
            {max_group_size && (
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Up to {max_group_size}</span>
              </div>
            )}
          </div>

          {/* Price and Book Now */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex flex-col items-center sm:items-start">
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(original_price!)}
                </span>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatPrice(price)}
                </span>
                <span className="text-sm text-gray-600">per person</span>
              </div>
            </div>
            <div className="flex justify-center sm:justify-end">
              <Link href={`/tour/${slug}`}>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-medium w-full sm:w-auto px-6">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}