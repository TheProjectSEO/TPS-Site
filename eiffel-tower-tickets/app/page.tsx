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

export default function EiffelTowerTickets() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">ET</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Eiffel Tower Tickets</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-blue-600 font-semibold">
              Home
            </Link>
            <Link href="/tickets" className="text-gray-600 hover:text-blue-600 transition-colors">
              Tickets
            </Link>
            <Link href="/plan-visit" className="text-gray-600 hover:text-blue-600 transition-colors">
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10"></div>
        <Image
          src="/images/eiffel-tower-hero.jpg"
          alt="Eiffel Tower at sunset with golden lighting"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Eiffel Tower Tickets</h1>
          <p className="text-xl md:text-2xl mb-8 font-medium">Skip the Line | Instant Confirmation | Mobile Tickets</p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all"
          >
            Browse All Tickets
          </Button>
        </div>
      </section>

      {/* SEO Content Section - Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Skip the Line Eiffel Tower Tickets - Book Official Tickets Online
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Experience Paris's most iconic landmark without the wait. Our official Eiffel Tower tickets guarantee
              skip-the-line access, instant confirmation, and the best prices available. Whether you're planning to
              visit the second floor, summit, or take the stairs, we have the perfect ticket option for your Paris
              adventure.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Official Eiffel Tower Partner</h3>
                <p className="text-blue-800">
                  We're an authorized ticket reseller with direct access to official Eiffel Tower reservations. All
                  tickets are genuine and guaranteed valid for entry.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-900 mb-3">Best Price Guarantee</h3>
                <p className="text-green-800">
                  Find a lower price elsewhere? We'll match it and give you an extra 5% off. Plus enjoy free
                  cancellation up to 24 hours before your visit.
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-900 mb-3">Instant Mobile Tickets</h3>
                <p className="text-purple-800">
                  No printing required! Receive your tickets instantly via email and SMS. Show your phone at the
                  entrance and skip straight to the front of the line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Eiffel Tower Tickets */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Best Eiffel Tower Tickets 2025 - Compare Prices & Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our most popular Eiffel Tower experiences with skip-the-line access and instant confirmation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Ticket Card 1 */}
            <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-blue-100">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-green-500 text-white font-semibold px-3 py-1">Most Popular</Badge>
              </div>
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/eiffel-tower-summit.jpg"
                  alt="Eiffel Tower Summit Access"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">
                  Eiffel Tower: Summit Access by Elevator
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  Skip the line and access all levels including the exclusive summit at 276m high.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.8</span>
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
                      <span className="text-2xl font-bold text-blue-600">From €29</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                    Check Availability
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Card 2 */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/eiffel-tower-second-floor.jpg"
                  alt="Eiffel Tower Second Floor"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">
                  Eiffel Tower: Second Floor by Elevator
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  Experience the famous glass floor and stunning views from 115m high with elevator access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.7</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>1h 30m</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Smartphone className="w-3 h-3 mr-1" />
                      Mobile Ticket
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Wheelchair className="w-3 h-3 mr-1" />
                      Accessible
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">From €18</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                    Check Availability
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Card 3 */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-orange-500 text-white font-semibold px-3 py-1">Best Value</Badge>
              </div>
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/eiffel-tower-stairs.jpg"
                  alt="Eiffel Tower Stairs Access"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Eiffel Tower: Second Floor by Stairs</CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  Climb 674 steps to the second floor and experience the tower's architecture up close.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.6</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>1h 15m</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Active Experience
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Free Cancellation
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">From €11</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                    Check Availability
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Card 4 */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-purple-500 text-white font-semibold px-3 py-1">Save 20%</Badge>
              </div>
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/seine-cruise.jpg"
                  alt="Eiffel Tower and Seine Cruise Combo"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Eiffel Tower + Seine River Cruise</CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  Combine tower access with a magical 1-hour Seine cruise with audio commentary.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>4h 30m</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Heart className="w-3 h-3 mr-1" />
                      Romantic
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      Audio Guide
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">From €46</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                    Check Availability
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent px-8 py-4"
            >
              View All Tickets
            </Button>
          </div>
        </div>
      </section>

      {/* Trust & Reviews Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">What Travelers Are Saying</h2>
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-900">4.8/5</span>
              <span className="text-gray-600">from 47,382 reviews</span>
            </div>
          </div>
          <div className="relative max-w-6xl mx-auto">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {/* Review Card 1 */}
              <Card className="min-w-[300px] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="font-bold text-white text-lg">SM</span>
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-gray-900">Sarah M.</div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">Trustpilot</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    "Skip-the-line tickets saved us hours! The mobile tickets worked perfectly and the views from the
                    summit were absolutely breathtaking. Highly recommend!"
                  </p>
                </CardContent>
              </Card>

              {/* Review Card 2 */}
              <Card className="min-w-[300px] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                      <span className="font-bold text-white text-lg">JD</span>
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-gray-900">John D.</div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">Google Reviews</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    "Outstanding customer service! Had to change my date last minute and they sorted it out in 5 minutes
                    via WhatsApp. Seamless experience!"
                  </p>
                </CardContent>
              </Card>

              {/* Review Card 3 */}
              <Card className="min-w-[300px] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                      <span className="font-bold text-white text-lg">AL</span>
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-gray-900">Anna L.</div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">TripAdvisor</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    "Perfect for our anniversary! The sunset timing was magical and the combo with Seine cruise was
                    excellent value. Unforgettable experience!"
                  </p>
                </CardContent>
              </Card>

              {/* Review Card 4 */}
              <Card className="min-w-[300px] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                      <span className="font-bold text-white text-lg">MR</span>
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-gray-900">Mike R.</div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">Viator</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    "Great value for money! The stairs option was a fun challenge and we saved quite a bit. Staff was
                    helpful and the whole process was smooth."
                  </p>
                </CardContent>
              </Card>

              {/* Review Card 5 */}
              <Card className="min-w-[300px] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="font-bold text-white text-lg">LC</span>
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-gray-900">Lisa C.</div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">GetYourGuide</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    "Family-friendly experience! Kids loved the glass floor and the interactive exhibits. Mobile tickets
                    made everything so convenient. Will definitely book again!"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Eiffel Tower Guide */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Complete Guide to Visiting the Eiffel Tower in 2025
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to know for the perfect Eiffel Tower experience, from ticket types to insider tips.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Eiffel Tower Ticket Types Explained</h3>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Summit Access Tickets (276m)</h4>
                    <p className="text-gray-700 mb-3">
                      The ultimate Eiffel Tower experience includes access to all three levels. Take the elevator to the
                      second floor, then continue to the summit for breathtaking 360° views of Paris.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Access to 1st floor, 2nd floor, and summit</li>
                      <li>• Champagne bar at the top</li>
                      <li>• Gustave Eiffel's restored office</li>
                      <li>• Best panoramic views of Paris</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Second Floor Tickets (115m)</h4>
                    <p className="text-gray-700 mb-3">
                      Perfect for most visitors, offering excellent views and the famous glass floor experience.
                      Wheelchair accessible and includes access to restaurants and shops.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Glass floor viewing experience</li>
                      <li>• 58 Tour Eiffel restaurant</li>
                      <li>• Wheelchair accessible</li>
                      <li>• Interactive exhibits and gift shops</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Stairs Tickets (Budget Option)</h4>
                    <p className="text-gray-700 mb-3">
                      For the adventurous! Climb 674 steps to the second floor and experience the tower's iron
                      architecture up close. Most affordable option with unique perspectives.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Climb 674 steps to 2nd floor</li>
                      <li>• Unique architectural experience</li>
                      <li>• Most budget-friendly option</li>
                      <li>• Great workout with amazing views</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Eiffel Tower Opening Hours & Best Times</h3>
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">2025 Opening Hours</h4>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Daily:</strong> 9:30 AM - 11:45 PM
                    </p>
                    <p>
                      <strong>Summer (June-August):</strong> Extended hours until 12:45 AM
                    </p>
                    <p>
                      <strong>Last Admission:</strong>
                    </p>
                    <ul className="ml-4 space-y-1 text-sm">
                      <li>• Summit: 11:00 PM (10:30 PM in winter)</li>
                      <li>• 2nd Floor: 10:30 PM</li>
                      <li>• Stairs: 6:30 PM</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Best Times to Visit</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-green-800">Early Morning (9:30-11:00 AM)</p>
                        <p className="text-sm text-gray-600">Shortest queues, best lighting for photos</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-orange-800">Sunset (1 hour before sunset)</p>
                        <p className="text-sm text-gray-600">Romantic atmosphere, golden hour photos</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-purple-800">Evening (After 7:00 PM)</p>
                        <p className="text-sm text-gray-600">Fewer crowds, hourly light show</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Seasonal Considerations</h4>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p>
                      <strong>Spring (March-May):</strong> Perfect weather, moderate crowds
                    </p>
                    <p>
                      <strong>Summer (June-August):</strong> Peak season, book early, extended hours
                    </p>
                    <p>
                      <strong>Fall (September-November):</strong> Great weather, fewer crowds
                    </p>
                    <p>
                      <strong>Winter (December-February):</strong> Shortest queues, festive atmosphere
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Things to Do in Paris */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Top Things to Do in Paris</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover more of Paris's iconic attractions and experiences while you're in the City of Light.
            </p>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide max-w-7xl mx-auto">
            {/* Attraction Card 1 */}
            <Card className="min-w-[280px] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image src="/images/louvre-museum.jpg" alt="Louvre Museum" fill className="object-cover" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">Louvre Museum</CardTitle>
                <CardDescription className="text-gray-600">
                  Home to the Mona Lisa and thousands of masterpieces
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                  Book Now
                </Button>
              </CardContent>
            </Card>

            {/* Attraction Card 2 */}
            <Card className="min-w-[280px] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image src="/images/seine-cruise.jpg" alt="Seine River Cruise" fill className="object-cover" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">Seine River Cruise</CardTitle>
                <CardDescription className="text-gray-600">
                  See Paris from the water with audio commentary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                  Book Now
                </Button>
              </CardContent>
            </Card>

            {/* Attraction Card 3 */}
            <Card className="min-w-[280px] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image src="/images/arc-de-triomphe.jpg" alt="Arc de Triomphe" fill className="object-cover" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">Arc de Triomphe</CardTitle>
                <CardDescription className="text-gray-600">
                  Climb to the top for panoramic Champs-Élysées views
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                  Book Now
                </Button>
              </CardContent>
            </Card>

            {/* Attraction Card 4 */}
            <Card className="min-w-[280px] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image src="/images/notre-dame.jpg" alt="Notre Dame Area" fill className="object-cover" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">Notre Dame Area</CardTitle>
                <CardDescription className="text-gray-600">
                  Explore the historic Île de la Cité and Sainte-Chapelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                  Book Now
                </Button>
              </CardContent>
            </Card>

            {/* Attraction Card 5 */}
            <Card className="min-w-[280px] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image src="/images/versailles.jpg" alt="Palace of Versailles" fill className="object-cover" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">Palace of Versailles</CardTitle>
                <CardDescription className="text-gray-600">Day trip to the opulent palace and gardens</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                  Book Now
                </Button>
              </CardContent>
            </Card>

            {/* Attraction Card 6 */}
            <Card className="min-w-[280px] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image src="/images/montmartre.jpg" alt="Montmartre & Sacré-Cœur" fill className="object-cover" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">Montmartre & Sacré-Cœur</CardTitle>
                <CardDescription className="text-gray-600">
                  Artistic district with stunning basilica views
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Get There */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How to Get to the Eiffel Tower - Transportation Guide 2025
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple convenient transportation options to reach Paris's most famous landmark.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Train className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold">Metro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Line 6:</strong> Bir-Hakeim (5-min walk)
                  </p>
                  <p>
                    <strong>Line 9:</strong> Trocadéro (10-min walk)
                  </p>
                  <p>
                    <strong>RER C:</strong> Champ de Mars (2-min walk)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bus className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold">Bus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Lines:</strong> 30, 42, 72, 82, 86
                  </p>
                  <p>Multiple stops near the tower</p>
                  <p>Runs every 10-15 minutes</p>
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
                  <p>
                    <strong>From Seine:</strong> 5-minute walk
                  </p>
                  <p>
                    <strong>From Champ de Mars:</strong> Direct access
                  </p>
                  <p>Beautiful riverside paths</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Optional Video Section */}
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="relative h-64 bg-gray-900 flex items-center justify-center cursor-pointer group">
                <Image
                  src="/images/transportation-video-thumb.jpg"
                  alt="How to get to Eiffel Tower video thumbnail"
                  fill
                  className="object-cover opacity-70 group-hover:opacity-50 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">Complete Guide: Getting to the Eiffel Tower</h3>
                  <p className="text-sm opacity-90">Watch our step-by-step transportation guide</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Eiffel Tower History & Facts */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Eiffel Tower History, Facts & Architecture
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the fascinating story behind Paris's most famous landmark and architectural marvel.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Construction & Design</h3>
                <p className="text-gray-700 mb-4">
                  Built by Gustave Eiffel for the 1889 World's Fair, the tower took 2 years, 2 months, and 5 days to
                  complete. It was the world's tallest structure until 1930.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 18,038 iron pieces</li>
                  <li>• 2.5 million rivets</li>
                  <li>• 300 workers</li>
                  <li>• 7,300 tons of iron</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Amazing Facts</h3>
                <p className="text-gray-700 mb-4">
                  The Eiffel Tower grows 6 inches taller in summer due to thermal expansion and sways up to 6-7 cm in
                  strong winds. It's painted every 7 years to prevent rust.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Weighs 10,100 tons</li>
                  <li>• 20,000 light bulbs for illumination</li>
                  <li>• Struck by lightning 25 times per year</li>
                  <li>• Most visited paid monument worldwide</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Cultural Impact</h3>
                <p className="text-gray-700 mb-4">
                  Initially criticized by Parisians, the tower has become the universal symbol of Paris and France,
                  inspiring countless replicas worldwide.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Featured in 1,000+ films</li>
                  <li>• Symbol of French engineering</li>
                  <li>• UNESCO World Heritage Site</li>
                  <li>• Most photographed structure globally</li>
                </ul>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Eiffel Tower Through the Decades</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1889</div>
                  <p className="text-sm text-gray-600">Built for World's Fair, initially temporary structure</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1930</div>
                  <p className="text-sm text-gray-600">Lost title of world's tallest to Chrysler Building</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1957</div>
                  <p className="text-sm text-gray-600">TV antennas added, increasing height to 324m</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2000</div>
                  <p className="text-sm text-gray-600">Millennium light show begins, now nightly tradition</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview & History */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Visit the Eiffel Tower?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="/images/eiffel-tower-hero.jpg"
                alt="Eiffel Tower historical view"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">An Icon of Paris Since 1889</h3>
              <p className="text-gray-700 leading-relaxed">
                Standing 330 meters tall, the Eiffel Tower was built by Gustave Eiffel for the 1889 World's Fair. What
                was once considered an eyesore by Parisians has become the most beloved symbol of France and one of the
                world's most visited monuments.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Each year, nearly 7 million visitors from around the globe climb its iron lattice structure to enjoy
                breathtaking panoramic views of Paris. From the romantic second floor to the exclusive summit, every
                level offers a unique perspective of the City of Light.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">330m</div>
                  <div className="text-sm text-gray-600">Height</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1889</div>
                  <div className="text-sm text-gray-600">Built</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">7M</div>
                  <div className="text-sm text-gray-600">Annual Visitors</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">Levels</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eiffel Tower Entry Map */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Eiffel Tower Entry Points</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Know exactly where to go with our detailed entry map showing all access points and ticket types.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden">
              <Image
                src="/images/eiffel-tower-map.jpg"
                alt="Eiffel Tower entry points map"
                width={800}
                height={500}
                className="w-full h-auto"
              />
              {/* Map Labels */}
              <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                <h4 className="font-bold text-gray-900 mb-2">Entry Points</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>South Pillar - Main Entry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span>East Pillar - Groups</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                    <span>Stairs Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <span>Elevator Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Each Level */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What to See on Each Floor of the Eiffel Tower
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what awaits you on each level of this iconic monument.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Second Floor */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/eiffel-tower-second-floor.jpg"
                  alt="Eiffel Tower Second Floor"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Second Floor (115m)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Experience the famous glass floor and enjoy panoramic views of Paris. Home to shops, restaurants, and
                  interactive exhibits about the tower's history.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Glass floor experience</li>
                  <li>• 58 Tour Eiffel restaurant</li>
                  <li>• Gift shops and exhibits</li>
                  <li>• Wheelchair accessible</li>
                </ul>
              </CardContent>
            </Card>

            {/* Summit */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-blue-100">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-blue-500 text-white font-semibold">Most Popular</Badge>
              </div>
              <div className="relative h-48 overflow-hidden">
                <Image src="/images/eiffel-tower-summit.jpg" alt="Eiffel Tower Summit" fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Summit (276m)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  The ultimate Eiffel Tower experience! Enjoy 360° views from the highest accessible point, visit the
                  champagne bar, and see Gustave Eiffel's restored office.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Highest public observation deck</li>
                  <li>• Champagne bar</li>
                  <li>• Gustave Eiffel's office</li>
                  <li>• Breathtaking 360° views</li>
                </ul>
              </CardContent>
            </Card>

            {/* First Floor */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/eiffel-tower-first-floor.jpg"
                  alt="Eiffel Tower First Floor"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">First Floor (57m)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  A cultural space with exhibitions, a glass pavilion, and the Madame Brasserie restaurant. Perfect for
                  families with interactive displays and comfortable viewing areas.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Cultural exhibitions</li>
                  <li>• Madame Brasserie restaurant</li>
                  <li>• Glass pavilion</li>
                  <li>• Family-friendly activities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dining Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Dining at the Eiffel Tower</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From casual dining to Michelin-starred cuisine, enjoy exceptional meals with unparalleled views.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="space-y-6">
              {/* Madame Brasserie */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Madame Brasserie</CardTitle>
                  <CardDescription className="text-gray-600">1st Floor • Contemporary French Cuisine</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Enjoy modern French cuisine by Chef Thierry Marx in a bright, contemporary setting with stunning
                    views of Paris.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">€45-85 per person</span>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Reserve Now</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Le Jules Verne */}
              <Card className="hover:shadow-lg transition-shadow border-2 border-yellow-100">
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-yellow-500 text-white font-semibold">Michelin ⭐</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Le Jules Verne</CardTitle>
                  <CardDescription className="text-gray-600">2nd Floor • Fine Dining</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Michelin-starred restaurant by Chef Frédéric Anton offering exquisite French cuisine with panoramic
                    views. Reservations essential.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">€190-290 per person</span>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Reserve Now</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Champagne Bar */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Champagne Bar</CardTitle>
                  <CardDescription className="text-gray-600">Summit • Drinks & Light Snacks</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Toast to your visit at the highest point with premium champagne and breathtaking 360° views of
                    Paris.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">€15-25 per drink</span>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Reserve Now</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="/images/dining-eiffel-tower.jpg"
                alt="Dining at the Eiffel Tower"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Eiffel Tower Photography Guide */}
      <section className="py-20 bg-gradient-to-r from-purple-100 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Best Photo Spots & Instagram Guide for Eiffel Tower
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Capture the perfect shot with our insider photography guide to the most Instagrammable spots around the
                Eiffel Tower.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Trocadéro Gardens</h3>
                <p className="text-gray-600 text-sm mb-3">
                  The most famous Eiffel Tower viewpoint. Perfect for classic shots with the full tower in frame.
                </p>
                <div className="text-xs text-gray-500">
                  <p>📍 Place du Trocadéro</p>
                  <p>🚇 Metro: Trocadéro (Lines 6, 9)</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Pont de Bir-Hakeim</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Unique angles with the bridge in foreground. Featured in many movies including Inception.
                </p>
                <div className="text-xs text-gray-500">
                  <p>📍 Bir-Hakeim Bridge</p>
                  <p>🚇 Metro: Bir-Hakeim (Line 6)</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Champ de Mars</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Perfect for family photos and picnic shots. Great for sunrise and sunset photography.
                </p>
                <div className="text-xs text-gray-500">
                  <p>📍 Champ de Mars Park</p>
                  <p>🚇 RER: Champ de Mars (RER C)</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Seine Riverbank</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Capture reflections in the water and romantic riverside shots, especially beautiful at golden hour.
                </p>
                <div className="text-xs text-gray-500">
                  <p>📍 Quai Branly</p>
                  <p>🚇 Metro: Alma-Marceau (Line 9)</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Photography Tips for the Perfect Shot</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Best Times for Photography</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">🌅</span>
                      <span>
                        <strong>Golden Hour:</strong> 1 hour before sunset for warm, soft lighting
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">🌙</span>
                      <span>
                        <strong>Blue Hour:</strong> 30 minutes after sunset for dramatic sky
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500">✨</span>
                      <span>
                        <strong>Night:</strong> Hourly light show (every hour on the hour)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">🌄</span>
                      <span>
                        <strong>Early Morning:</strong> Fewer crowds, soft natural light
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Pro Photography Settings</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">📷</span>
                      <span>
                        <strong>Daytime:</strong> ISO 100-200, f/8-11, fast shutter speed
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">🌃</span>
                      <span>
                        <strong>Night:</strong> ISO 800-1600, f/2.8-5.6, tripod recommended
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">⚡</span>
                      <span>
                        <strong>Light Show:</strong> Long exposure (10-30 seconds) for sparkle trails
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500">📱</span>
                      <span>
                        <strong>Phone Tips:</strong> Use portrait mode, HDR, and night mode
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tours */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Best Paris Tours & Attractions to Visit with Eiffel Tower
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete your Paris experience with these popular attractions and tours.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Louvre Museum */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image src="/images/louvre-museum.jpg" alt="Louvre Museum" fill className="object-cover" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Louvre Museum</CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  Skip-the-line access to the world's largest art museum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                  Book
                </Button>
              </CardContent>
            </Card>

            {/* Seine Cruise */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image src="/images/seine-cruise.jpg" alt="Seine River Cruise" fill className="object-cover" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Seine Cruise</CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  1-hour sightseeing cruise with audio commentary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                  Book
                </Button>
              </CardContent>
            </Card>

            {/* Versailles */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image src="/images/versailles.jpg" alt="Versailles Day Trip" fill className="object-cover" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Versailles Day Trip</CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  Full-day tour to the opulent palace and gardens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                  Book
                </Button>
              </CardContent>
            </Card>

            {/* Paris Catacombs */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image src="/images/paris-catacombs.jpg" alt="Paris Catacombs" fill className="object-cover" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Paris Catacombs</CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  Explore the mysterious underground ossuary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                  Book
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Eiffel Tower Tickets FAQ 2025 - Common Questions Answered
            </h2>
            <p className="text-xl text-gray-600">
              Get instant answers to the most common questions about visiting the Eiffel Tower
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="difference" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold">What's the difference between Second Floor and Summit?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    The <strong>Second Floor (115m)</strong> offers excellent panoramic views, the famous glass floor,
                    restaurants, and shops. It's wheelchair accessible and perfect for most visitors.
                  </p>
                  <p>
                    The <strong>Summit (276m)</strong> is the highest accessible point with 360° views, Gustave Eiffel's
                    restored office, and a champagne bar. It requires an additional elevator ride from the second floor
                    and is not wheelchair accessible.
                  </p>
                  <p>
                    <strong>Recommendation:</strong> First-time visitors often prefer the Summit for the complete
                    experience, while families with young children may find the Second Floor more convenient.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="print" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold">Do I need to print my ticket?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>No printing required!</strong> All our tickets are mobile-friendly. Simply show your
                    smartphone at the entrance with the QR code from your confirmation email.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">📱 Mobile Ticket Tips:</h4>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>• Ensure your phone is charged (recommend 50%+ battery)</li>
                      <li>• Adjust screen brightness for easy scanning</li>
                      <li>• Take a screenshot as backup in case of poor signal</li>
                      <li>• Add tickets to your phone's wallet app for offline access</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="refund" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold">What's the refund policy?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-gray-700">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">✅ Free Cancellation Policy:</h4>
                    <p className="text-green-800">
                      Cancel up to <strong>24 hours before your visit</strong> for a full refund - no questions asked!
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <strong>Cancellation Timeline:</strong>
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • <strong>24+ hours before:</strong> 100% refund
                      </li>
                      <li>
                        • <strong>2-24 hours before:</strong> 50% refund
                      </li>
                      <li>
                        • <strong>Less than 2 hours or no-show:</strong> No refund
                      </li>
                    </ul>
                  </div>
                  <p>
                    <strong>How to cancel:</strong> Use the cancellation link in your booking confirmation email, or
                    contact our 24/7 support team via WhatsApp, phone, or email.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="accessibility" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold">Is the Eiffel Tower wheelchair accessible?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-gray-700">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">✅ Accessible Areas:</h4>
                      <ul className="space-y-1 text-green-800 text-sm">
                        <li>• Ground floor and esplanade</li>
                        <li>• 1st floor (via elevator)</li>
                        <li>• 2nd floor (via elevator)</li>
                        <li>• Restaurants and shops</li>
                        <li>• Accessible restrooms available</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">❌ Not Accessible:</h4>
                      <ul className="space-y-1 text-red-800 text-sm">
                        <li>• Summit (3rd floor)</li>
                        <li>• Stairs access route</li>
                        <li>• Some outdoor viewing areas</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">🦽 Additional Services:</h4>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>• Free wheelchair loans available at information desk</li>
                      <li>• Dedicated accessible entrance (East pillar)</li>
                      <li>• Staff assistance available upon request</li>
                      <li>• Priority boarding for elevators</li>
                      <li>• Companion tickets at reduced rates</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="change" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold">Can I change my ticket date or time?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Yes, in most cases!</strong> We offer flexible booking options that allow you to change your
                    ticket date or time, subject to availability.
                  </p>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important Notes:</h4>
                    <ul className="space-y-1 text-yellow-800 text-sm">
                      <li>• Changes must be requested at least 24 hours before your original visit time.</li>
                      <li>• Changes are subject to availability and may incur a small fee.</li>
                      <li>• Some ticket types (e.g., special events) may not be eligible for changes.</li>
                    </ul>
                  </div>
                  <p>
                    <strong>How to change:</strong> Contact our 24/7 support team via WhatsApp, phone, or email with
                    your booking reference number and preferred new date/time.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Local Area Guide */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What to Do Near the Eiffel Tower - Local Area Guide
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Make the most of your visit with our guide to attractions, restaurants, and activities within walking
                distance of the Eiffel Tower.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Nearby Attractions (Walking Distance)</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">5 min</span>
                    <span>
                      <strong>Seine River Cruises</strong> - Bateaux Parisiens dock
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">8 min</span>
                    <span>
                      <strong>Trocadéro Gardens</strong> - Best photo spot
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">10 min</span>
                    <span>
                      <strong>Musée de l'Homme</strong> - Anthropology museum
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">12 min</span>
                    <span>
                      <strong>Pont Alexandre III</strong> - Most beautiful bridge
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">15 min</span>
                    <span>
                      <strong>Invalides & Napoleon's Tomb</strong> - Military history
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Best Restaurants & Cafés</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    <strong>Du Pain et des Idées</strong>
                    <p className="text-sm text-gray-600">Famous bakery, 10-min walk</p>
                  </li>
                  <li>
                    <strong>Café de l'Homme</strong>
                    <p className="text-sm text-gray-600">Fine dining with Eiffel Tower views</p>
                  </li>
                  <li>
                    <strong>Les Deux Abeilles</strong>
                    <p className="text-sm text-gray-600">Charming tea room, 8-min walk</p>
                  </li>
                  <li>
                    <strong>Breizh Café</strong>
                    <p className="text-sm text-gray-600">Modern crêperie, 12-min walk</p>
                  </li>
                  <li>
                    <strong>Monoprix Café</strong>
                    <p className="text-sm text-gray-600">Budget-friendly option with view</p>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Shopping & Souvenirs</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    <strong>Eiffel Tower Gift Shops</strong>
                    <p className="text-sm text-gray-600">Official merchandise on 1st & 2nd floors</p>
                  </li>
                  <li>
                    <strong>Rue Cler Market Street</strong>
                    <p className="text-sm text-gray-600">Traditional French market, 10-min walk</p>
                  </li>
                  <li>
                    <strong>Galeries Lafayette Champs-Élysées</strong>
                    <p className="text-sm text-gray-600">Department store, 15-min metro ride</p>
                  </li>
                  <li>
                    <strong>Street Vendors</strong>
                    <p className="text-sm text-gray-600">Souvenirs around Trocadéro (negotiate prices)</p>
                  </li>
                  <li>
                    <strong>Monoprix</strong>
                    <p className="text-sm text-gray-600">French supermarket chain for local products</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Perfect Day Itinerary: Eiffel Tower Area</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Morning (9:00 AM - 12:00 PM)</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      <strong>9:00 AM:</strong> Coffee at Les Deux Abeilles
                    </li>
                    <li>
                      <strong>9:30 AM:</strong> Eiffel Tower visit (early entry)
                    </li>
                    <li>
                      <strong>11:00 AM:</strong> Walk through Champ de Mars
                    </li>
                    <li>
                      <strong>11:30 AM:</strong> Photos at Trocadéro Gardens
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Afternoon (12:00 PM - 6:00 PM)</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      <strong>12:00 PM:</strong> Lunch at Café de l'Homme
                    </li>
                    <li>
                      <strong>2:00 PM:</strong> Seine River cruise
                    </li>
                    <li>
                      <strong>3:30 PM:</strong> Visit Invalides & Napoleon's Tomb
                    </li>
                    <li>
                      <strong>5:00 PM:</strong> Shopping on Rue Cler
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-4">Explore the magic of Paris with our exclusive Eiffel Tower tickets and tours.</p>
          <div className="flex justify-center space-x-6">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link href="/tickets" className="hover:text-blue-400 transition-colors">
              Tickets
            </Link>
            <Link href="/plan-visit" className="hover:text-blue-400 transition-colors">
              Plan Visit
            </Link>
            <Link href="/reviews" className="hover:text-blue-400 transition-colors">
              Reviews
            </Link>
            <Link href="/contact" className="hover:text-blue-400 transition-colors">
              Contact
            </Link>
          </div>
          <p className="mt-8 text-sm opacity-70">© 2025 Eiffel Tower Tickets. All rights reserved.</p>
        </div>
      </footer>

      {/* Sticky CTA Footer (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 md:hidden">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg rounded-full shadow-lg">
          Check Availability
        </Button>
      </div>
    </div>
  )
}
