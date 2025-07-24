import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Clock,
  Camera,
  ShipWheelIcon as Wheelchair,
  Shield,
  Thermometer,
  Navigation,
  AlertTriangle,
  Star,
  CheckCircle,
  Users,
  Heart,
  Zap,
  Award,
  Globe,
  Train,
  Car,
  MapPin,
  Utensils,
  ShoppingBag,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PlanVisitPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">ET</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Eiffel Tower Tickets</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/tickets" className="text-gray-600 hover:text-blue-600 transition-colors">
              Tickets
            </Link>
            <Link href="/plan-visit" className="text-blue-600 font-semibold">
              Plan Visit
            </Link>
            <Link href="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors">
              Reviews
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
        <Image
          src="/images/paris-cityscape.jpg"
          alt="Paris cityscape with Eiffel Tower and planning elements"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center max-w-5xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Plan Your Perfect Eiffel Tower Visit 2025
          </h1>
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know for an unforgettable Eiffel Tower experience. From insider tips to the best
            photo spots, transportation guides, and local recommendations - we've got you covered.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-lg">
            <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              Expert Local Tips
            </span>
            <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              Best Times to Visit
            </span>
            <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              Photography Guide
            </span>
          </div>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all"
          >
            Start Planning Now
          </Button>
        </div>
      </section>

      {/* Complete Planning Guide Introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Complete Eiffel Tower Visitor Guide 2025
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Planning your Eiffel Tower visit? This comprehensive guide covers everything from the best times to
                visit and transportation options to photography tips and local recommendations. Make your Paris trip
                unforgettable with our insider knowledge and expert advice.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Timing Your Visit</h3>
                <p className="text-blue-800">
                  Learn the best times to visit for shorter queues, perfect lighting, and optimal weather conditions.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Navigation className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-3">Getting There</h3>
                <p className="text-green-800">
                  Comprehensive transportation guide including metro, bus, walking routes, and parking information.
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-purple-900 mb-3">Photography & Tips</h3>
                <p className="text-purple-800">
                  Discover the best photo spots, camera settings, and insider secrets for capturing perfect shots.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Times to Visit */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Best Times to Visit the Eiffel Tower in 2025
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Timing is everything! Choose the perfect time to avoid crowds, get the best photos, and enjoy ideal
              weather conditions for your Eiffel Tower experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-green-100">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-green-500 text-white font-semibold">Best Choice</Badge>
              </div>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-center">Early Morning</CardTitle>
                <CardDescription className="text-center text-gray-600">9:30 - 11:00 AM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-green-600" />
                    <span>Shortest queues (5-15 min)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Camera className="w-4 h-4 text-green-600" />
                    <span>Perfect lighting for photos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Thermometer className="w-4 h-4 text-green-600" />
                    <span>Cooler temperatures</span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg mt-4">
                    <p className="text-green-800 text-sm font-medium">
                      💡 Pro Tip: Book the first time slot for the most peaceful experience
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-center">Golden Hour</CardTitle>
                <CardDescription className="text-center text-gray-600">1 hour before sunset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Heart className="w-4 h-4 text-orange-600" />
                    <span>Romantic atmosphere</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-orange-600" />
                    <span>Stunning sunset views</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-orange-600" />
                    <span>Medium crowds (15-30 min)</span>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg mt-4">
                    <p className="text-orange-800 text-sm font-medium">📸 Perfect for Instagram-worthy photos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-center">Evening Magic</CardTitle>
                <CardDescription className="text-center text-gray-600">After 7:00 PM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-purple-600" />
                    <span>Hourly light show</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="w-4 h-4 text-purple-600" />
                    <span>City lights panorama</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Fewer crowds (10-20 min)</span>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg mt-4">
                    <p className="text-purple-800 text-sm font-medium">✨ Don't miss the sparkling show!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-red-100">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-red-500 text-white font-semibold">Avoid</Badge>
              </div>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-center">Midday Rush</CardTitle>
                <CardDescription className="text-center text-gray-600">11:00 AM - 5:00 PM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-red-600" />
                    <span>Longest queues (1-3 hours)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Thermometer className="w-4 h-4 text-red-600" />
                    <span>Hottest temperatures</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Camera className="w-4 h-4 text-red-600" />
                    <span>Harsh lighting</span>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg mt-4">
                    <p className="text-red-800 text-sm font-medium">⚠️ Only if you have no other choice</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Timing Guide */}
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Timing Guide for Every Season</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Peak Season (June - August)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                    <span className="text-sm">Average wait time</span>
                    <span className="font-bold text-red-600">2-3 hours</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="text-sm">Best arrival time</span>
                    <span className="font-bold text-blue-600">9:00 AM or 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="text-sm">Sunset time</span>
                    <span className="font-bold text-green-600">9:30 PM</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Off-Season (November - March)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="text-sm">Average wait time</span>
                    <span className="font-bold text-green-600">15-30 minutes</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="text-sm">Best arrival time</span>
                    <span className="font-bold text-blue-600">10:00 AM or 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                    <span className="text-sm">Sunset time</span>
                    <span className="font-bold text-orange-600">5:30 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting There */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How to Get to the Eiffel Tower - Complete Transportation Guide 2025
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple convenient ways to reach the Eiffel Tower. Choose the option that works best for your travel
              style, budget, and schedule.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-blue-100">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-blue-500 text-white font-semibold">Recommended</Badge>
              </div>
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Train className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Metro & RER</CardTitle>
                <CardDescription className="text-gray-600">Fast, affordable, and convenient</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-left">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">🚇 Best Stations</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>
                        • <strong>Bir-Hakeim (Line 6):</strong> 5-min walk
                      </li>
                      <li>
                        • <strong>Champ de Mars (RER C):</strong> 2-min walk
                      </li>
                      <li>
                        • <strong>Trocadéro (Lines 6,9):</strong> Great for photos first
                      </li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cost: €1.90</span>
                    <span className="text-green-600 font-semibold">Journey: 15-30 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Navigation className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Walking & Biking</CardTitle>
                <CardDescription className="text-gray-600">Eco-friendly and scenic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-left">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">🚲 Options</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>
                        • <strong>Vélib' bikes:</strong> Stations nearby
                      </li>
                      <li>
                        • <strong>Walking from Louvre:</strong> 25 minutes
                      </li>
                      <li>
                        • <strong>Seine riverside walk:</strong> Beautiful route
                      </li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cost: Free - €5</span>
                    <span className="text-green-600 font-semibold">Great exercise!</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Car className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Taxi & Rideshare</CardTitle>
                <CardDescription className="text-gray-600">Door-to-door convenience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-left">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">🚕 Services</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>
                        • <strong>Uber/Bolt:</strong> Most convenient
                      </li>
                      <li>
                        • <strong>Paris taxis:</strong> Traditional option
                      </li>
                      <li>
                        • <strong>Note:</strong> Traffic can be heavy
                      </li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cost: €15-30</span>
                    <span className="text-yellow-600 font-semibold">15-45 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Transportation Guide */}
          <div className="bg-gray-50 p-8 rounded-lg max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Transportation Instructions</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">From Charles de Gaulle Airport</h4>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                    <p className="font-medium text-gray-900">Option 1: RER B + Metro (€12.05)</p>
                    <p className="text-sm text-gray-600 mt-1">
                      RER B to Châtelet-Les Halles → Metro Line 1 to Champs-Élysées → Line 6 to Bir-Hakeim
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total time: 60-75 minutes</p>
                  </div>
                  <div className="bg-white p-4 rounded border-l-4 border-green-500">
                    <p className="font-medium text-gray-900">Option 2: Airport Shuttle (€25-35)</p>
                    <p className="text-sm text-gray-600 mt-1">Direct shuttle service to Eiffel Tower area</p>
                    <p className="text-xs text-gray-500 mt-1">Total time: 45-60 minutes</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">From Orly Airport</h4>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                    <p className="font-medium text-gray-900">Option 1: Orlyval + RER (€14.40)</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Orlyval to Antony → RER B to Châtelet → Metro Line 6 to Bir-Hakeim
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total time: 50-65 minutes</p>
                  </div>
                  <div className="bg-white p-4 rounded border-l-4 border-green-500">
                    <p className="font-medium text-gray-900">Option 2: Orlybus + Metro (€10.30)</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Orlybus to Denfert-Rochereau → Metro Line 6 to Bir-Hakeim
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total time: 45-60 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What to Expect During Your Eiffel Tower Visit 2025
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Be prepared for security, accessibility options, and everything you need to know for a smooth experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Shield className="w-8 h-8 text-blue-600" />
                    Security Process & Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-3">Step-by-Step Security Process</h4>
                      <ol className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                          <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            1
                          </span>
                          <span>Approach security perimeter (bulletproof glass walls)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            2
                          </span>
                          <span>Walk through metal detectors</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            3
                          </span>
                          <span>Bag inspection if required</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            4
                          </span>
                          <span>Show mobile tickets and ID at entrance</span>
                        </li>
                      </ol>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h5 className="font-medium text-green-800 mb-1 text-sm">✅ Allowed</h5>
                        <ul className="text-xs text-green-700 space-y-1">
                          <li>• Small bags & backpacks</li>
                          <li>• Cameras & phones</li>
                          <li>• Food & drinks</li>
                          <li>• Strollers & wheelchairs</li>
                          <li>• Umbrellas</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <h5 className="font-medium text-red-800 mb-1 text-sm">❌ Prohibited</h5>
                        <ul className="text-xs text-red-700 space-y-1">
                          <li>• Large luggage</li>
                          <li>• Glass bottles</li>
                          <li>• Sharp objects</li>
                          <li>• Alcohol</li>
                          <li>• Weapons</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Wheelchair className="w-8 h-8 text-blue-600" />
                    Accessibility Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-3">✅ Accessible Areas</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Ground level & esplanade</li>
                        <li>• 1st floor (via elevator)</li>
                        <li>• 2nd floor (via elevator)</li>
                        <li>• All restaurants & shops</li>
                        <li>• Accessible restrooms</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-3">❌ Not Accessible</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Summit (3rd floor)</li>
                        <li>• Stairs access route</li>
                        <li>• Some viewing platforms</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-3">🆘 Support Services</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Free wheelchair loans</li>
                        <li>• Dedicated entrance (East pillar)</li>
                        <li>• Staff assistance</li>
                        <li>• Priority elevator access</li>
                        <li>• Companion discounts</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Photography & Insider Tips */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Eiffel Tower Photography Guide & Insider Secrets 2025
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Capture the perfect shot and discover hidden gems that most tourists never see.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Best Photo Spots</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>
                    • <strong>Trocadéro Gardens:</strong> Classic shots
                  </li>
                  <li>
                    • <strong>Pont de Bir-Hakeim:</strong> Unique angles
                  </li>
                  <li>
                    • <strong>Champ de Mars:</strong> Family photos
                  </li>
                  <li>
                    • <strong>Seine riverbank:</strong> Reflections
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <CardTitle className="text-lg">Hidden Gems</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>
                    • <strong>Eiffel's apartment:</strong> Secret office
                  </li>
                  <li>
                    • <strong>Glass floor:</strong> Thrilling views down
                  </li>
                  <li>
                    • <strong>Original elevators:</strong> From 1889!
                  </li>
                  <li>
                    • <strong>Postal service:</strong> Unique postmark
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Money-Saving Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>• Book combo tickets (save 25%)</li>
                  <li>• Bring your own snacks</li>
                  <li>• Use public transport</li>
                  <li>• Visit off-peak seasons</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-lg">Avoid These Mistakes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>• Don't buy from street vendors</li>
                  <li>• Avoid lunch hours (11-2 PM)</li>
                  <li>• Don't wear flip-flops</li>
                  <li>• Don't bring large bags</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Photography Guide */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-lg max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Photography Tips</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Camera Settings by Time of Day</h4>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded border-l-4 border-yellow-500">
                    <p className="font-medium text-gray-900">Golden Hour (Sunset)</p>
                    <p className="text-sm text-gray-600">ISO 100-200, f/5.6-8, 1/125s</p>
                    <p className="text-xs text-gray-500">Warm, soft lighting - perfect for portraits</p>
                  </div>
                  <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                    <p className="font-medium text-gray-900">Blue Hour (After sunset)</p>
                    <p className="text-sm text-gray-600">ISO 400-800, f/2.8-4, 1/60s</p>
                    <p className="text-xs text-gray-500">Dramatic sky with illuminated tower</p>
                  </div>
                  <div className="bg-white p-4 rounded border-l-4 border-purple-500">
                    <p className="font-medium text-gray-900">Night (Light show)</p>
                    <p className="text-sm text-gray-600">ISO 800-1600, f/2.8, 10-30s</p>
                    <p className="text-xs text-gray-500">Long exposure for sparkle trails</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Smartphone Photography Tips</h4>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded">
                    <p className="font-medium text-gray-900 mb-2">📱 Essential Apps</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• VSCO for editing and filters</li>
                      <li>• Camera+ for manual controls</li>
                      <li>• Sun Surveyor for timing</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <p className="font-medium text-gray-900 mb-2">⚙️ Settings</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use portrait mode for depth</li>
                      <li>• Enable HDR for high contrast</li>
                      <li>• Night mode for low light</li>
                      <li>• Grid lines for composition</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Guide */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Year-Round Eiffel Tower Planning Guide 2025</h2>
            <p className="text-xl max-w-3xl mx-auto">
              Each season offers a unique Eiffel Tower experience. Find the perfect time for your visit with our
              detailed seasonal guide.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🌸</div>
              <h3 className="text-xl font-bold mb-3">Spring (March - May)</h3>
              <div className="space-y-2 text-sm">
                <p>• Perfect weather (15-20°C)</p>
                <p>• Blooming gardens nearby</p>
                <p>• Moderate crowds</p>
                <p>• Great for photography</p>
                <p>• Cherry blossoms in parks</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">☀️</div>
              <h3 className="text-xl font-bold mb-3">Summer (June - August)</h3>
              <div className="space-y-2 text-sm">
                <p>• Longest days (sunset 9:30 PM)</p>
                <p>• Extended hours (until midnight)</p>
                <p>• Peak season - book early!</p>
                <p>• Warmest weather (20-25°C)</p>
                <p>• Outdoor dining season</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🍂</div>
              <h3 className="text-xl font-bold mb-3">Autumn (September - November)</h3>
              <div className="space-y-2 text-sm">
                <p>• Beautiful fall colors</p>
                <p>• Comfortable weather (10-18°C)</p>
                <p>• Fewer crowds</p>
                <p>• Great value season</p>
                <p>• Perfect for walking tours</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">❄️</div>
              <h3 className="text-xl font-bold mb-3">Winter (December - February)</h3>
              <div className="space-y-2 text-sm">
                <p>• Festive Christmas atmosphere</p>
                <p>• Shortest queues</p>
                <p>• Best deals available</p>
                <p>• Cozy indoor areas (3-8°C)</p>
                <p>• Holiday light displays</p>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Month-by-Month Planning Guide</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-4">Peak Months (June-August)</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Pros:</strong> Long days, warm weather, all attractions open
                  </p>
                  <p>
                    <strong>Cons:</strong> Highest prices, biggest crowds, hottest temperatures
                  </p>
                  <p>
                    <strong>Book:</strong> 6-8 weeks in advance
                  </p>
                  <p>
                    <strong>Best for:</strong> First-time visitors, families with school-age children
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Shoulder Months (Apr-May, Sep-Oct)</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Pros:</strong> Pleasant weather, moderate crowds, good prices
                  </p>
                  <p>
                    <strong>Cons:</strong> Occasional rain, shorter days in fall
                  </p>
                  <p>
                    <strong>Book:</strong> 3-4 weeks in advance
                  </p>
                  <p>
                    <strong>Best for:</strong> Couples, photographers, budget travelers
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Off-Peak Months (Nov-Mar)</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Pros:</strong> Lowest prices, shortest queues, festive atmosphere
                  </p>
                  <p>
                    <strong>Cons:</strong> Cold weather, shorter days, some outdoor areas closed
                  </p>
                  <p>
                    <strong>Book:</strong> 1-2 weeks in advance
                  </p>
                  <p>
                    <strong>Best for:</strong> Budget travelers, locals, repeat visitors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Area Guide */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Complete Eiffel Tower Area Guide - What to Do Nearby 2025
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Make the most of your visit with our comprehensive guide to attractions, restaurants, shopping, and
                activities within walking distance of the Eiffel Tower.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Nearby Attractions</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-sm">2 min</span>
                    <span>
                      <strong>Champ de Mars:</strong> Beautiful park for picnics
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-sm">5 min</span>
                    <span>
                      <strong>Seine River Cruises:</strong> Bateaux Parisiens dock
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-sm">8 min</span>
                    <span>
                      <strong>Trocadéro Gardens:</strong> Best photo spot
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-sm">10 min</span>
                    <span>
                      <strong>Musée de l'Homme:</strong> Anthropology museum
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-sm">15 min</span>
                    <span>
                      <strong>Invalides:</strong> Napoleon's Tomb & military history
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Utensils className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Best Restaurants & Cafés</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    <strong>Du Pain et des Idées</strong>
                    <p className="text-sm text-gray-600">Famous artisan bakery, 10-min walk</p>
                    <p className="text-xs text-green-600">€5-15 per person</p>
                  </li>
                  <li>
                    <strong>Café de l'Homme</strong>
                    <p className="text-sm text-gray-600">Fine dining with Eiffel Tower views</p>
                    <p className="text-xs text-green-600">€80-120 per person</p>
                  </li>
                  <li>
                    <strong>Les Deux Abeilles</strong>
                    <p className="text-sm text-gray-600">Charming tea room, 8-min walk</p>
                    <p className="text-xs text-green-600">€15-25 per person</p>
                  </li>
                  <li>
                    <strong>Breizh Café</strong>
                    <p className="text-sm text-gray-600">Modern crêperie, 12-min walk</p>
                    <p className="text-xs text-green-600">€12-20 per person</p>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <ShoppingBag className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">Shopping & Souvenirs</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    <strong>Eiffel Tower Gift Shops</strong>
                    <p className="text-sm text-gray-600">Official merchandise on 1st & 2nd floors</p>
                    <p className="text-xs text-purple-600">€5-50 souvenirs</p>
                  </li>
                  <li>
                    <strong>Rue Cler Market Street</strong>
                    <p className="text-sm text-gray-600">Traditional French market, 10-min walk</p>
                    <p className="text-xs text-purple-600">Fresh food & local products</p>
                  </li>
                  <li>
                    <strong>Monoprix</strong>
                    <p className="text-sm text-gray-600">French supermarket for local products</p>
                    <p className="text-xs text-purple-600">€2-20 items</p>
                  </li>
                  <li>
                    <strong>Street Vendors (Trocadéro)</strong>
                    <p className="text-sm text-gray-600">Souvenirs around photo spots</p>
                    <p className="text-xs text-purple-600">€1-10 (negotiate prices)</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Perfect Day Itinerary */}
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Perfect Day Itinerary: Eiffel Tower Area</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Morning (9:00 AM - 12:00 PM)</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      <strong>9:00 AM:</strong> Coffee & pastries at Les Deux Abeilles
                    </li>
                    <li>
                      <strong>9:30 AM:</strong> Eiffel Tower visit (early entry for shortest queues)
                    </li>
                    <li>
                      <strong>11:00 AM:</strong> Walk through Champ de Mars gardens
                    </li>
                    <li>
                      <strong>11:30 AM:</strong> Photo session at Trocadéro Gardens
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Afternoon (12:00 PM - 6:00 PM)</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      <strong>12:00 PM:</strong> Lunch at Café de l'Homme (book ahead)
                    </li>
                    <li>
                      <strong>2:00 PM:</strong> Seine River cruise (1 hour)
                    </li>
                    <li>
                      <strong>3:30 PM:</strong> Visit Invalides & Napoleon's Tomb
                    </li>
                    <li>
                      <strong>5:00 PM:</strong> Shopping & snacks on Rue Cler
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">💡 Pro Tips for Your Day:</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Book restaurant reservations in advance</li>
                  <li>• Wear comfortable walking shoes</li>
                  <li>• Bring a portable phone charger</li>
                  <li>• Check weather and dress appropriately</li>
                  <li>• Keep your tickets and ID easily accessible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Eiffel Tower Visit Planning FAQ 2025</h2>
            <p className="text-xl text-gray-600">
              Get expert answers to the most common questions about planning your Eiffel Tower visit.
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="how-long" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold">How long should I plan for my Eiffel Tower visit?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    The duration of your visit depends on which levels you're visiting and how much time you want to
                    spend exploring. Here's our recommended timing:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">⏱️ Time by Ticket Type:</h4>
                      <ul className="space-y-1 text-blue-800 text-sm">
                        <li>
                          • <strong>Stairs only:</strong> 1-1.5 hours
                        </li>
                        <li>
                          • <strong>Second floor:</strong> 1.5-2 hours
                        </li>
                        <li>
                          • <strong>Summit access:</strong> 2.5-3 hours
                        </li>
                        <li>
                          • <strong>With dining:</strong> Add 1-2 hours
                        </li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">📅 Total Planning Time:</h4>
                      <ul className="space-y-1 text-green-800 text-sm">
                        <li>
                          • <strong>Security & entry:</strong> 15-30 minutes
                        </li>
                        <li>
                          • <strong>Elevator waits:</strong> 10-20 minutes
                        </li>
                        <li>
                          • <strong>Photo time:</strong> 30-45 minutes
                        </li>
                        <li>
                          • <strong>Gift shop:</strong> 15-30 minutes
                        </li>
                      </ul>
                    </div>
                  </div>
                  <p>
                    <strong>Recommendation:</strong> Plan for 3-4 hours total including arrival, security, visit, and
                    departure. This gives you time to enjoy the experience without rushing.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="what-bring" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold">What should I bring for my Eiffel Tower visit?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-gray-700">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">✅ Essential Items:</h4>
                      <ul className="space-y-1 text-green-800 text-sm">
                        <li>• Valid photo ID (passport/driver's license)</li>
                        <li>• Mobile phone with tickets downloaded</li>
                        <li>• Portable phone charger/power bank</li>
                        <li>• Comfortable walking shoes</li>
                        <li>• Weather-appropriate clothing</li>
                        <li>• Small bag or backpack</li>
                        <li>• Camera or smartphone</li>
                        <li>• Water bottle (refillable)</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">🌤️ Weather-Specific Items:</h4>
                      <ul className="space-y-1 text-blue-800 text-sm">
                        <li>
                          • <strong>Summer:</strong> Sunscreen, hat, sunglasses
                        </li>
                        <li>
                          • <strong>Winter:</strong> Warm coat, gloves, scarf
                        </li>
                        <li>
                          • <strong>Rainy season:</strong> Umbrella, rain jacket
                        </li>
                        <li>
                          • <strong>Windy days:</strong> Secure hat, avoid loose items
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">💡 Pro Tips:</h4>
                    <ul className="space-y-1 text-yellow-800 text-sm">
                      <li>• Download offline maps in case of poor signal</li>
                      <li>• Bring snacks to save money (food allowed)</li>
                      <li>• Wear layers - it's windier at the top</li>
                      <li>• Bring a small bag for souvenirs</li>
                      <li>• Consider bringing binoculars for distant views</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="language" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold">Do I need to speak French to visit the Eiffel Tower?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Not at all!</strong> The Eiffel Tower is very international-friendly, and you'll have no
                    trouble visiting without speaking French.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">🗣️ Language Support Available:</h4>
                    <ul className="space-y-1 text-green-800 text-sm">
                      <li>• All signage is in French and English</li>
                      <li>• Staff speak multiple languages (English, Spanish, German, Italian)</li>
                      <li>• Audio guides available in 8 languages</li>
                      <li>• Mobile app with multilingual information</li>
                      <li>• Interactive exhibits have English translations</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">📱 Helpful Apps & Tools:</h4>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>• Google Translate (works offline)</li>
                      <li>• Official Eiffel Tower app (multilingual)</li>
                      <li>• Paris tourism app with translations</li>
                      <li>• Restaurant menus often have English versions</li>
                    </ul>
                  </div>
                  <p>
                    <strong>Bonus tip:</strong> Learning a few basic French phrases like "Bonjour" (hello), "Merci"
                    (thank you), and "Excusez-moi" (excuse me) is always appreciated by locals!
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="children" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold">
                  Is the Eiffel Tower suitable for children? Any special considerations?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Absolutely!</strong> The Eiffel Tower is very family-friendly, but here are some important
                    considerations for visiting with children:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">👶 Age-Specific Tips:</h4>
                      <ul className="space-y-1 text-green-800 text-sm">
                        <li>
                          • <strong>Under 4:</strong> Free entry, bring stroller
                        </li>
                        <li>
                          • <strong>4-11 years:</strong> 50% discount on tickets
                        </li>
                        <li>
                          • <strong>12+ years:</strong> Youth pricing available
                        </li>
                        <li>
                          • <strong>All ages:</strong> Interactive exhibits on 1st floor
                        </li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">🛡️ Safety Considerations:</h4>
                      <ul className="space-y-1 text-blue-800 text-sm">
                        <li>• High safety barriers on all levels</li>
                        <li>• Enclosed glass walls prevent dropping items</li>
                        <li>• Elevators are safe and monitored</li>
                        <li>• Staff trained in family assistance</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">🎯 Kid-Friendly Features:</h4>
                    <ul className="space-y-1 text-purple-800 text-sm">
                      <li>• Glass floor on 2nd level (thrilling for kids!)</li>
                      <li>• Educational exhibits about tower construction</li>
                      <li>• Souvenir shops with child-friendly items</li>
                      <li>• Family restrooms with changing facilities</li>
                      <li>• Snack bars and restaurants</li>
                      <li>• Photo opportunities at every level</li>
                    </ul>
                  </div>
                  <p>
                    <strong>Recommendation:</strong> Second floor access is often the best choice for families - it
                    offers great views, the exciting glass floor, and is more manageable for children than the full
                    summit experience.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Plan Your Perfect Eiffel Tower Visit?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Now that you have all the insider tips and expert advice, it's time to book your unforgettable Eiffel Tower
            experience!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full"
            >
              Check Availability
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-full bg-transparent"
            >
              View All Tickets
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
