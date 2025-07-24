'use client'

import React, { useRef, useEffect, useState } from 'react'
import { TourCard } from './TourCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Tour {
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
}

interface TourCardsGridProps {
  tours: Tour[]
  className?: string
}

export function TourCardsGrid({ tours, className = '' }: TourCardsGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    const updateScrollButtons = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      }
    }

    updateScrollButtons()
    
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateScrollButtons)
      return () => scrollContainer.removeEventListener('scroll', updateScrollButtons)
    }
  }, [tours])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 280 // Approximate card width + gap
      scrollContainerRef.current.scrollBy({ 
        left: -cardWidth, 
        behavior: 'smooth' 
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 280 // Approximate card width + gap
      scrollContainerRef.current.scrollBy({ 
        left: cardWidth, 
        behavior: 'smooth' 
      })
    }
  }

  if (tours.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No tours available at the moment.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Desktop Grid Layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tours.map((tour) => (
          <TourCard
            key={tour.id}
            {...tour}
          />
        ))}
      </div>

      {/* Mobile Carousel Layout */}
      <div className="md:hidden">
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className="h-8 w-8 p-0 rounded-full disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={scrollRight}
                disabled={!canScrollRight}
                className="h-8 w-8 p-0 rounded-full disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <span className="text-xs text-gray-500">
              Scroll for more tours
            </span>
          </div>

          {/* Horizontal Scrolling Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tours.map((tour, index) => (
              <TourCard
                key={tour.id}
                {...tour}
                className={`flex-none w-[280px] ${
                  index === tours.length - 1 ? 'mr-4' : ''
                }`}
              />
            ))}
          </div>

          {/* Peek indicator for more content */}
          {canScrollRight && (
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gradient-to-l from-white via-white to-transparent w-8 h-full pointer-events-none" />
          )}
        </div>
      </div>

      {/* CSS to hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}