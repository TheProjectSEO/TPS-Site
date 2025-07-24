'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

interface TourCardProps {
  id: string
  title: string
  slug: string
  image: string
  images?: string[]
  price: number
  currency?: string
  duration?: string
  maxGroupSize?: number
  city: string
  featured?: boolean
  shortDescription?: string
  className?: string
}

export function TourCard({
  id,
  title,
  slug,
  image,
  images,
  price,
  currency = 'EUR',
  duration,
  maxGroupSize,
  city,
  featured,
  shortDescription,
  className = ''
}: TourCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  
  // Use multiple images if available, fallback to single image
  const allImages = images && images.length > 0 ? images : [image]
  
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    )
  }

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/tour/${slug}`
    const text = `Check out this amazing tour: ${title}`
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        break
    }
    setShowShareMenu(false)
  }

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'EUR': return '€'
      case 'USD': return '$'
      case 'GBP': return '£'
      default: return curr
    }
  }

  return (
    <Card className={`group cursor-pointer overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border border-gray-200 ${className}`}>
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative">
          <Link href={`/tour/${slug}`}>
            <div className="relative h-48 sm:h-52 overflow-hidden">
              <Image
                src={allImages[currentImageIndex]}
                alt={`${title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/eiffel-tower.webp'
                }}
              />
              
              {/* Bestseller Badge */}
              {featured && (
                <div className="absolute top-3 left-3">
                  <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Bestseller
                  </span>
                </div>
              )}

              {/* Navigation Arrows - Only show if multiple images */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  {/* Image Dots */}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {allImages.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex space-x-2">
                {/* Share Button */}
                <DropdownMenu open={showShareMenu} onOpenChange={setShowShareMenu}>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      className="bg-white/80 hover:bg-white p-2 rounded-full transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleShare('facebook')}>
                      Share on Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('twitter')}>
                      Share on Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('copy')}>
                      Copy Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Like Button */}
                <button
                  onClick={toggleLike}
                  className={`p-2 rounded-full transition-all ${
                    isLiked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/80 hover:bg-white text-gray-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </Link>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* City */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{city}</span>
          </div>

          {/* Title */}
          <Link href={`/tour/${slug}`}>
            <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Description */}
          {shortDescription && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
              {shortDescription}
            </p>
          )}

          {/* Tour Details */}
          <div className="flex flex-wrap gap-2 mb-4">
            {duration && (
              <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                <Clock className="w-3 h-3 text-blue-600 mr-1" />
                <span className="text-xs font-medium text-blue-800">{duration}</span>
              </div>
            )}
            {maxGroupSize && (
              <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                <Users className="w-3 h-3 text-green-600 mr-1" />
                <span className="text-xs font-medium text-green-800">Up to {maxGroupSize}</span>
              </div>
            )}
          </div>

          {/* Price and Book Now */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-lg font-bold text-gray-900">
                  {getCurrencySymbol(currency)}{price}
                </span>
                <span className="text-xs text-gray-600 ml-1">per person</span>
              </div>
            </div>
            <Link href={`/tour/${slug}`}>
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}