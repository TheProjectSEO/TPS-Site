"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface SimpleItinerary {
  overview: {
    title: string
    description: string
    totalDays: number
  }
  days: Array<{
    dayNumber: number
    theme: string
    summary: string
  }>
}

export default function SimpleCuddlyAI() {
  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState<SimpleItinerary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    startDate: '2025-02-01',
    endDate: '2025-02-03',
    travelerType: 'couple'
  })

  const generateItinerary = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setItinerary(null)

    // Calculate duration
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    const requestData = {
      location: "Paris",
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration,
      travelerType: formData.travelerType,
      groupSize: 2,
      interests: ["Art & Museums", "Romance"],
      travelStyle: "mid-range",
      budget: { range: "1000-2000", currency: "EUR" },
      pace: "moderate"
    }

    console.log('🚀 Sending request:', requestData)

    try {
      const response = await fetch('/api/cuddly-ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      console.log('📡 Response status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📄 Response data:', data)

      if (data.success && data.itinerary) {
        setItinerary(data.itinerary)
      } else {
        setError('Invalid response format')
      }
    } catch (err) {
      console.error('❌ Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">🤖 Simple Cuddly AI Test</h1>
        <p className="text-gray-600">Minimal test interface for debugging</p>
      </div>

      <Card className="p-6 mb-6">
        <form onSubmit={generateItinerary} className="space-y-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="travelerType">Traveler Type</Label>
            <select 
              id="travelerType"
              value={formData.travelerType}
              onChange={(e) => setFormData(prev => ({ ...prev, travelerType: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="solo">Solo</option>
              <option value="couple">Couple</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
            </select>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Generating Itinerary... ⏳' : '🚀 Generate Paris Itinerary'}
          </Button>
        </form>
      </Card>

      {error && (
        <Card className="p-4 mb-6 bg-red-50 border-red-200">
          <h3 className="font-semibold text-red-800 mb-2">❌ Error</h3>
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      {itinerary && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">✅ Generated Itinerary</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">{itinerary.overview.title}</h3>
              <p className="text-gray-600">{itinerary.overview.description}</p>
              <p><strong>Duration:</strong> {itinerary.overview.totalDays} days</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Daily Plan:</h4>
              {itinerary.days.map((day, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4 mb-3">
                  <h5 className="font-medium">Day {day.dayNumber}: {day.theme}</h5>
                  <p className="text-sm text-gray-600">{day.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <div className="mt-6 text-center">
        <Button asChild variant="outline">
          <a href="/cuddly-ai">← Back to Full Cuddly AI</a>
        </Button>
      </div>
    </div>
  )
}