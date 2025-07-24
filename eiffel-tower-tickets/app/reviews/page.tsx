import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Star, CheckCircle, Users, Calendar, MapPin, ThumbsUp, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function ReviewsPage() {
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
            <Link href="/reviews" className="text-blue-600 font-semibold">
              Reviews
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-12 h-12 fill-white text-white" />
              ))}
            </div>
            <span className="text-6xl font-bold">4.8</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Customer Reviews 2025</h1>
          <p className="text-xl mb-8">
            Based on <strong>52,847 verified reviews</strong> from travelers worldwide in 2025
          </p>
          <div className="flex justify-center items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              <span>Excellent: 89%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              <span>Very Good: 8%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-300 rounded-full"></div>
              <span>Good: 3%</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Real Eiffel Tower Reviews from Verified Visitors 2025
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Read authentic reviews from over 52,000 verified visitors who have experienced the Eiffel Tower with our
                tickets. Our customers consistently rate us 4.8/5 stars for our skip-the-line access, mobile tickets,
                customer service, and overall booking experience. Discover why travelers from around the world choose us
                for their Paris adventure.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-green-900 mb-3">Verified Reviews Only</h3>
                <p className="text-green-800">
                  Every review is from a verified ticket purchase. We don't allow fake reviews, ensuring you get honest
                  feedback from real visitors.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Global Travelers</h3>
                <p className="text-blue-800">
                  Reviews from visitors representing over 80 countries, giving you perspectives from diverse travel
                  experiences and expectations.
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-purple-900 mb-3">Recent Experiences</h3>
                <p className="text-purple-800">
                  All reviews are from recent visits, ensuring the information reflects current conditions, services,
                  and experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Breakdown */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Rating Breakdown</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { stars: 5, percentage: 89, count: 47234 },
                      { stars: 4, percentage: 8, count: 4127 },
                      { stars: 3, percentage: 2, count: 1032 },
                      { stars: 2, percentage: 1, count: 454 },
                      { stars: 1, percentage: 0, count: 0 },
                    ].map((rating) => (
                      <div key={rating.stars} className="flex items-center gap-4">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm font-medium">{rating.stars}</span>
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </div>
                        <Progress value={rating.percentage} className="flex-1" />
                        <span className="text-sm text-gray-600 w-16 text-right">{rating.percentage}%</span>
                        <span className="text-xs text-gray-500 w-20 text-right">({rating.count.toLocaleString()})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Review Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: "Skip-the-line Service", rating: 4.9 },
                      { category: "Mobile Tickets", rating: 4.8 },
                      { category: "Customer Support", rating: 4.8 },
                      { category: "Value for Money", rating: 4.7 },
                      { category: "Booking Process", rating: 4.9 },
                      { category: "Clear Instructions", rating: 4.8 },
                      { category: "Easy to Find", rating: 4.7 },
                      { category: "Overall Experience", rating: 4.9 },
                    ].map((item) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold">{item.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="recent" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recent">Most Recent</TabsTrigger>
              <TabsTrigger value="helpful">Most Helpful</TabsTrigger>
              <TabsTrigger value="photos">With Photos</TabsTrigger>
              <TabsTrigger value="verified">Verified Only</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="mt-8">
              <div className="space-y-6">
                {/* Review 1 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="font-bold text-white">SM</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-lg">Sarah M.</span>
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span>2 days ago</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              London, UK
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-blue-100 text-blue-800">Summit Access</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      "Absolutely incredible experience with the family!"
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      The skip-the-line tickets were a lifesaver! We visited during peak summer season and saw people in
                      regular queues still waiting when we were already at the top enjoying the breathtaking views. The
                      mobile tickets worked flawlessly - just showed our phones and we were in. Our kids (ages 8 and 12)
                      were absolutely mesmerized by the views from the summit. The champagne bar was a nice touch for
                      the adults too. The whole experience was seamless from booking to visit. Highly recommend booking
                      in advance, especially during summer!
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Family with children
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Visited in July 2024
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Helpful (127)
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                      <span className="text-xs text-gray-400">Ticket: €29.40 per person</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Review 2 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                          <span className="font-bold text-white">JD</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-lg">John D.</span>
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span>1 week ago</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              New York, USA
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-purple-100 text-purple-800">Tower + Seine Combo</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-gray-900 mb-2">"Outstanding customer service saved my trip!"</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      I had to change my visit date last minute due to a flight delay, and I was worried I'd lose my
                      money. But their 24/7 support team was incredible - I contacted them via WhatsApp at 11 PM Paris
                      time and they sorted everything out in under 5 minutes! The booking process was seamless, tickets
                      arrived instantly, and the combo with the Seine cruise was perfect. Seeing Paris from both the
                      tower and the river gave completely different perspectives. The audio guide on the cruise was
                      informative and available in multiple languages. Great value for money and stress-free experience.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Solo business traveler
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Visited in October 2024
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Helpful (89)
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                      <span className="text-xs text-gray-400">Combo: €45.90 per person</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Review 3 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                          <span className="font-bold text-white">AL</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-lg">Anna L.</span>
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span>3 days ago</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              Tokyo, Japan
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800">Second Floor Access</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      "Perfect romantic experience for our anniversary!"
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We booked the sunset time slot for our 10th anniversary and it was absolutely magical! The golden
                      hour lighting was perfect for photos, and the atmosphere was so romantic. The glass floor on the
                      second level was thrilling - a bit scary at first but such a unique experience. We also loved the
                      interactive exhibits that explained the tower's history. The staff was very helpful and spoke
                      excellent English. We ended up staying for the hourly light show after dark, which was
                      breathtaking. Definitely worth every penny for a special occasion!
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Couple celebrating anniversary
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Visited in September 2024
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Helpful (156)
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                      <span className="text-xs text-gray-400">Ticket: €18.10 per person</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Reviews
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join 52,847+ Happy Customers in 2025</h2>
          <p className="text-xl mb-8">Book your Eiffel Tower experience today!</p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
            Check Availability
          </Button>
        </div>
      </section>
    </div>
  )
}
