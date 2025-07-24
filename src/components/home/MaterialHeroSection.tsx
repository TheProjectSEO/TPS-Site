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
  secondary_button_text?: string
  secondary_button_link?: string
  background_image?: string
  enabled: boolean
}

interface HeroSectionProps {
  overrideData?: Partial<HeroContent>
}

export function MaterialHeroSection({ overrideData }: HeroSectionProps = {}) {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: 'Eiffel Tower Tickets 2025',
    subtitle: 'Skip the Line • Save Time • Guaranteed Entry',
    description: 'Book official Eiffel Tower tickets with instant confirmation. Skip the 2+ hour queues and enjoy priority access to Paris\' most visited monument. Summit access, guided tours, and evening light shows available.',
    button_text: 'BOOK TICKETS NOW',
    button_link: '/tours?category=eiffel-tower',
    secondary_button_text: 'VIEW ALL EXPERIENCES',
    secondary_button_link: '/tours',
    background_image: '/images/eiffel-tower.webp',
    enabled: true
  })

  useEffect(() => {
    if (overrideData) {
      setHeroContent(prev => ({
        ...prev,
        ...overrideData
      }))
    } else {
      fetchHeroContent()
    }
  }, [overrideData])

  const fetchHeroContent = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('homepage_unified')
        .select('hero_title, hero_subtitle, hero_description, hero_button_text, hero_button_link, hero_background_image, hero_enabled')
        .single()

      if (data && !error) {
        setHeroContent(prev => ({
          ...prev,
          title: data.hero_title || prev.title,
          subtitle: data.hero_subtitle || prev.subtitle,
          description: data.hero_description || prev.description,
          button_text: data.hero_button_text || prev.button_text,
          button_link: data.hero_button_link || prev.button_link,
          background_image: data.hero_background_image || prev.background_image,
          enabled: data.hero_enabled !== false
        }))
      }
    } catch (error) {
      console.error('Error fetching hero content:', error)
    }
  }

  if (!heroContent.enabled) {
    return null
  }

  return (
    <section className="relative h-screen bg-white pt-16 overflow-hidden">
      {/* Background Image with Overlay - Optimized for LCP */}
      <div className="absolute inset-0">
        <img
          src={heroContent.background_image || '/images/eiffel-tower.webp'}
          alt="Eiffel Tower - Paris Tours"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />
        {/* Minimal Overlay - only for right side */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/20" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-[calc(100vh-12rem)]">
          {/* Left Content - 45% width */}
          <div className="space-y-8 lg:space-y-6 max-w-lg bg-white/75 backdrop-blur-md rounded-2xl p-6 lg:p-8 shadow-2xl border border-white/30">
            {/* Hero Headings */}
            <div className="space-y-1">
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black leading-none tracking-tight"
                style={{ 
                  fontSize: 'clamp(36px, 5vw, 54px)',
                  lineHeight: '0.95',
                  letterSpacing: '-0.02em',
                  marginBottom: '4px'
                }}
              >
                {heroContent.title}
              </h1>
              <h2 
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-black leading-tight"
                style={{ 
                  fontSize: 'clamp(28px, 4vw, 36px)',
                  lineHeight: '1.1',
                  marginBottom: '12px'
                }}
              >
                {heroContent.subtitle}
              </h2>
            </div>
            
            {/* Description */}
            <p 
              className="text-lg text-gray-700 leading-relaxed"
              style={{ 
                fontSize: '18px',
                lineHeight: '1.5',
                color: '#333333',
                marginBottom: '32px'
              }}
            >
              {heroContent.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                asChild
                className="bg-black text-white hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-300 text-sm font-semibold uppercase px-7 py-4 rounded shadow-md"
                style={{ 
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                <Link href={heroContent.button_link}>
                  {heroContent.button_text}
                </Link>
              </Button>
              <Button 
                variant="outline"
                size="lg"
                asChild
                className="border-black text-black hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 text-sm font-semibold uppercase px-7 py-4 rounded"
                style={{ 
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                <Link href={heroContent.secondary_button_link || '/tours'}>
                  {heroContent.secondary_button_text || 'VIEW ALL TOURS'}
                </Link>
              </Button>
            </div>

            {/* Metrics Section */}
            <div className="pt-16">
              <div className="grid grid-cols-3 gap-16">
                <div className="text-left">
                  <div 
                    className="text-3xl lg:text-4xl font-bold text-black leading-none mb-2"
                    style={{ 
                      fontSize: '36px',
                      fontWeight: '700',
                      lineHeight: '1'
                    }}
                  >
                    1M+
                  </div>
                  <div 
                    className="text-base font-normal text-gray-600"
                    style={{ 
                      fontSize: '16px',
                      fontWeight: '400',
                      color: '#555555'
                    }}
                  >
                    Visitors annually
                  </div>
                </div>
                <div className="text-left">
                  <div 
                    className="text-3xl lg:text-4xl font-bold text-black leading-none mb-2"
                    style={{ 
                      fontSize: '36px',
                      fontWeight: '700',
                      lineHeight: '1'
                    }}
                  >
                    95+
                  </div>
                  <div 
                    className="text-base font-normal text-gray-600"
                    style={{ 
                      fontSize: '16px',
                      fontWeight: '400',
                      color: '#555555'
                    }}
                  >
                    Attractions included
                  </div>
                </div>
                <div className="text-left">
                  <div 
                    className="text-3xl lg:text-4xl font-bold text-black leading-none mb-2"
                    style={{ 
                      fontSize: '36px',
                      fontWeight: '700',
                      lineHeight: '1'
                    }}
                  >
                    €145
                  </div>
                  <div 
                    className="text-base font-normal text-gray-600"
                    style={{ 
                      fontSize: '16px',
                      fontWeight: '400',
                      color: '#555555'
                    }}
                  >
                    Average savings
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image area (55% width) */}
          <div className="relative lg:block hidden">
            {/* This space is for the background image which covers the entire section */}
            <div className="w-full h-96 lg:h-full min-h-[700px] relative">
              {/* Feature Card 1 - Skip-the-Line Access */}
              <div 
                className="absolute top-12 left-8 p-5 rounded-xl shadow-xl max-w-60 transform rotate-2 hover:rotate-0 hover:scale-110 transition-all duration-500 ease-out cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(0deg) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotate(2deg) scale(1)';
                }}
              >
                <div className="space-y-2 text-white">
                  <h3 className="font-bold text-white text-sm">Skip 2+ Hour Lines</h3>
                  <p className="text-xs text-white/80">Fast-track entry • Save hours</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="text-xs text-white/70">From</span>
                    <span className="font-bold text-white">€25.50</span>
                  </div>
                </div>
              </div>

              {/* Feature Card 2 - Summit Access */}
              <div 
                className="absolute top-24 right-12 p-5 rounded-xl shadow-xl max-w-60 transform -rotate-1 hover:rotate-0 hover:scale-110 transition-all duration-500 ease-out cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(0deg) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotate(-1deg) scale(1)';
                }}
              >
                <div className="space-y-2 text-white">
                  <h3 className="font-bold text-white text-sm">Summit Access</h3>
                  <p className="text-xs text-white/80">276m high • Best views of Paris</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="text-xs text-white/70">From</span>
                    <span className="font-bold text-white">€49.90</span>
                  </div>
                </div>
              </div>

              {/* Feature Card 3 - Evening Tours */}
              <div 
                className="absolute top-96 right-4 p-5 rounded-xl shadow-xl max-w-60 transform rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-500 ease-out cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(0deg) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotate(3deg) scale(1)';
                }}
              >
                <div className="space-y-2 text-white">
                  <h3 className="font-bold text-white text-sm">Evening Light Show</h3>
                  <p className="text-xs text-white/80">Golden hour • Sparkling lights</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="text-xs text-white/70">From</span>
                    <span className="font-bold text-white">€35.00</span>
                  </div>
                </div>
              </div>

              {/* Feature Card 4 - Guided Tours */}
              <div 
                className="absolute bottom-16 left-4 p-5 rounded-xl shadow-xl max-w-60 transform -rotate-2 hover:rotate-0 hover:scale-110 transition-all duration-500 ease-out cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(0deg) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotate(-2deg) scale(1)';
                }}
              >
                <div className="space-y-2 text-white">
                  <h3 className="font-bold text-white text-sm">Guided Experience</h3>
                  <p className="text-xs text-white/80">Expert guide • Skip lines</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="text-xs text-white/70">From</span>
                    <span className="font-bold text-white">€42.00</span>
                  </div>
                </div>
              </div>

              {/* Feature Card 5 - Champagne Experience */}
              <div 
                className="absolute top-60 left-16 p-5 rounded-xl shadow-xl max-w-60 transform rotate-1 hover:rotate-0 hover:scale-110 transition-all duration-500 ease-out cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(0deg) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotate(1deg) scale(1)';
                }}
              >
                <div className="space-y-2 text-white">
                  <h3 className="font-bold text-white text-sm">VIP Experience</h3>
                  <p className="text-xs text-white/80">Premium access • Luxury</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="text-xs text-white/70">From</span>
                    <span className="font-bold text-white">€85.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Image Section */}
      <div className="lg:hidden relative h-96 bg-gray-200 overflow-hidden">
        <img
          src={heroContent.background_image || '/images/eiffel-tower.webp'}
          alt="Eiffel Tower - Paris Tours"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Mobile Feature Cards */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* Top Card */}
          <div className="self-end max-w-48">
            <div 
              className="p-4 rounded-xl shadow-lg transform rotate-2"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <div className="text-white space-y-1">
                <h3 className="font-bold text-sm">Skip 2+ Hour Lines</h3>
                <p className="text-xs text-white/80">Fast-track entry</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/20">
                  <span className="text-xs text-white/70">From</span>
                  <span className="font-bold">€25.50</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Card */}
          <div className="self-start max-w-48">
            <div 
              className="p-4 rounded-xl shadow-lg transform -rotate-1"
              style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              }}
            >
              <div className="text-white space-y-1">
                <h3 className="font-bold text-sm">Evening Light Show</h3>
                <p className="text-xs text-white/80">Golden hour • Sparkling lights</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/20">
                  <span className="text-xs text-white/70">From</span>
                  <span className="font-bold">€35.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}