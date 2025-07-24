'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'

interface HeroContent {
  title: string
  subtitle: string
  description: string
  button_text: string
  button_link: string
  background_image?: string
  background_video?: string
  enabled: boolean
}

interface ActionArea {
  id: string
  title: string
  description: string
  link: string
  icon: string
}

interface HeroSectionProps {
  overrideData?: Partial<HeroContent>
}

export function HeroSection({ overrideData }: HeroSectionProps = {}) {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: 'Eiffel Tower Tickets',
    subtitle: 'Skip the Line & Save Time',
    description: 'Book your Eiffel Tower tickets online and enjoy priority access to Paris\' most iconic landmark',
    button_text: 'Book Tickets Now',
    button_link: '/tours?category=eiffel-tower',
    background_image: '/images/eiffel_tower_tickets_.webp',
    enabled: true
  })

  const [actionAreas] = useState<ActionArea[]>([
    {
      id: '1',
      title: 'Skip-the-Line Tickets',
      description: 'Fast track entry',
      link: '/tour/eiffel-tower-skip-line-tickets',
      icon: '🎫'
    },
    {
      id: '2', 
      title: 'Summit Access',
      description: 'Top floor views',
      link: '/tour/eiffel-tower-summit-access',
      icon: '🗼'
    },
    {
      id: '3',
      title: 'Guided Tours',
      description: 'Expert insights',
      link: '/tour/eiffel-tower-guided-tour',
      icon: '👥'
    },
    {
      id: '4',
      title: 'Evening Tickets',
      description: 'Illuminated tower',
      link: '/tour/eiffel-tower-evening-tickets',
      icon: '🌃'
    }
  ])

  useEffect(() => {
    if (overrideData) {
      // Use override data instead of fetching from database
      setHeroContent(prev => ({
        ...prev,
        ...overrideData
      }))
    } else {
      // Fetch from database as usual
      fetchHeroContent()
    }
  }, [overrideData])

  const fetchHeroContent = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('homepage_hero')
        .select('*')
        .limit(1)
        .maybeSingle()

      if (data && !error) {
        setHeroContent(prev => ({
          ...prev,
          title: data.title || prev.title,
          subtitle: data.subtitle || prev.subtitle,
          background_image: data.image || prev.background_image,
        }))
      }
    } catch (error) {
      console.error('Error fetching hero content:', error)
      // Keep default content if fetch fails
    }
  }

  if (!heroContent.enabled) {
    return null
  }

  return (
    <section className="relative h-[85vh] overflow-hidden">
      {/* Background with Brand Gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroContent.background_image})`,
        }}
      >
        {/* Brand Gradient Overlay */}
        <div className="absolute inset-0 hero-gradient opacity-90" />
      </div>
      
      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-center">
        {/* Hero Content */}
        <div className="flex-1 flex items-start px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-white max-w-6xl mx-auto">
            <div className="max-w-4xl mt-16 lg:mt-24 mr-auto lg:mr-96">
              
              <h1 className="hero-text text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                <span className="block">{heroContent.title}</span>
                {heroContent.subtitle && (
                  <span className="block text-3xl md:text-4xl lg:text-5xl font-semibold mt-2 text-white/90">
                    {heroContent.subtitle}
                  </span>
                )}
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl font-medium leading-relaxed">
                {heroContent.description}
              </p>
              
              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 mb-12">
                <div className="text-center md:text-left">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2">
                    1M
                  </div>
                  <div className="text-sm md:text-base text-white/80 font-medium">
                    passes purchased
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2">
                    95+
                  </div>
                  <div className="text-sm md:text-base text-white/80 font-medium">
                    attractions included
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2">
                    €145
                  </div>
                  <div className="text-sm md:text-base text-white/80 font-medium">
                    potential savings per trip
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={heroContent.button_link}>
                  <Button 
                    size="xl" 
                    className="w-full sm:w-auto min-w-[200px]"
                  >
                    Buy now
                  </Button>
                </Link>
                <Link href="/tours">
                  <Button 
                    size="xl" 
                    variant="outline"
                    className="w-full sm:w-auto min-w-[200px] border-white text-white hover:bg-white hover:text-primary"
                  >
                    View all attractions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* USP Section - Separate from hero */}
      <div className="section-gradient-light py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* USP 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-brand-sm">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">Skip the Lines</h3>
              <p className="text-sm text-gray-700 font-medium">Priority access with instant mobile tickets - no waiting in queues</p>
            </div>
            
            {/* USP 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-brand-sm">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-secondary">Best Price Guarantee</h3>
              <p className="text-sm text-gray-700 font-medium">Lowest prices online with free cancellation up to 24 hours</p>
            </div>
            
            {/* USP 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-brand-sm">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-accent">Instant Confirmation</h3>
              <p className="text-sm text-gray-700 font-medium">Mobile tickets delivered instantly - book now, visit today</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}