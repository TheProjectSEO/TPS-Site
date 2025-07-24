"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TravelPreferences, ItineraryData } from "./types"
import { MapPin, Clock, Star, Euro, ExternalLink, Calendar } from "lucide-react"
import Link from "next/link"
import { OptimizedImage } from "@/components/ui/OptimizedImage"

interface CuddlyAIChatProps {
  preferences: TravelPreferences | null
  itinerary: ItineraryData | null
  isLoading: boolean
  hasSubmitted: boolean
}

export function CuddlyAIChat({ preferences, itinerary, isLoading, hasSubmitted }: CuddlyAIChatProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log('🎬 CuddlyAIChat render - Props:', { 
      hasItinerary: !!itinerary, 
      isLoading, 
      hasSubmitted,
      isTyping,
      itineraryOverview: itinerary?.overview,
      itineraryDaysCount: itinerary?.days?.length
    })
  }, [itinerary, isLoading, hasSubmitted, isTyping])

  useEffect(() => {
    console.log('⚡ CuddlyAIChat typing effect trigger - itinerary:', !!itinerary)
    if (itinerary) {
      setIsTyping(true)
      setDisplayedText("")
      
      const fullText = `Perfect! I've created a personalized ${itinerary.overview.totalDays}-day Paris itinerary just for you. Here's what I've planned based on your preferences...`
      
      let currentIndex = 0
      const typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)
        }
      }, 30)

      return () => clearInterval(typingInterval)
    }
  }, [itinerary])

  if (!hasSubmitted) {
    return (
      <div className="flex items-center justify-center text-center py-12">
        <div className="max-w-md">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to plan your Paris adventure?
          </h3>
          <p className="text-gray-600">
            Fill out the form on the left and I'll create a personalized itinerary tailored just for you!
          </p>
        </div>
      </div>
    )
  }

  if (isLoading && !itinerary) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end mb-4">
          <div className="bg-gradient-primary text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
            <p className="text-sm">
              Create a {preferences?.duration}-day Paris itinerary for {preferences?.travelerType} travelers interested in {preferences?.interests?.slice(0, 3).join(", ") || "general experiences"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm">🤖</span>
          </div>
          <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-sm text-gray-600">Creating your perfect itinerary...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (itinerary) {
    console.log('🎯 Rendering itinerary with isTyping:', isTyping, 'displayedText:', displayedText.length)
    return (
      <div className="space-y-4">
        <div className="flex justify-end mb-4">
          <div className="bg-gradient-primary text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
            <p className="text-sm">
              Create a {preferences?.duration}-day Paris itinerary for {preferences?.travelerType} travelers interested in {preferences?.interests?.slice(0, 3).join(", ") || "general experiences"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🤖</span>
            </div>
            <div className="flex-1 space-y-4">
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-gray-800">
                  {displayedText || "Loading itinerary..."}
                  {isTyping && <span className="inline-block w-0.5 h-4 bg-primary ml-1 animate-pulse" />}
                </p>
              </div>

              {!isTyping && (
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">{itinerary.overview.title}</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{itinerary.overview.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm">{itinerary.overview.totalDays} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4 text-primary" />
                      <span className="text-sm">{itinerary.overview.estimatedBudget}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-900">Highlights:</h4>
                    <div className="flex flex-wrap gap-1">
                      {itinerary.overview.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {!isTyping && itinerary.days.map((day, dayIndex) => (
                <Card key={dayIndex} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {day.dayNumber}
                    </div>
                    <div>
                      <h3 className="font-semibold">{day.theme}</h3>
                      <p className="text-sm text-gray-600">{day.date}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">{day.summary}</p>

                  <div className="space-y-3">
                    {day.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="border-l-2 border-purple-200 pl-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-primary">{item.time}</span>
                              <Badge variant="outline" className="text-xs">{item.type}</Badge>
                            </div>
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {item.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.duration}
                              </div>
                            </div>

                            {item.tips && (
                              <div className="mt-2">
                                <div className="text-xs text-gray-600 space-y-1">
                                  {item.tips.map((tip, tipIndex) => (
                                    <p key={tipIndex}>💡 {tip}</p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {item.recommendedProducts && item.recommendedProducts.length > 0 && (
                          <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                            <h5 className="text-sm font-medium text-gray-900 mb-3">🎯 Recommended Tours & Experiences</h5>
                            <div className="grid gap-3">
                              {item.recommendedProducts.map((product, productIndex) => (
                                <Card key={productIndex} className="group cursor-pointer overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 bg-white border border-gray-200">
                                  <div className="p-3">
                                    <div className="flex gap-3">
                                      {/* Image Section */}
                                      <div className="relative flex-shrink-0">
                                        {product.image ? (
                                          <OptimizedImage
                                            src={product.image}
                                            alt={product.title}
                                            width={80}
                                            height={80}
                                            className="rounded-lg object-cover"
                                          />
                                        ) : (
                                          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">🎯</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Content Section */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <h6 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                                              {product.title}
                                            </h6>
                                            
                                            {/* Rating and Reviews */}
                                            <div className="flex items-center gap-1 mb-2">
                                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                              <span className="text-xs font-medium text-gray-900">{product.rating}</span>
                                              {product.reviewCount && (
                                                <span className="text-xs text-gray-500">({product.reviewCount.toLocaleString()})</span>
                                              )}
                                            </div>
                                            
                                            {/* Tour Details */}
                                            <div className="flex items-center gap-3 mb-2">
                                              <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                                                <Clock className="w-3 h-3 text-blue-600 mr-1" />
                                                <span className="text-xs font-medium text-blue-800">{product.duration}</span>
                                              </div>
                                              <div className="text-sm font-bold text-gray-900">
                                                {product.price}
                                              </div>
                                            </div>
                                            
                                            {/* Highlights */}
                                            {product.highlights && product.highlights.length > 0 && (
                                              <div className="flex flex-wrap gap-1">
                                                {product.highlights.slice(0, 3).map((highlight, idx) => (
                                                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                                    {highlight}
                                                  </span>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                          
                                          {/* Book Now Button */}
                                          <Link href={`/tour/${product.slug}`} target="_blank" rel="noopener noreferrer">
                                            <Button size="sm" className="ml-2 bg-gradient-primary hover:opacity-90 text-white border-0">
                                              <ExternalLink className="w-3 h-3 mr-1" />
                                              View
                                            </Button>
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}

              {!isTyping && (
                <Card className="p-4 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span>💡</span>
                    Pro Tips for Your Paris Adventure
                  </h3>
                  
                  <div className="grid gap-4">
                    {Object.entries(itinerary.tips).map(([category, tips]) => (
                      <div key={category}>
                        <h4 className="font-medium text-sm text-gray-900 mb-2 capitalize">
                          {category}
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}