'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Experience {
  id: string
  title: string
  slug: string
  short_description: string
  price: number
  rating: number
  review_count: number
  duration: string
  max_group_size: number
  main_image_url: string
  featured: boolean
  categories?: { name: string }
  cities?: { name: string }
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  experience_count: number
}

interface CarouselProps {
  items: Experience[] | Category[]
  type: 'product' | 'category'
  children: (item: Experience | Category, index: number) => React.ReactNode
}

export function Carousel({ items, type, children }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Responsive items per view
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1.1 // Mobile: 1 full + peek
      if (window.innerWidth < 1024) return 1.8 // Tablet: 1.8 items
      return 2.3 // Desktop: 2 full + peek
    }
    return 2.3
  }
  
  const [itemsPerView, setItemsPerView] = useState(getItemsPerView())
  const maxIndex = Math.max(0, items.length - Math.floor(itemsPerView))

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView())
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{ 
            transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
          }}
        >
          {items.map((item, index) => (
            <div 
              key={item.id}
              className="flex-none"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              {children(item, index)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      {items.length > Math.floor(itemsPerView) && (
        <>
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </>
      )}
    </div>
  )
}