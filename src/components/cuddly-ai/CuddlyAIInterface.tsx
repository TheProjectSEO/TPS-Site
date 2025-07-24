"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { CuddlyAIForm } from "./CuddlyAIForm"
import { CuddlyAIChat } from "./CuddlyAIChat"
import { ItineraryData, TravelPreferences } from "./types"

export function CuddlyAIInterface() {
  const [preferences, setPreferences] = useState<TravelPreferences | null>(null)
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const handlePreferencesSubmit = async (prefs: TravelPreferences) => {
    console.log('🚀 Starting itinerary generation with preferences:', prefs)
    setPreferences(prefs)
    setIsLoading(true)
    setHasSubmitted(true)

    try {
      // Generate itinerary with AI
      console.log('📡 Making API request to /api/cuddly-ai/generate')
      const response = await fetch("/api/cuddly-ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prefs),
      })

      console.log('📥 API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API error response:', errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ API response data:', data)
      
      if (data.success && data.itinerary) {
        console.log('🎯 Setting itinerary data')
        setItinerary(data.itinerary)
      } else {
        throw new Error('Invalid response format from API')
      }
    } catch (error) {
      console.error("❌ Error generating itinerary:", error)
      console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack,
        preferences: prefs
      })
      // Show error to user
      alert(`Failed to generate itinerary: ${error.message || error}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-200px)]">
      {/* Left Panel - Input Form */}
      <Card className="card-brand p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Tell us about your Paris adventure
          </h2>
          <p className="text-gray-600">
            Share your preferences and we'll create the perfect itinerary for you
          </p>
        </div>
        
        <CuddlyAIForm 
          onSubmit={handlePreferencesSubmit} 
          isLoading={isLoading}
          hasSubmitted={hasSubmitted}
        />
      </Card>

      {/* Right Panel - Chat Interface */}
      <Card className="card-brand p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Your Personalized Itinerary
          </h2>
          <p className="text-gray-600">
            Watch as we craft your perfect Paris experience
          </p>
        </div>
        
        <CuddlyAIChat 
          preferences={preferences}
          itinerary={itinerary}
          isLoading={isLoading}
          hasSubmitted={hasSubmitted}
        />
      </Card>
    </div>
  )
}