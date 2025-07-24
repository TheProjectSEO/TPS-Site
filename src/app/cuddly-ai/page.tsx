import { Metadata } from "next"
import { CuddlyAIInterface } from "@/components/cuddly-ai/CuddlyAIInterface"

export const metadata: Metadata = {
  title: "Cuddly AI - Your Personal Paris Itinerary Assistant",
  description: "Create personalized Paris itineraries with our AI-powered travel planner. Get recommendations for tours, experiences, and attractions tailored to your preferences.",
  keywords: "Paris itinerary, AI travel planner, Paris tours, travel recommendations, personalized travel",
  openGraph: {
    title: "Cuddly AI - Your Personal Paris Itinerary Assistant",
    description: "Create personalized Paris itineraries with our AI-powered travel planner. Get recommendations for tours, experiences, and attractions tailored to your preferences.",
    type: "website",
  },
}

export default function CuddlyAIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              🤖 Cuddly AI
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your personal AI travel assistant for creating perfect Paris itineraries
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <CuddlyAIInterface />
      </div>
    </div>
  )
}