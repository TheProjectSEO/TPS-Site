import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Clock,
  Users,
  Zap,
  Award,
  Heart,
  ShipWheelIcon as Wheelchair,
  Star,
  CheckCircle,
  Calendar,
  Camera,
  MapPin,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function TicketsPage() {
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
            <Link href="/tickets" className="text-blue-600 font-semibold">
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
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">All Eiffel Tower Tickets 2025</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Choose from our complete range of Eiffel Tower experiences. From budget-friendly stairs access to luxury
            summit experiences, find the perfect ticket for your Paris adventure with guaranteed skip-the-line access.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white/20 px-4 py-2 rounded-full">✓ Skip-the-Line Access</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">✓ Mobile Tickets</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">✓ Free Cancellation</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">✓ Best Price Guarantee</span>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Official Eiffel Tower Tickets - Compare All Options & Prices 2025
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Book official Eiffel Tower tickets with guaranteed entry and skip-the-line access. We offer the complete
                range of ticket options from budget-friendly stairs access to premium summit experiences, all with
                instant confirmation and mobile delivery.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Why Choose Our Tickets?</h3>
                <ul className="text-blue-800 space-y-2 text-sm">
                  <li>• Official Eiffel Tower partner</li>
                  <li>• Guaranteed skip-the-line access</li>
                  <li>• Instant mobile ticket delivery</li>
                  <li>• 24/7 customer support</li>
                  <li>• Free cancellation up to 24h</li>
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-green-900 mb-3">Ticket Types Available</h3>
                <ul className="text-green-800 space-y-2 text-sm">
                  <li>• Summit access (276m) - Most popular</li>
                  <li>• Second floor elevator (115m)</li>
                  <li>• Stairs to second floor (Budget)</li>
                  <li>• Combo tickets with Seine cruise</li>
                  <li>• Group discounts available</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-purple-900 mb-3">Booking Benefits</h3>
                <ul className="text-purple-800 space-y-2 text-sm">
                  <li>• Best price guarantee</li>
                  <li>• Flexible date changes</li>
                  <li>• Multiple payment options</li>
                  <li>• Instant confirmation</li>
                  <li>• No hidden fees</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Tickets</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="combo">Combo Deals</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Summit Access */}
                <Card className="relative overflow-hidden hover:shadow-xl transition-all">
                  <Badge className="absolute top-4 right-4 bg-green-500">Most Popular</Badge>
                  <div className="relative h-48">
                    <Image src="/images/eiffel-tower-summit.jpg" alt="Summit view" fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Summit Access
                      <span className="text-2xl font-bold text-blue-600">€29.40</span>
                    </CardTitle>
                    <CardDescription>
                      Ultimate experience with access to all levels including the exclusive summit at 276m
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>2-3 hours recommended</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>All ages welcome</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.9/5 rating (12,847 reviews)</span>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Check Availability</Button>
                  </CardContent>
                </Card>

                {/* Second Floor */}
                <Card className="overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative h-48">
                    <Image
                      src="/images/eiffel-tower-second-floor.jpg"
                      alt="Second floor view"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Second Floor Access
                      <span className="text-2xl font-bold text-blue-600">€18.10</span>
                    </CardTitle>
                    <CardDescription>
                      Perfect balance of height and accessibility with glass floor experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>1-2 hours recommended</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Wheelchair className="w-4 h-4" />
                        <span>Wheelchair accessible</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.8/5 rating (8,234 reviews)</span>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Check Availability</Button>
                  </CardContent>
                </Card>

                {/* Stairs Access */}
                <Card className="overflow-hidden hover:shadow-xl transition-all">
                  <Badge className="absolute top-4 right-4 bg-orange-500">Best Value</Badge>
                  <div className="relative h-48">
                    <Image src="/images/eiffel-tower-stairs.jpg" alt="Stairs access" fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Stairs Adventure
                      <span className="text-2xl font-bold text-blue-600">€11.30</span>
                    </CardTitle>
                    <CardDescription>
                      Climb 674 steps for a unique perspective and budget-friendly option
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Zap className="w-4 h-4" />
                        <span>Moderate fitness required</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4" />
                        <span>Unique experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.7/5 rating (5,891 reviews)</span>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Check Availability</Button>
                  </CardContent>
                </Card>

                {/* Combo Tickets */}
                <Card className="overflow-hidden hover:shadow-xl transition-all">
                  <Badge className="absolute top-4 right-4 bg-purple-500">Save €12.50</Badge>
                  <div className="relative h-48">
                    <Image src="/images/seine-cruise.jpg" alt="Seine cruise combo" fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Tower + Seine Cruise
                      <span className="text-2xl font-bold text-blue-600">€45.90</span>
                    </CardTitle>
                    <CardDescription>
                      Eiffel Tower access plus 1-hour Seine River cruise with commentary
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>4-5 hours total experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Heart className="w-4 h-4" />
                        <span>Perfect for couples</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Save €12.50 vs separate</span>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Check Availability</Button>
                  </CardContent>
                </Card>

                {/* Premium Experience */}
                <Card className="overflow-hidden hover:shadow-xl transition-all">
                  <Badge className="absolute top-4 right-4 bg-gold-500 text-white">VIP Experience</Badge>
                  <div className="relative h-48">
                    <Image src="/images/eiffel-tower-summit.jpg" alt="VIP experience" fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      VIP Summit + Champagne
                      <span className="text-2xl font-bold text-blue-600">€89.90</span>
                    </CardTitle>
                    <CardDescription>
                      Premium experience with champagne, priority access, and guided tour
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4" />
                        <span>VIP priority access</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Heart className="w-4 h-4" />
                        <span>Champagne included</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>Small group tour</span>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Check Availability</Button>
                  </CardContent>
                </Card>

                {/* Family Package */}
                <Card className="overflow-hidden hover:shadow-xl transition-all">
                  <Badge className="absolute top-4 right-4 bg-green-500">Family Deal</Badge>
                  <div className="relative h-48">
                    <Image
                      src="/images/eiffel-tower-second-floor.jpg"
                      alt="Family package"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Family Package (2+2)
                      <span className="text-2xl font-bold text-blue-600">€65.00</span>
                    </CardTitle>
                    <CardDescription>
                      Special family rate for 2 adults + 2 children with second floor access
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>2 adults + 2 children</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Save €7.40 vs individual</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Heart className="w-4 h-4" />
                        <span>Kid-friendly activities</span>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Check Availability</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Detailed Ticket Comparison */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Eiffel Tower Ticket Comparison Guide 2025
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Compare all ticket options side-by-side to find the perfect Eiffel Tower experience for your visit.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Feature</th>
                    <th className="px-6 py-4 text-center">Stairs (€11.30)</th>
                    <th className="px-6 py-4 text-center">2nd Floor (€18.10)</th>
                    <th className="px-6 py-4 text-center">Summit (€29.40)</th>
                    <th className="px-6 py-4 text-center">VIP (€89.90)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-medium">Access Level</td>
                    <td className="px-6 py-4 text-center">2nd Floor</td>
                    <td className="px-6 py-4 text-center">2nd Floor</td>
                    <td className="px-6 py-4 text-center">All Levels + Summit</td>
                    <td className="px-6 py-4 text-center">All Levels + Summit</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium">Skip-the-Line</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓ Priority</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Elevator Access</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓ Express</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium">Wheelchair Accessible</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">Partial</td>
                    <td className="px-6 py-4 text-center">Partial</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Glass Floor</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium">Champagne Bar</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center">✓ Included</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Guided Tour</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium">Best For</td>
                    <td className="px-6 py-4 text-center text-sm">Budget travelers, fitness enthusiasts</td>
                    <td className="px-6 py-4 text-center text-sm">Families, accessibility needs</td>
                    <td className="px-6 py-4 text-center text-sm">First-time visitors, photographers</td>
                    <td className="px-6 py-4 text-center text-sm">Special occasions, luxury experience</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Book Your Eiffel Tower Tickets 2025</h2>
            <p className="text-xl text-gray-600">Simple, secure, and instant confirmation process</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Select Date & Time</h3>
              <p className="text-gray-600">Choose your preferred visit date and time slot for the best experience</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Add Guests</h3>
              <p className="text-gray-600">Select number of adults, children, and any special requirements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Instant Confirmation</h3>
              <p className="text-gray-600">Receive your mobile tickets immediately via email and SMS</p>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Eiffel Tower Ticket Prices 2025</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Adult Prices (25+ years)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Stairs to 2nd Floor</span>
                    <span className="font-bold text-blue-600">€11.30</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Elevator to 2nd Floor</span>
                    <span className="font-bold text-blue-600">€18.10</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Elevator to Summit</span>
                    <span className="font-bold text-blue-600">€29.40</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Youth Prices (12-24 years)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Stairs to 2nd Floor</span>
                    <span className="font-bold text-green-600">€5.70</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Elevator to 2nd Floor</span>
                    <span className="font-bold text-green-600">€9.00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Elevator to Summit</span>
                    <span className="font-bold text-green-600">€14.70</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Children under 4 years old enter free. Children 4-11 years receive 50% discount.
                Disabled visitors and one companion receive reduced rates. All prices include booking fees and taxes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visitor Tips Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Essential Tips for Your Eiffel Tower Visit 2025
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Insider advice to make the most of your Eiffel Tower experience.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Best Times to Visit</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Early morning (9:30-11 AM) - shortest queues</li>
                  <li>• Sunset (1 hour before) - romantic lighting</li>
                  <li>• Evening (after 7 PM) - light show</li>
                  <li>• Avoid midday (11 AM-5 PM) - busiest</li>
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Photography Tips</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Trocadéro for classic shots</li>
                  <li>• Pont de Bir-Hakeim for unique angles</li>
                  <li>• Golden hour for best lighting</li>
                  <li>• Night shots during light show</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Getting There</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Metro: Bir-Hakeim (Line 6) - 5 min walk</li>
                  <li>• RER: Champ de Mars (RER C) - 2 min walk</li>
                  <li>• Bus: Lines 30, 42, 72, 82, 86</li>
                  <li>• Parking: Limited, use public transport</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">What to Bring</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Valid ID for ticket verification</li>
                  <li>• Comfortable walking shoes</li>
                  <li>• Weather-appropriate clothing</li>
                  <li>• Portable phone charger</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Eiffel Tower Tickets FAQ 2025</h2>
            <p className="text-xl text-gray-600">
              Answers to the most frequently asked questions about Eiffel Tower tickets and visits.
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="when-book" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold">How far in advance should I book Eiffel Tower tickets?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    We recommend booking <strong>2-4 weeks in advance</strong>, especially during peak season
                    (June-August) and holidays. The Eiffel Tower is one of the world's most popular attractions with
                    limited daily capacity.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">📅 Booking Timeline:</h4>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>
                        • <strong>Peak season (June-August):</strong> Book 4-6 weeks ahead
                      </li>
                      <li>
                        • <strong>Shoulder season (April-May, September-October):</strong> Book 2-3 weeks ahead
                      </li>
                      <li>
                        • <strong>Low season (November-March):</strong> Book 1-2 weeks ahead
                      </li>
                      <li>
                        • <strong>Last-minute:</strong> Check availability daily, some slots may open up
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="weather" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold">What happens if the weather is bad?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    The Eiffel Tower operates in most weather conditions, but safety is the top priority. Here's what to
                    expect:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">✅ Tower Stays Open:</h4>
                      <ul className="space-y-1 text-green-800 text-sm">
                        <li>• Light rain (covered areas available)</li>
                        <li>• Moderate wind (up to 80 km/h)</li>
                        <li>• Cold weather (dress warmly)</li>
                        <li>• Fog (limited visibility but safe)</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">❌ Possible Closures:</h4>
                      <ul className="space-y-1 text-red-800 text-sm">
                        <li>• Strong winds (over 80 km/h)</li>
                        <li>• Severe thunderstorms</li>
                        <li>• Ice on structures</li>
                        <li>• Security alerts</li>
                      </ul>
                    </div>
                  </div>
                  <p>
                    <strong>If your visit is cancelled due to weather:</strong> You'll receive a full refund or can
                    reschedule for another date at no extra cost.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold">What are the security procedures at the Eiffel Tower?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    Security is taken very seriously at the Eiffel Tower. All visitors must pass through security
                    screening before entering the tower perimeter.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">🔒 Security Process:</h4>
                    <ol className="space-y-1 text-blue-800 text-sm">
                      <li>1. Approach the bulletproof glass wall perimeter</li>
                      <li>2. Pass through metal detectors</li>
                      <li>3. Bag inspection (if required)</li>
                      <li>4. Show tickets and ID at tower entrance</li>
                    </ol>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-1 text-sm">✅ Allowed Items:</h5>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• Small bags and backpacks</li>
                        <li>• Cameras and phones</li>
                        <li>• Food and non-alcoholic drinks</li>
                        <li>• Baby strollers</li>
                        <li>• Umbrellas</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <h5 className="font-medium text-red-800 mb-1 text-sm">❌ Prohibited Items:</h5>
                      <ul className="text-xs text-red-700 space-y-1">
                        <li>• Large luggage/suitcases</li>
                        <li>• Glass bottles and containers</li>
                        <li>• Sharp objects (knives, scissors)</li>
                        <li>• Alcoholic beverages</li>
                        <li>• Weapons of any kind</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="group-discounts" className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold">Are there group discounts available?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    Yes! We offer attractive group discounts for parties of 10 or more people. Perfect for school trips,
                    corporate events, or large family gatherings.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">💰 Group Discount Rates:</h4>
                    <ul className="space-y-1 text-green-800 text-sm">
                      <li>
                        • <strong>10-19 people:</strong> 10% discount
                      </li>
                      <li>
                        • <strong>20-49 people:</strong> 15% discount
                      </li>
                      <li>
                        • <strong>50+ people:</strong> 20% discount
                      </li>
                      <li>
                        • <strong>School groups:</strong> Additional 5% off (with valid documentation)
                      </li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">📋 Group Booking Benefits:</h4>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>• Dedicated group entrance</li>
                      <li>• Flexible payment terms</li>
                      <li>• Free group leader ticket (for groups of 20+)</li>
                      <li>• Customizable visit times</li>
                      <li>• Multilingual support</li>
                    </ul>
                  </div>
                  <p>
                    <strong>How to book:</strong> Contact our group sales team at least 2 weeks in advance. Email
                    groups@eiffeltowertickets.com or call +33 1 44 11 23 25.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Eiffel Tower Experience?</h2>
          <p className="text-xl mb-8">Join millions of visitors who have chosen us for their Paris adventure!</p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
            Check Availability
          </Button>
        </div>
      </section>
    </div>
  )
}
