'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ArrowRight, ExternalLink, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface CustomCTA {
  id: string
  title: string
  subtitle?: string
  description: string
  button_text: string
  button_link: string
  button_icon?: 'chevron-right' | 'arrow-right' | 'external-link' | 'star'
  gradient_type: 'primary' | 'secondary' | 'accent' | 'sunset' | 'ocean' | 'forest' | 'royal' | 'fire'
  layout: 'horizontal' | 'vertical'
  position: 'middle' | 'bottom'
  enabled: boolean
}

interface CustomCTASectionProps {
  cta: CustomCTA
  className?: string
}

const gradientClasses = {
  primary: 'bg-gradient-to-r from-purple-600 to-pink-600',
  secondary: 'bg-gradient-to-r from-green-600 to-purple-800',
  accent: 'bg-gradient-to-r from-purple-800 to-purple-600',
  sunset: 'bg-gradient-to-r from-orange-500 to-red-600',
  ocean: 'bg-gradient-to-r from-blue-500 to-cyan-600',
  forest: 'bg-gradient-to-r from-green-500 to-emerald-600',
  royal: 'bg-gradient-to-r from-indigo-600 to-purple-600',
  fire: 'bg-gradient-to-r from-red-500 to-orange-600'
}

const iconComponents = {
  'chevron-right': ChevronRight,
  'arrow-right': ArrowRight,
  'external-link': ExternalLink,
  'star': Star
}

export function CustomCTASection({ cta, className = '' }: CustomCTASectionProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (!cta.enabled) {
    return null
  }

  const IconComponent = cta.button_icon ? iconComponents[cta.button_icon] : ChevronRight

  if (cta.layout === 'horizontal') {
    return (
      <div className={`relative overflow-hidden rounded-2xl shadow-2xl ${className}`}>
        <div className={`${gradientClasses[cta.gradient_type]} p-8 md:p-12`}>
          <div className="relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {cta.title}
                  </h3>
                  {cta.subtitle && (
                    <p className="text-xl text-white/90 mb-4 font-medium">
                      {cta.subtitle}
                    </p>
                  )}
                  <p className="text-lg text-white/80 leading-relaxed font-medium">
                    {cta.description}
                  </p>
                </div>
                <div className="flex justify-start lg:justify-end">
                  <Link href={cta.button_link}>
                    <Button
                      size="lg"
                      className="bg-white/10 text-white border-2 border-white/20 hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl group"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      {cta.button_text}
                      <IconComponent className={`h-5 w-5 ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </div>
    )
  }

  // Vertical layout
  return (
    <Card className={`overflow-hidden shadow-2xl ${className}`}>
      <CardContent className="p-0">
        <div className={`${gradientClasses[cta.gradient_type]} p-8 md:p-12 text-center relative`}>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {cta.title}
            </h3>
            {cta.subtitle && (
              <p className="text-xl text-white/90 mb-6 font-medium">
                {cta.subtitle}
              </p>
            )}
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
              {cta.description}
            </p>
            <Link href={cta.button_link}>
              <Button
                size="lg"
                className="bg-white/10 text-white border-2 border-white/20 hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {cta.button_text}
                <IconComponent className={`h-5 w-5 ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </Button>
            </Link>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </CardContent>
    </Card>
  )
}

// Component for rendering multiple CTAs
interface CTAManagerProps {
  ctas: CustomCTA[]
  position: 'middle' | 'bottom'
}

export function CTAManager({ ctas, position }: CTAManagerProps) {
  const filteredCTAs = ctas.filter(cta => cta.position === position && cta.enabled)

  if (filteredCTAs.length === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      {filteredCTAs.map((cta, index) => (
        <CustomCTASection
          key={cta.id}
          cta={cta}
          className={index > 0 ? 'mt-8' : ''}
        />
      ))}
    </div>
  )
}

// CMS Preview Component for Admin
interface CTAPreviewProps {
  cta: CustomCTA
  onEdit?: (cta: CustomCTA) => void
  onDelete?: (id: string) => void
}

export function CTAPreview({ cta, onEdit, onDelete }: CTAPreviewProps) {
  return (
    <div className="relative">
      <CustomCTASection cta={cta} />
      
      {/* Admin Controls */}
      <div className="absolute top-4 right-4 space-x-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onEdit?.(cta)}
          className="bg-white/90 text-gray-900 hover:bg-white"
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete?.(cta.id)}
          className="bg-red-500/90 text-white hover:bg-red-500"
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

// Default CTA configurations for CMS
export const defaultCTAConfigs: Partial<CustomCTA>[] = [
  {
    title: "Ready to Start Your Adventure?",
    subtitle: "Book your perfect experience today",
    description: "Don't miss out on the incredible experiences waiting for you. Browse our curated selection of tours and activities.",
    button_text: "Explore Tours",
    button_link: "/tours",
    button_icon: "chevron-right",
    gradient_type: "primary",
    layout: "horizontal",
    position: "middle"
  },
  {
    title: "Get Travel Tips & Insider Guides",
    description: "Join thousands of travelers who get our exclusive destination guides, insider tips, and special offers delivered to their inbox.",
    button_text: "Subscribe Now",
    button_link: "/newsletter",
    button_icon: "arrow-right",
    gradient_type: "ocean",
    layout: "vertical",
    position: "bottom"
  },
  {
    title: "Planning Your Perfect Trip?",
    subtitle: "Let our experts help you",
    description: "Get personalized recommendations and insider tips from our travel experts to make your journey unforgettable.",
    button_text: "Get Free Consultation",
    button_link: "/contact",
    button_icon: "external-link",
    gradient_type: "sunset",
    layout: "horizontal",
    position: "middle"
  }
]