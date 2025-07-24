"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function CuddlyAITestPage() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testAPI = async () => {
    setLoading(true)
    setError(null)
    
    const testData = {
      startDate: "2025-02-01",
      endDate: "2025-02-03",
      duration: 2,
      travelerType: "couple",
      groupSize: 2,
      interests: ["Art & Museums", "Romance"],
      travelStyle: "mid-range",
      budget: { range: "1000-2000", currency: "EUR" },
      pace: "moderate"
    }
    
    try {
      console.log('🧪 Testing API with data:', testData)
      
      const apiResponse = await fetch("/api/cuddly-ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })

      console.log('📡 API Response status:', apiResponse.status)
      
      const data = await apiResponse.json()
      console.log('📄 API Response data:', data)
      
      if (apiResponse.ok) {
        setResponse(data)
      } else {
        setError(`API Error: ${apiResponse.status}`)
      }
    } catch (err) {
      console.error('❌ API Test Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">🤖 Cuddly AI - API Test Page</h1>
        <p className="text-gray-600">Test the Cuddly AI API directly</p>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API Test</h2>
        
        <Button 
          onClick={testAPI} 
          disabled={loading}
          className="mb-4"
        >
          {loading ? "Testing API..." : "🚀 Test Cuddly AI API"}
        </Button>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {response && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">✅ API Success!</h3>
              <p><strong>Success:</strong> {response.success ? 'Yes' : 'No'}</p>
              <p><strong>Has Itinerary:</strong> {response.itinerary ? 'Yes' : 'No'}</p>
              {response.itinerary && (
                <div className="mt-2">
                  <p><strong>Title:</strong> {response.itinerary.overview?.title}</p>
                  <p><strong>Days:</strong> {response.itinerary.overview?.totalDays}</p>
                  <p><strong>Budget:</strong> {response.itinerary.overview?.estimatedBudget}</p>
                </div>
              )}
            </div>

            {response.itinerary && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">📋 Generated Itinerary Overview</h3>
                <div className="space-y-2">
                  <p><strong>Title:</strong> {response.itinerary.overview.title}</p>
                  <p><strong>Description:</strong> {response.itinerary.overview.description}</p>
                  <p><strong>Total Days:</strong> {response.itinerary.overview.totalDays}</p>
                  <p><strong>Budget:</strong> {response.itinerary.overview.estimatedBudget}</p>
                  <div>
                    <strong>Highlights:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {response.itinerary.overview.highlights?.map((highlight: string, index: number) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Number of Days Planned:</strong> {response.itinerary.days?.length || 0}</p>
                </div>
              </Card>
            )}

            <details className="mt-4">
              <summary className="cursor-pointer font-medium text-gray-700">🔍 Raw API Response</summary>
              <pre className="mt-2 p-4 bg-gray-50 rounded-lg text-xs overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </Card>

      <div className="text-center">
        <Button 
          asChild
          variant="outline"
        >
          <a href="/cuddly-ai">← Back to Cuddly AI</a>
        </Button>
      </div>
    </div>
  )
}