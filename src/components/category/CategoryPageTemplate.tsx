'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, Check, X, MapPin, Users, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ReviewsSection } from '@/components/reviews/ReviewsSection'

interface CategoryPageData {
  id: string
  category_slug: string
  category_name: string
  product_id: string
  hero_title: string
  hero_subtitle: string
  hero_rating: number
  hero_rating_count: number
  hero_from_price: number
  hero_currency: string
  hero_badges: string[]
  hero_benefit_bullets: string[]
  hero_image_url: string
  hero_primary_cta_label: string
  primary_ticket_list_heading: string
  primary_ticket_list_enabled: boolean
  primary_ticket_list_experience_ids: string[]
  category_tags: string[]
  destination_upsell_heading: string
  destination_upsell_enabled: boolean
  seo_intro_heading: string
  seo_intro_content: string
  things_to_know_heading: string
  things_to_know_items: any[]
  snapshot_guide_heading: string
  snapshot_guide_col1_heading: string
  snapshot_guide_col1_content: string
  snapshot_guide_col2_heading: string
  snapshot_guide_col2_content: string
  snapshot_guide_col3_heading: string
  snapshot_guide_col3_content: string
  ticket_scope_heading: string
  ticket_scope_inclusions: any[]
  ticket_scope_exclusions: any[]
  ticket_scope_notes: string
  photo_gallery_heading: string
  photo_gallery_images: any[]
  onsite_experiences_heading: string
  onsite_experiences_items: any[]
  reviews_heading: string
  reviews_avg_rating: number
  reviews_total_count: number
  reviews_distribution: any
  faq_heading: string
  faq_items: any[]
  related_content_heading: string
  related_content_items: any[]
  seo_tags: string[]
}

interface Experience {
  id: string
  title: string
  slug: string
  description: string
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

interface UpsellItem {
  id: string
  title: string
  teaser: string
  image_url: string
  price_from: number
  rating: number
  link_url: string
  link_type: string
}

interface Review {
  id: string
  reviewer_name: string
  reviewer_location: string
  reviewer_avatar_url?: string
  rating: number
  title: string
  review_text: string
  review_images: string[]
  visit_date: string
  verified_purchase: boolean
  is_featured: boolean
  helpful_count: number
}

interface CategoryPageTemplateProps {
  categoryData: CategoryPageData
  upsellItems: UpsellItem[]
  selectedExperiences: Experience[]
  reviews: Review[]
}

export function CategoryPageTemplate({ categoryData, upsellItems, selectedExperiences, reviews }: CategoryPageTemplateProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const scrollToTickets = () => {
    document.getElementById('tickets-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImageIndex(null)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* S1 Category Hero Block */}
      <section className="relative bg-white py-12 lg:py-20 overflow-hidden">
        {/* Brand gradient background */}
        <div className="absolute inset-0 hero-gradient opacity-10" />
        <div className="max-w-7xl mx-auto px-4 lg:px-12 relative">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Media - 7 cols desktop */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-brand-lg">
                {categoryData.hero_image_url ? (
                  <Image
                    src={categoryData.hero_image_url}
                    alt={categoryData.hero_title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-lg">No image available</span>
                  </div>
                )}
                {/* Subtle brand overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </div>
            
            {/* Content - 5 cols desktop */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <h1 className="hero-text text-3xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
                {categoryData.hero_title}
              </h1>
              
              <p className="text-lg lg:text-xl text-secondary mb-6 leading-relaxed font-medium">
                {categoryData.hero_subtitle}
              </p>
              
              {/* Rating & Price */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(categoryData.hero_rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {categoryData.hero_rating} ({categoryData.hero_rating_count.toLocaleString()} reviews)
                  </span>
                </div>
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categoryData.hero_badges?.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="bg-gradient-to-r from-primary/10 to-highlight/10 text-primary border-primary/20 hover:from-primary/20 hover:to-highlight/20 cursor-default font-medium">
                    {badge}
                  </Badge>
                ))}
              </div>
              
              {/* Benefits */}
              <div className="space-y-3 mb-8">
                {categoryData.hero_benefit_bullets?.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              
              {/* Price & CTA */}
              <div className="space-y-4">
                {categoryData.hero_from_price && (
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-600 font-medium">From</span>
                    <span className="text-2xl font-bold text-primary">{categoryData.hero_currency}{categoryData.hero_from_price}</span>
                    <span className="text-sm text-gray-600 font-medium">per person</span>
                  </div>
                )}
                <Button 
                  onClick={scrollToTickets}
                  size="lg" 
                  className="w-full lg:w-auto px-8 py-4 text-lg"
                >
                  {categoryData.hero_primary_cta_label}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S2 Primary Ticket List */}
      {categoryData.primary_ticket_list_enabled && (
        <section id="tickets-section" className="bg-white py-12 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                {categoryData.primary_ticket_list_heading}
              </h2>
              <p className="text-lg text-secondary font-medium">
                Choose from our curated selection of {categoryData.category_name.toLowerCase()} experiences
              </p>
            </div>
            
            {selectedExperiences.length > 0 ? (
              <div className="space-y-12">
                {selectedExperiences.map((experience) => (
                  <Link key={experience.id} href={`/tour/${experience.slug}`}>
                    <Card className="card-brand group cursor-pointer overflow-hidden mb-8">
                      <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                          {/* Image Section - Left side on desktop */}
                          <div className="relative lg:w-80 h-64 lg:h-48 overflow-hidden flex-shrink-0">
                            {experience.main_image_url ? (
                              <Image
                                src={experience.main_image_url}
                                alt={experience.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">No image</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Content Section - Right side on desktop */}
                          <div className="flex-1 p-6 flex flex-col lg:flex-row lg:justify-between">
                            {/* Left content */}
                            <div className="flex-1 lg:pr-8">
                              {/* Category and Rating */}
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                  TICKETS
                                </span>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 fill-pink-500 text-pink-500 mr-1" />
                                  <span className="text-sm font-bold text-gray-900">{experience.rating}</span>
                                  <span className="text-sm text-gray-500 ml-1">({experience.review_count})</span>
                                </div>
                              </div>
                              
                              {/* Title */}
                              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                                {experience.title}
                              </h3>
                              
                              {/* Description */}
                              <p className="text-gray-600 mb-4 line-clamp-2 lg:line-clamp-3">
                                {experience.short_description}
                              </p>
                              
                              {/* Features */}
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-500 mr-1" />
                                  <span>Instant confirmation</span>
                                </div>
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-500 mr-1" />
                                  <span>Mobile ticket</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-green-500 mr-1" />
                                  <span>Flexible duration</span>
                                </div>
                              </div>
                              
                              {/* Additional info */}
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{experience.cities?.name || 'Paris'}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{experience.duration}</span>
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  <span>Up to {experience.max_group_size}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Right content - Pricing */}
                            <div className="flex flex-col justify-between items-end mt-4 lg:mt-0 lg:w-48">
                              {/* Original price struck through */}
                              <div className="text-right mb-2">
                                <div className="text-sm text-gray-500">from</div>
                                <div className="text-sm text-gray-400 line-through">AED 95</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-gray-900">AED {experience.price}</span>
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    37% off
                                  </Badge>
                                </div>
                              </div>
                              
                              {/* Check availability button */}
                              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3">
                                Check availability
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">No experiences selected for this category</p>
                <Link href={`/tours?category=${categoryData.category_slug}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Browse All {categoryData.category_name} Tours
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* S4 Destination Upsell Carousel */}
      {categoryData.destination_upsell_enabled && upsellItems.length > 0 && (
        <section className="bg-orange-50 py-12 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {categoryData.destination_upsell_heading}
              </h2>
              <p className="text-lg text-gray-600">
                Discover more amazing experiences while you're in the City of Light
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upsellItems.map((item) => (
                <Link key={item.id} href={item.link_url}>
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-white/90 text-gray-900">
                            From €{item.price_from}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.teaser}
                        </p>
                        {item.rating && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{item.rating}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* S5 SEO Intro Content Block */}
      <section className="bg-orange-50 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
            {categoryData.seo_intro_heading}
          </h2>
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: categoryData.seo_intro_content }}
          />
        </div>
      </section>

      {/* S6 Things To Know */}
      <section className="bg-orange-50 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">
            {categoryData.things_to_know_heading}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryData.things_to_know_items?.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">{item.icon === 'clock' ? '🕐' : item.icon === 'mobile' ? '📱' : item.icon === 'cancel' ? '❌' : item.icon === 'wheelchair' ? '♿' : item.icon === 'bag' ? '🎒' : '📷'}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.label}</h3>
                    <p className="text-sm text-gray-600">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S7 3-Column Snapshot Guide */}
      <section className="bg-orange-50 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-12 text-center">
            {categoryData.snapshot_guide_heading}
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {categoryData.snapshot_guide_col1_heading}
              </h3>
              <div 
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: categoryData.snapshot_guide_col1_content }}
              />
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {categoryData.snapshot_guide_col2_heading}
              </h3>
              <div 
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: categoryData.snapshot_guide_col2_content }}
              />
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {categoryData.snapshot_guide_col3_heading}
              </h3>
              <div 
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: categoryData.snapshot_guide_col3_content }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* S8 Ticket Scope / Inclusions vs Exclusions */}
      <section className="bg-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-12 text-center">
            {categoryData.ticket_scope_heading}
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Inclusions */}
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
                <Check className="w-6 h-6 mr-2" />
                What's Included
              </h3>
              <div className="space-y-4">
                {categoryData.ticket_scope_inclusions?.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Exclusions */}
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center">
                <X className="w-6 h-6 mr-2" />
                What's Not Included
              </h3>
              <div className="space-y-4">
                {categoryData.ticket_scope_exclusions?.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {categoryData.ticket_scope_notes && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{categoryData.ticket_scope_notes}</p>
            </div>
          )}
        </div>
      </section>

      {/* S9 Photo Highlights Gallery */}
      <section className="bg-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
            {categoryData.photo_gallery_heading}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryData.photo_gallery_images?.map((image, index) => (
              <div 
                key={index} 
                className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S10 On-Site Experiences */}
      <section className="bg-purple-50 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-12 text-center">
            {categoryData.onsite_experiences_heading}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {categoryData.onsite_experiences_items?.map((experience, index) => (
              <Link key={index} href={experience.link_url || '#'}>
                <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-0">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {experience.image_url ? (
                        <Image
                          src={experience.image_url}
                          alt={experience.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {experience.title}
                      </h3>
                      <p className="text-gray-600">
                        {experience.teaser}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* S11 Review Summary */}
      <ReviewsSection
        pageType="category"
        pageId={categoryData.id}
        productId={categoryData.product_id}
        title="Customer Reviews"
        showRatingSummary={true}
        className="bg-purple-50 py-12 lg:py-20"
      />

      {/* S12 FAQ Accordion */}
      <section className="bg-white py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-12 text-center">
            {categoryData.faq_heading}
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            {categoryData.faq_items?.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* S13 Related Content */}
      <section className="bg-white py-8 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-12 text-center">
            {categoryData.related_content_heading}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {categoryData.related_content_items?.map((article, index) => (
              <Link key={index} href={article.url}>
                <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      {article.image_url ? (
                        <Image
                          src={article.image_url}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{article.read_time} read</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="relative">
              <Image
                src={categoryData.photo_gallery_images[selectedImageIndex].url}
                alt={categoryData.photo_gallery_images[selectedImageIndex].alt}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />
              
              {categoryData.photo_gallery_images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : categoryData.photo_gallery_images.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  
                  <button
                    onClick={() => setSelectedImageIndex(selectedImageIndex < categoryData.photo_gallery_images.length - 1 ? selectedImageIndex + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>
            
            {categoryData.photo_gallery_images[selectedImageIndex].caption && (
              <p className="text-white text-center mt-4">
                {categoryData.photo_gallery_images[selectedImageIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}