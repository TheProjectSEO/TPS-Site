import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Mail, MessageCircle, MapPin, Headphones, Globe, Send } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ContactPage() {
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
            <Link href="/plan-visit" className="text-gray-600 hover:text-blue-600 transition-colors">
              Plan Visit
            </Link>
            <Link href="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors">
              Reviews
            </Link>
            <Link href="/contact" className="text-blue-600 font-semibold">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">We're Here to Help - 24/7 Support 2025</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Our expert travel team is available 24/7 to assist you with bookings, changes, and any questions about your
            Eiffel Tower visit in 2025.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <span className="bg-white/20 px-4 py-2 rounded-full">✓ 24/7 Support</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">✓ 12 Languages</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">✓ Instant Response</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">✓ Local Experts</span>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Expert Eiffel Tower Support - Contact Us Anytime 2025
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Need help with your Eiffel Tower tickets or visit planning? Our multilingual support team is available
                24/7 to assist with bookings, date changes, refunds, and travel advice. With over 10 years of experience
                helping visitors explore Paris, we're here to ensure your Eiffel Tower experience is perfect.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">24/7 Availability</h3>
                <p className="text-blue-800 text-sm">
                  Round-the-clock support via WhatsApp, phone, and email for urgent assistance and last-minute changes.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-green-900 mb-3">12 Languages</h3>
                <p className="text-green-800 text-sm">
                  Support in English, French, Spanish, German, Italian, Portuguese, Japanese, Chinese, Korean, Arabic,
                  Russian, and Hindi.
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Local Experts</h3>
                <p className="text-purple-800 text-sm">
                  Our Paris-based team knows the Eiffel Tower inside and out, providing insider tips and local
                  recommendations.
                </p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">Instant Response</h3>
                <p className="text-orange-800 text-sm">
                  Average response time under 5 minutes via WhatsApp and live chat during business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">Choose your preferred way to contact us</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>WhatsApp Support</CardTitle>
                <CardDescription>Instant messaging with our travel experts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Get immediate help with bookings, changes, and travel advice. Available in 12 languages.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </Button>
                <p className="text-xs text-gray-500 mt-2">+33 1 44 11 23 23</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Phone Support</CardTitle>
                <CardDescription>Speak directly with our team</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Call us for complex bookings, group reservations, or urgent assistance.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <p className="text-xs text-gray-500 mt-2">+33 1 44 11 23 23</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Email Support</CardTitle>
                <CardDescription>Detailed assistance via email</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Send us your questions and we'll respond within 2 hours during business hours.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <p className="text-xs text-gray-500 mt-2">support@eiffeltowertickets.com</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Send className="w-6 h-6 text-blue-600" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" placeholder="John" required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" placeholder="Doe" required />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <select
                        id="subject"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select a topic</option>
                        <option value="booking">New Booking</option>
                        <option value="change">Change/Cancel Booking</option>
                        <option value="refund">Refund Request</option>
                        <option value="technical">Technical Issue</option>
                        <option value="group">Group Booking</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" placeholder="Please describe how we can help you..." rows={5} required />
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Headphones className="w-6 h-6 text-blue-600" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="font-medium">Phone & WhatsApp</span>
                      <span className="text-green-600 font-semibold">24/7 Available</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="font-medium">Email Support</span>
                      <span className="text-blue-600">2-hour response</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="font-medium">Live Chat</span>
                      <span className="text-blue-600">9 AM - 11 PM CET</span>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Emergency Support</h4>
                      <p className="text-sm text-blue-800">
                        For urgent issues during your visit, call our 24/7 emergency line:
                        <strong> +33 1 44 11 23 24</strong>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-blue-600" />
                    Languages Supported
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>English</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Français</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Español</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Deutsch</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Italiano</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Português</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>日本語</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>中文</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>한국어</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>العربية</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Русский</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>हिंदी</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    Visit Our Office
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Paris Office</h4>
                      <p className="text-sm text-gray-600">
                        123 Avenue des Champs-Élysées
                        <br />
                        75008 Paris, France
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Office Hours</h4>
                      <p className="text-sm text-gray-600">
                        Monday - Friday: 9:00 AM - 6:00 PM
                        <br />
                        Saturday: 10:00 AM - 4:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                    <div className="relative h-48 rounded-lg overflow-hidden mt-4">
                      <Image
                        src="/placeholder.svg?height=200&width=400&text=Paris+Office+Map"
                        alt="Office location map"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-white p-3 rounded-lg text-center">
                          <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                          <p className="font-semibold text-sm">Our Paris Office</p>
                          <p className="text-xs text-gray-600">Champs-Élysées</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Eiffel Tower Contact FAQ 2025</h2>
            <p className="text-xl text-gray-600">Find instant answers to common questions</p>
          </div>

          <Tabs defaultValue="booking" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="booking">Booking</TabsTrigger>
              <TabsTrigger value="changes">Changes</TabsTrigger>
              <TabsTrigger value="visit">Visit Day</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            <TabsContent value="booking" className="mt-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How do I book tickets?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Simply select your preferred date, time, and ticket type, then complete the secure checkout.
                      You'll receive your mobile tickets instantly via email and SMS.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google
                      Pay, and bank transfers for group bookings.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="changes" className="mt-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Can I change my booking date?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Yes! You can change your date up to 24 hours before your visit for free. Contact our support team
                      via WhatsApp, phone, or email to make changes.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What's your cancellation policy?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Free cancellation up to 24 hours before your visit for a full refund. Cancellations within 24
                      hours receive a 50% refund. No-shows are non-refundable.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Visit?</h2>
          <p className="text-xl mb-8">
            Our team is standing by to help you create the perfect Eiffel Tower experience!
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
            Check Availability
          </Button>
        </div>
      </section>
    </div>
  )
}
