'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Smartphone,
  Star,
  ShipWheelIcon as Wheelchair,
  CheckCircle,
  Zap,
  Globe,
  Heart,
  Train,
  Bus,
  FootprintsIcon as Walking,
  Play,
  Camera,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { StructuredData } from '@/components/seo/StructuredData'

interface HomepageData {
  id: string
  // Hero Section
  hero_main_title: string
  hero_tagline: string
  hero_cta_text: string
  hero_cta_link: string
  hero_background_image: string | null
  hero_enabled: boolean
  
  // Why Choose Us Section
  why_choose_us_enabled: boolean
  why_choose_us_title: string
  why_choose_us_description: string
  feature_1_title: string
  feature_1_description: string
  feature_1_color: string
  feature_2_title: string
  feature_2_description: string
  feature_2_color: string
  feature_3_title: string
  feature_3_description: string
  feature_3_color: string
  
  // Top Tickets Section
  top_tickets_enabled: boolean
  top_tickets_title: string
  top_tickets_subtitle: string
  
  // Reviews Section
  reviews_enabled: boolean
  reviews_title: string
  reviews_overall_rating: number
  reviews_total_count: number
  
  // Complete Guide Section
  guide_enabled: boolean
  guide_title: string
  guide_subtitle: string
  
  // Things to Do Section
  things_todo_enabled: boolean
  things_todo_title: string
  things_todo_subtitle: string
  
  // Transportation Section
  transport_enabled: boolean
  transport_title: string
  transport_subtitle: string
  
  // History Section
  history_enabled: boolean
  history_title: string
  history_subtitle: string
  
  // Why Visit Section
  why_visit_enabled: boolean
  why_visit_title: string
  why_visit_description: string
  
  // Photography Section
  photography_enabled: boolean
  photography_title: string
  photography_subtitle: string
  
  // Dining Section
  dining_enabled: boolean
  dining_title: string
  dining_subtitle: string
  
  // Floor Details Section
  floors_enabled: boolean
  floors_title: string
  floors_subtitle: string
  
  // FAQs Section
  homepage_faqs_enabled: boolean
  homepage_faqs_title: string
  homepage_faqs_subtitle: string
  
  // Local Area Section
  local_area_enabled: boolean
  local_area_title: string
  local_area_subtitle: string
  
  // Schema and SEO
  schema_mode: 'default' | 'custom'
  custom_schema: any
  seo_keywords?: string
}

interface Experience {
  id: string
  title: string
  slug: string
  short_description: string
  price: number
  main_image_url: string
  rating: number
  review_count: number
}

interface Review {
  id: string
  name: string
  initials: string
  rating: number
  content: string
  source: string
  color: string
}

export function NewUnifiedHomepage() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null)
  const [selectedExperiences, setSelectedExperiences] = useState<Experience[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomepageData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchHomepageData() {
    try {
      const supabase = createClient()
      
      // Fetch homepage data
      const { data: homepageData, error: homepageError } = await supabase
        .from('homepage_unified')
        .select('*')
        .limit(1)

      if (homepageError || !homepageData || homepageData.length === 0) {
        console.error('Error fetching homepage data:', homepageError)
        return
      }

      const homepageRecord = homepageData[0]

      // Fetch selected experiences for tickets section
      const { data: experienceSelections, error: expError } = await supabase
        .from('homepage_experience_selections')
        .select(`
          experience_id,
          experiences!inner (
            id, title, slug, short_description, price, main_image_url, rating, review_count
          )
        `)
        .eq('is_active', true)
        .order('display_order')
        .limit(4)

      let selectedExps: Experience[] = []
      if (!expError && experienceSelections) {
        selectedExps = experienceSelections.map(sel => sel.experiences as Experience)
      }

      // Fetch testimonials/reviews  
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(5)

      let reviewsData: Review[] = []
      if (!testimonialsError && testimonialsData) {
        reviewsData = testimonialsData.map(t => ({
          id: t.id,
          name: t.name,
          initials: t.name.split(' ').map(n => n[0]).join(''),
          rating: 5, // Default to 5 stars
          content: t.content,
          source: 'Trustpilot', // Default source
          color: getRandomColor()
        }))
      }

      setHomepageData(homepageRecord)
      setSelectedExperiences(selectedExps)
      setReviews(reviewsData)
      
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  function getRandomColor() {
    const colors = ['blue', 'green', 'purple', 'pink', 'orange', 'indigo']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  function getColorClasses(color: string, type: 'bg' | 'text' = 'bg') {
    const colorMap = {
      blue: type === 'bg' ? 'bg-blue-50' : 'text-blue-900',
      green: type === 'bg' ? 'bg-green-50' : 'text-green-900', 
      purple: type === 'bg' ? 'bg-purple-50' : 'text-purple-900',
      pink: type === 'bg' ? 'bg-pink-50' : 'text-pink-900',
      orange: type === 'bg' ? 'bg-orange-50' : 'text-orange-900',
      indigo: type === 'bg' ? 'bg-indigo-50' : 'text-indigo-900'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading homepage...</p>
        </div>
      </div>
    )
  }

  if (!homepageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Homepage not configured</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Single Homepage Schema - Managed in CMS */}
      <StructuredData
        type="WebSite"
        data={{
          title: homepageData.hero_main_title,
          description: homepageData.why_choose_us_description,
          url: process.env.NEXT_PUBLIC_SITE_URL || 'https://tps-site.com',
          name: 'TPS Site',
          keywords: homepageData.seo_keywords
        }}
        customSchema={homepageData.custom_schema}
        schemaMode={homepageData.schema_mode || 'default'}
      />

      {/* Hero Section */}
      {homepageData.hero_enabled && (
        <section className="relative h-screen flex items-center justify-center text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10"></div>
          <Image
            src={homepageData.hero_background_image || "/images/eiffel-tower-tickets.webp"}
            alt="Eiffel Tower at sunset with golden lighting"
            fill
            className="object-cover"
            priority
          />
          <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {homepageData.hero_main_title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-medium">
              {homepageData.hero_tagline}
            </p>
            <Link href={homepageData.hero_cta_link}>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all"
              >
                {homepageData.hero_cta_text}
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      {homepageData.why_choose_us_enabled && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                {homepageData.why_choose_us_title}
              </h2>
              {homepageData.why_choose_us_description && (
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  {homepageData.why_choose_us_description}
                </p>
              )}
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className={`${getColorClasses(homepageData.feature_1_color)} p-6 rounded-lg`}>
                  <h3 className={`text-xl font-semibold ${getColorClasses(homepageData.feature_1_color, 'text')} mb-3`}>
                    {homepageData.feature_1_title}
                  </h3>
                  <p className={getColorClasses(homepageData.feature_1_color, 'text')}>
                    {homepageData.feature_1_description}
                  </p>
                </div>
                <div className={`${getColorClasses(homepageData.feature_2_color)} p-6 rounded-lg`}>
                  <h3 className={`text-xl font-semibold ${getColorClasses(homepageData.feature_2_color, 'text')} mb-3`}>
                    {homepageData.feature_2_title}
                  </h3>
                  <p className={getColorClasses(homepageData.feature_2_color, 'text')}>
                    {homepageData.feature_2_description}
                  </p>
                </div>
                <div className={`${getColorClasses(homepageData.feature_3_color)} p-6 rounded-lg`}>
                  <h3 className={`text-xl font-semibold ${getColorClasses(homepageData.feature_3_color, 'text')} mb-3`}>
                    {homepageData.feature_3_title}
                  </h3>
                  <p className={getColorClasses(homepageData.feature_3_color, 'text')}>
                    {homepageData.feature_3_description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top Eiffel Tower Tickets */}
      {homepageData.top_tickets_enabled && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {homepageData.top_tickets_title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {homepageData.top_tickets_subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {selectedExperiences.map((experience, index) => (
                <Card key={experience.id} className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${index === 0 ? 'border-2 border-blue-100' : ''}`}>
                  {index === 0 && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-green-500 text-white font-semibold px-3 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={experience.main_image_url || "/images/eiffel-tower-tickets.webp"}
                      alt={experience.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {experience.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm">
                      {experience.short_description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{experience.rating || 4.8}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>2h 30m</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Smartphone className="w-3 h-3 mr-1" />
                          Mobile Ticket
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Free Cancellation
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">From €{experience.price}</span>
                        </div>
                      </div>
                      <Link href={`/tour/${experience.slug}`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                          Check Availability
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/tours">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent px-8 py-4"
                >
                  View All Tickets
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trust & Reviews Section */}
      {homepageData.reviews_enabled && reviews.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {homepageData.reviews_title}
              </h2>
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-2xl font-bold text-gray-900">{homepageData.reviews_overall_rating}/5</span>
                <span className="text-gray-600">from {homepageData.reviews_total_count.toLocaleString()} reviews</span>
              </div>
            </div>
            <div className="relative max-w-6xl mx-auto">
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {reviews.map((review) => (
                  <Card key={review.id} className="min-w-[300px] hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br from-${review.color}-500 to-${review.color}-600 rounded-full flex items-center justify-center`}>
                          <span className="font-bold text-white text-lg">{review.initials}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-lg text-gray-900">{review.name}</div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.source}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        "{review.content}"
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Complete Guide Section */}
      {homepageData.guide_enabled && (
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {homepageData.guide_title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {homepageData.guide_subtitle}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Experience Types Explained</h3>
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Premium Access</h4>
                      <p className="text-gray-700 mb-3">
                        The ultimate experience includes access to all levels with priority entry and expert guides.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Skip-the-line access</li>
                        <li>• Professional guide included</li>
                        <li>• Access to exclusive areas</li>
                        <li>• Best panoramic views</li>
                      </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Standard Tickets</h4>
                      <p className="text-gray-700 mb-3">
                        Perfect for most visitors, offering excellent value and comprehensive access to main attractions.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Mobile tickets available</li>
                        <li>• Flexible timing options</li>
                        <li>• Audio guide included</li>
                        <li>• Interactive exhibits access</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Planning Your Visit</h3>
                  <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Best Times to Visit</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-green-800">Early Morning (9:00-11:00 AM)</p>
                          <p className="text-sm text-gray-600">Shortest queues, best lighting for photos</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-orange-800">Golden Hour (1 hour before sunset)</p>
                          <p className="text-sm text-gray-600">Perfect lighting and romantic atmosphere</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-purple-800">Evening (After 6:00 PM)</p>
                          <p className="text-sm text-gray-600">Fewer crowds, magical lighting</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Things to Do Section */}
      {homepageData.things_todo_enabled && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {homepageData.things_todo_title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {homepageData.things_todo_subtitle}
              </p>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide max-w-7xl mx-auto">
              {selectedExperiences.slice(0, 6).map((experience) => (
                <Card key={experience.id} className="min-w-[280px] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={experience.main_image_url || "/images/default-attraction.webp"}
                      alt={experience.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900">{experience.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {experience.short_description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/tour/${experience.slug}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                        Book Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Transportation Section */}
      {homepageData.transport_enabled && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {homepageData.transport_title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {homepageData.transport_subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Train className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Public Transport</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Metro/Bus:</strong> Multiple routes available</p>
                    <p><strong>Travel Cards:</strong> Daily and weekly passes</p>
                    <p><strong>Cost:</strong> €1.90 per journey</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bus className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Tour Buses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Hop-on Hop-off:</strong> Multiple stops</p>
                    <p><strong>Routes:</strong> Red, Blue, Green lines</p>
                    <p><strong>Frequency:</strong> Every 10-15 minutes</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Walking className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Walking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>City Center:</strong> 15-20 minute walk</p>
                    <p><strong>Scenic Routes:</strong> Riverside paths</p>
                    <p><strong>Experience:</strong> Discover hidden gems</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* History Section */}
      {homepageData.history_enabled && (
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {homepageData.history_title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {homepageData.history_subtitle}
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Origins & Design</h3>
                  <p className="text-gray-700 mb-4">
                    Built as a centerpiece for major exhibitions, this iconic landmark represents architectural innovation and engineering excellence of its era.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Innovative engineering design</li>
                    <li>• Historical significance</li>
                    <li>• Architectural masterpiece</li>
                    <li>• Cultural landmark</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Amazing Facts</h3>
                  <p className="text-gray-700 mb-4">
                    This remarkable structure continues to amaze visitors with its impressive statistics and fascinating details that showcase human ingenuity.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Impressive structural specifications</li>
                    <li>• Advanced lighting systems</li>
                    <li>• Weather-resistant design</li>
                    <li>• Most visited attraction globally</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Cultural Impact</h3>
                  <p className="text-gray-700 mb-4">
                    Beyond its architectural significance, this landmark has become a global symbol of romance, innovation, and cultural achievement.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Global cultural icon</li>
                    <li>• Featured in countless films</li>
                    <li>• Symbol of romance and beauty</li>
                    <li>• Inspiration for artists worldwide</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Visit Section */}
      {homepageData.why_visit_enabled && (
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                {homepageData.why_visit_title}
              </h2>
              <p className="text-xl leading-relaxed mb-12">
                {homepageData.why_visit_description}
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Unforgettable Experience</h3>
                  <p className="text-white/90">Create memories that will last a lifetime</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Perfect Photos</h3>
                  <p className="text-white/90">Capture stunning shots from unique angles</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <Globe className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">World Heritage</h3>
                  <p className="text-white/90">Experience globally recognized cultural significance</p>
                </div>
              </div>
              <div className="mt-12">
                <Link href="/tours">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-xl font-semibold rounded-full">
                    Book Your Experience Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Photography Section */}
      {homepageData.photography_enabled && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {homepageData.photography_title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {homepageData.photography_subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-lg">
                <Camera className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Best Photo Spots</h3>
                <p className="text-gray-600 text-sm">Discover the most Instagram-worthy angles and hidden viewpoints</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <Zap className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Golden Hour</h3>
                <p className="text-gray-600 text-sm">Perfect timing for magical lighting and romantic shots</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <CheckCircle className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Pro Tips</h3>
                <p className="text-gray-600 text-sm">Expert photography advice from professional guides</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <Smartphone className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Mobile Friendly</h3>
                <p className="text-gray-600 text-sm">Great shots possible with any camera or smartphone</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dining Section */}
      {homepageData.dining_enabled && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {homepageData.dining_title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {homepageData.dining_subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Dining Options</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-bold text-gray-900">Fine Dining</h4>
                    <p className="text-gray-600 text-sm">Michelin-starred restaurants with panoramic views</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-bold text-gray-900">Casual Dining</h4>
                    <p className="text-gray-600 text-sm">Bistros and cafés with local specialties</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-gray-900">Quick Bites</h4>
                    <p className="text-gray-600 text-sm">Snack bars and food courts for light meals</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Reservation Tips</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <p className="text-gray-600">Book fine dining restaurants in advance</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <p className="text-gray-600">Try local specialties and seasonal menus</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <p className="text-gray-600">Consider combo tickets with dining packages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Floor Details Section */}
      {homepageData.floors_enabled && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {homepageData.floors_title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {homepageData.floors_subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-center text-xl font-bold">Ground Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-gray-600">
                    <p>• Welcome center and information</p>
                    <p>• Gift shops and souvenirs</p>
                    <p>• Ticket collection point</p>
                    <p>• Security and bag check</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-center text-xl font-bold">Main Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-gray-600">
                    <p>• Primary viewing platforms</p>
                    <p>• Interactive exhibitions</p>
                    <p>• Dining and refreshments</p>
                    <p>• Photo opportunities</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-center text-xl font-bold">Upper Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-gray-600">
                    <p>• Premium viewing areas</p>
                    <p>• Exclusive access zones</p>
                    <p>• VIP facilities</p>
                    <p>• Best panoramic views</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {homepageData.homepage_faqs_enabled && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {homepageData.homepage_faqs_title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {homepageData.homepage_faqs_subtitle}
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How far in advance should I book?</AccordionTrigger>
                  <AccordionContent>
                    We recommend booking at least 2-3 weeks in advance, especially during peak season (June-August). 
                    This ensures availability and often provides better pricing options.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What's included in the ticket price?</AccordionTrigger>
                  <AccordionContent>
                    Most tickets include entrance fees, audio guides, and access to designated areas. 
                    Premium tickets may include additional perks like skip-the-line access, guided tours, or dining options.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I modify or cancel my booking?</AccordionTrigger>
                  <AccordionContent>
                    Yes, most bookings offer flexible cancellation policies. Check the specific terms when booking, 
                    as some tickets offer free cancellation up to 24-48 hours before your visit.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Are there age restrictions or discounts?</AccordionTrigger>
                  <AccordionContent>
                    Children under certain ages often receive discounted rates or free admission. 
                    Senior citizens, students, and families may also qualify for special pricing. 
                    Check individual ticket options for age-specific requirements.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>What should I bring on my visit?</AccordionTrigger>
                  <AccordionContent>
                    Bring your mobile ticket, comfortable walking shoes, weather-appropriate clothing, 
                    and a camera. Some areas may have security restrictions on large bags or certain items.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* Local Area Section */}
      {homepageData.local_area_enabled && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {homepageData.local_area_title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {homepageData.local_area_subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Nearby Attractions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-600">
                    <p>• Historic landmarks within walking distance</p>
                    <p>• Museums and cultural sites</p>
                    <p>• Parks and gardens</p>
                    <p>• Shopping districts</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Bus className="w-5 h-5 text-green-600" />
                    Transportation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-600">
                    <p>• Metro stations nearby</p>
                    <p>• Bus routes and stops</p>
                    <p>• Taxi and rideshare options</p>
                    <p>• Walking paths and routes</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    Local Experiences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-600">
                    <p>• Authentic local cuisine</p>
                    <p>• Cultural events and festivals</p>
                    <p>• Art galleries and studios</p>
                    <p>• Traditional markets</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-12">
              <Link href="/tours">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-semibold rounded-full">
                  Explore All Experiences
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}