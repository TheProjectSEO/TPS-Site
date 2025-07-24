export interface TravelPreferences {
  // Location is fixed to Paris for now
  location: "Paris"
  
  // When - dates and duration
  startDate: string
  endDate: string
  duration: number
  
  // Who - traveler type and group size
  travelerType: "solo" | "couple" | "family" | "friends" | "business"
  groupSize: number
  ages?: string // e.g., "Adults (25-35)" or "Family with kids (8, 12)"
  
  // Travel themes and interests
  interests: string[]
  travelStyle: "budget" | "mid-range" | "luxury" | "mixed"
  
  // Budget
  budget: {
    range: "under-500" | "500-1000" | "1000-2000" | "2000-5000" | "5000-plus"
    currency: "EUR" | "USD" | "GBP"
  }
  
  // Special preferences
  dietaryRestrictions?: string[]
  accessibility?: string
  pace: "slow" | "moderate" | "packed"
  
  // Additional context
  specialOccasions?: string
  mustDo?: string[]
  avoidances?: string[]
}

export interface ItineraryItem {
  time: string
  title: string
  description: string
  location: string
  duration: string
  type: "attraction" | "restaurant" | "tour" | "activity" | "transport" | "rest"
  tags: string[]
  recommendedProducts?: RecommendedProduct[]
  tips?: string[]
}

export interface ItineraryDay {
  date: string
  dayNumber: number
  theme: string
  items: ItineraryItem[]
  summary: string
}

export interface RecommendedProduct {
  id: string
  title: string
  type: "tour" | "experience" | "ticket"
  price: string
  duration: string
  rating: number
  reviewCount: number
  image: string
  slug: string
  highlights: string[]
}

export interface ItineraryData {
  overview: {
    title: string
    description: string
    totalDays: number
    estimatedBudget: string
    highlights: string[]
  }
  days: ItineraryDay[]
  recommendations: {
    restaurants: RecommendedProduct[]
    tours: RecommendedProduct[]
    experiences: RecommendedProduct[]
  }
  tips: {
    transportation: string[]
    budgeting: string[]
    cultural: string[]
    practical: string[]
  }
}

export interface ChatMessage {
  id: string
  type: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  isStreaming?: boolean
}