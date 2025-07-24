'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'

interface Testimonial {
  id: string
  customer_name: string
  customer_location: string
  customer_avatar: string
  rating: number
  review_text: string
  experience_name: string
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      // Fetch testimonials
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('*')
        .eq('featured', true)
        .order('sort_order')
        .limit(6)

      if (testimonialsData) setTestimonials(testimonialsData)
      setLoading(false)
    }

    fetchData()
  }, [])

  const nextSlide = () => {
    if (currentSlide < testimonials.length - 1) {
      setCurrentSlide(currentSlide + 1)
      scrollToSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
      scrollToSlide(currentSlide - 1)
    }
  }

  const scrollToSlide = (slideIndex: number) => {
    if (scrollContainerRef.current) {
      const slideWidth = scrollContainerRef.current.clientWidth * 0.85 // 85% width + gap
      scrollContainerRef.current.scrollTo({
        left: slideIndex * slideWidth,
        behavior: 'smooth'
      })
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading testimonials...</div>
        </div>
      </section>
    )
  }
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-3 md:mb-4">
            Loved by travelers worldwide
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Join millions of happy travelers who trust Cuddly Nest for their best experiences
          </p>
          <div className="flex items-center justify-center mt-4 md:mt-6 space-x-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-base md:text-lg font-semibold">4.8</span>
            <span className="text-sm md:text-base text-gray-600">based on 50,000+ reviews</span>
          </div>
        </div>

        {/* Desktop Grid - Hidden on Mobile */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className={`hover:shadow-lg transition-all duration-300 ${
                index === 2 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Quote className="h-8 w-8 text-primary opacity-50" />
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.review_text}"
                </p>
                
                <div className="flex items-center space-x-3">
                  <Image
                    src={testimonial.customer_avatar}
                    alt={testimonial.customer_name}
                    width={48}
                    height={48}
                    className="rounded-full"
                    loading="lazy"
                    sizes="48px"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.customer_name}</p>
                    <p className="text-sm text-gray-600">{testimonial.customer_location}</p>
                    <p className="text-xs text-primary font-medium mt-1">
                      {testimonial.experience_name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Carousel - Visible only on Mobile */}
        <div className="md:hidden">
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={testimonial.id}
                  className="flex-none w-[85vw] max-w-sm snap-center shadow-lg"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Quote className="h-6 w-6 text-primary opacity-50" />
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= testimonial.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                      "{testimonial.review_text}"
                    </p>
                    
                    <div className="flex items-center space-x-3">
                      <Image
                        src={testimonial.customer_avatar}
                        alt={testimonial.customer_name}
                        width={40}
                        height={40}
                        className="rounded-full flex-shrink-0"
                        loading="lazy"
                        sizes="40px"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm truncate">{testimonial.customer_name}</p>
                        <p className="text-xs text-gray-600 truncate">{testimonial.customer_location}</p>
                        <p className="text-xs text-primary font-medium mt-1 truncate">
                          {testimonial.experience_name}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="h-8 w-8 p-0 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentSlide === testimonials.length - 1}
                className="h-8 w-8 p-0 rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-3 space-x-1">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index)
                    scrollToSlide(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}