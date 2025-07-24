import { NextRequest, NextResponse } from "next/server"
import { TravelPreferences, ItineraryData, RecommendedProduct } from "@/components/cuddly-ai/types"
import { geminiModel } from "@/lib/gemini"
import { RAGContentService } from "@/lib/services/ragContentService"

// Real product data using existing database tour slugs
const FALLBACK_PRODUCTS: RecommendedProduct[] = [
  {
    id: "1",
    title: "Eiffel Tower Guided Tour",
    type: "ticket",
    price: "€39.90",
    duration: "2-3 hours", 
    rating: 4.7,
    reviewCount: 42341,
    image: "/images/eiffel-tower.webp",
    slug: "eiffel-tower-guided-tour",
    highlights: ["Skip the Line", "Expert Guide", "Audio Guide"]
  },
  {
    id: "2",
    title: "Eiffel Tower River Cruise Combo",
    type: "tour",
    price: "€89.00",
    duration: "2.5 hours",
    rating: 4.7,
    reviewCount: 15623,
    image: "/images/photo_realistic_wide_angle_shot_of_a_luxury_seine_20250722_174129.webp",
    slug: "eiffel-tower-river-cruise-combo", 
    highlights: ["Eiffel Tower", "Seine River", "City Views"]
  },
  {
    id: "3",
    title: "Eiffel Tower Sunset Tour",
    type: "experience",
    price: "€38.50",
    duration: "2 hours",
    rating: 4.6,
    reviewCount: 28471,
    image: "/images/photo_realistic_evening_shot_of_an_elegantly_set_d_20250722_174114.webp",
    slug: "eiffel-tower-sunset-tour",
    highlights: ["Golden Hour", "Romantic Views", "Photography"]
  }
]

async function generateItineraryWithGemini(preferences: TravelPreferences): Promise<ItineraryData> {
  // Initialize RAG service to get real content
  const ragService = new RAGContentService()
  
  // Get recommendations based on user interests and budget
  const [interestBasedContent, budgetBasedContent, allExperiences, categories, blogPosts] = await Promise.all([
    ragService.getRecommendationsByInterests(preferences.interests),
    ragService.getRecommendationsByBudget(preferences.budget.range),
    ragService.getExperienceContent(),
    ragService.getCategoryContent(),
    ragService.getBlogContent()
  ])

  // Combine and deduplicate content
  const combinedContent = [...interestBasedContent, ...budgetBasedContent]
  const uniqueContent = combinedContent.filter((item, index, arr) => 
    arr.findIndex(i => i.id === item.id) === index
  )

  // Convert RAG content to experience format for prompt
  const availableExperiences = uniqueContent.slice(0, 20).map(content => ({
    title: content.title,
    description: content.description,
    price: content.metadata.price || "Price on request",
    rating: content.metadata.rating || 4.5,
    duration: content.metadata.duration || "2-3 hours",
    highlights: content.metadata.highlights || ["Popular attraction"],
    slug: content.slug,
    url: content.url,
    type: content.type,
    image: content.metadata.image
  }))

  // Also include fallback products if we don't have enough content
  const fallbackExperiences = FALLBACK_PRODUCTS.map(exp => ({
    title: exp.title,
    description: `Experience ${exp.title} - ${exp.highlights.join(', ')}`,
    price: exp.price,
    rating: exp.rating,
    duration: exp.duration,
    highlights: exp.highlights,
    slug: exp.slug,
    url: `/tour/${exp.slug}`,
    type: 'experience' as const,
    image: exp.image
  }))

  const contextData = {
    availableExperiences: [...availableExperiences, ...fallbackExperiences].slice(0, 25),
    blogPosts: blogPosts.slice(0, 10).map(post => ({
      title: post.title,
      description: post.description,
      url: post.url,
      category: post.metadata.category
    })),
    categories: categories.slice(0, 10).map(cat => ({
      name: cat.title,
      description: cat.description,
      url: cat.url
    }))
  }

  const prompt = `You are Cuddly AI, an expert Paris travel assistant. Create a detailed, personalized ${preferences.duration}-day Paris itinerary.

**User Preferences:**
- Travel Dates: ${preferences.startDate} to ${preferences.endDate} (${preferences.duration} days)
- Traveler Type: ${preferences.travelerType}
- Group Size: ${preferences.groupSize}
- Interests: ${preferences.interests.join(', ')}
- Travel Style: ${preferences.travelStyle}
- Budget Range: ${preferences.budget.range} ${preferences.budget.currency}
- Travel Pace: ${preferences.pace}
- Dietary Restrictions: ${preferences.dietaryRestrictions?.join(', ') || 'None'}
- Special Occasions: ${preferences.specialOccasions || 'None'}

**Available Experiences:**
${JSON.stringify(contextData.availableExperiences, null, 2)}

**Available Travel Guide Articles:**
${JSON.stringify(contextData.blogPosts, null, 2)}

**Tour Categories:**
${JSON.stringify(contextData.categories, null, 2)}

**IMPORTANT GUIDELINES:**
1. Create a realistic day-by-day itinerary
2. Include specific times and locations
3. Match recommendations to user interests and budget
4. **PRIORITIZE using experiences from the available list when relevant - these are real, bookable tours**
5. Reference travel guide articles when providing tips or background information
6. Suggest relevant tour categories for additional exploration
7. Include practical tips

Return ONLY a valid JSON response in this exact format:
{
  "overview": {
    "title": "Your Perfect ${preferences.duration}-Day Paris Adventure",
    "description": "Brief description highlighting key themes based on user interests",
    "totalDays": ${preferences.duration},
    "estimatedBudget": "€500 - €1,500",
    "highlights": ["Eiffel Tower", "Art & Museums", "Seine River", "Local Cuisine", "Historic Districts"]
  },
  "days": [
    {
      "date": "Monday, February 3, 2025",
      "dayNumber": 1,
      "theme": "Classic Paris Icons",
      "summary": "Start your Paris adventure with iconic landmarks and stunning views",
      "items": [
        {
          "time": "9:00 AM",
          "title": "Eiffel Tower Visit",
          "description": "Begin your Paris adventure at the iconic Eiffel Tower. Take the elevator to the summit for breathtaking views of the city.",
          "location": "Champ de Mars, 7th Arrondissement",
          "duration": "2-3 hours",
          "type": "attraction",
          "tags": ["Must-see", "Photography", "Views"],
          "recommendedProducts": [
            {
              "id": "1",
              "title": "Eiffel Tower Summit Access",
              "type": "ticket",
              "price": "€29.40",
              "duration": "2-3 hours",
              "rating": 4.5,
              "reviewCount": 42341,
              "image": "/images/eiffel-tower-summit-access.webp",
              "slug": "eiffel-tower-summit-access",
              "highlights": ["Skip the Line", "Summit Access", "Audio Guide"]
            }
          ],
          "tips": ["Book skip-the-line tickets in advance", "Visit early morning for fewer crowds", "Bring a camera for stunning photos"]
        },
        {
          "time": "12:30 PM",
          "title": "Lunch at Café de Flore",
          "description": "Enjoy authentic French cuisine at this historic café in Saint-Germain-des-Prés, beloved by writers and artists.",
          "location": "Saint-Germain-des-Prés",
          "duration": "1.5 hours",
          "type": "restaurant",
          "tags": ["French Cuisine", "Historic", "Culture"],
          "tips": ["Try the famous onion soup", "Make a reservation", "People-watch from the terrace"]
        },
        {
          "time": "7:00 PM",
          "title": "Seine River Evening Cruise",
          "description": "End your first day with a romantic evening cruise along the Seine, viewing Paris landmarks illuminated at night.",
          "location": "Port de la Bourdonnais",
          "duration": "2.5 hours",
          "type": "tour",
          "tags": ["Romance", "Night Views", "Relaxation"],
          "recommendedProducts": [
            {
              "id": "2",
              "title": "Seine River Cruise with Dinner",
              "type": "tour",
              "price": "€89.00",
              "duration": "2.5 hours",
              "rating": 4.7,
              "reviewCount": 15623,
              "image": "/images/photo_realistic_wide_angle_shot_of_a_luxury_seine_20250722_174129.webp",
              "slug": "seine-river-dinner-cruise",
              "highlights": ["Fine Dining", "City Views", "Live Music"]
            }
          ],
          "tips": ["Dress elegantly for dinner cruise", "Bring a light jacket", "Book sunset timing for best views"]
        }
      ]
    }
  ],
  "recommendations": {
    "restaurants": [],
    "tours": [],
    "experiences": []
  },
  "tips": {
    "transportation": ["Purchase a weekly Navigo pass for unlimited metro/bus travel", "Download Citymapper app for navigation", "Most attractions are walkable with comfortable shoes"],
    "budgeting": ["Many museums free first Sunday of each month", "Look for prix fixe lunch menus", "Book skip-the-line tickets online to save time"],
    "cultural": ["Learn basic French phrases", "Wait to be seated at restaurants", "Keep hands visible on table while dining"],
    "practical": ["Be aware of pickpockets near tourist areas", "Restaurants serve dinner after 7:30 PM", "Most shops close Sundays and Monday mornings"]
  }
}`

  try {
    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean up the response to extract JSON
    let jsonText = text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '')
    }
    
    const itineraryData = JSON.parse(jsonText)
    return itineraryData
    
  } catch (error) {
    console.error('Error generating itinerary with Gemini:', error)
    // Return a simple fallback itinerary
    return generateFallbackItinerary(preferences)
  }
}

function generateFallbackItinerary(preferences: TravelPreferences): ItineraryData {
  return {
    overview: {
      title: `Your Perfect ${preferences.duration}-Day Paris Adventure`,
      description: `A carefully crafted ${preferences.travelStyle} itinerary for ${preferences.travelerType} travelers, featuring ${preferences.interests.slice(0, 2).join(" and ")} experiences.`,
      totalDays: preferences.duration,
      estimatedBudget: "€800 - €1,200",
      highlights: ["Eiffel Tower", "Art & Museums", "Seine River", "Local Cuisine", "Historic Districts"]
    },
    days: [
      {
        date: new Date(preferences.startDate).toLocaleDateString('en-US', { 
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        }),
        dayNumber: 1,
        theme: "Classic Paris Icons",
        summary: "Start your Paris adventure with iconic landmarks and stunning city views.",
        items: [
          {
            time: "9:00 AM",
            title: "Eiffel Tower Visit",
            description: "Begin your Paris adventure at the iconic Eiffel Tower. Take the elevator to the summit for breathtaking views of the city.",
            location: "Champ de Mars, 7th Arrondissement",
            duration: "2-3 hours",
            type: "attraction",
            tags: ["Must-see", "Photography", "Views"],
            recommendedProducts: [FALLBACK_PRODUCTS[0]],
            tips: ["Book skip-the-line tickets in advance", "Visit early morning for fewer crowds"]
          },
          {
            time: "1:00 PM",
            title: "Lunch at Traditional Bistro",
            description: "Enjoy authentic French cuisine at a charming local bistro in the heart of Paris.",
            location: "Saint-Germain-des-Prés",
            duration: "1.5 hours", 
            type: "restaurant",
            tags: ["French Cuisine", "Local Experience"],
            tips: ["Try the daily specials", "Practice your French"]
          },
          {
            time: "7:00 PM",
            title: "Seine River Evening Cruise",
            description: "End your day with a romantic evening cruise along the Seine, viewing illuminated landmarks.",
            location: "Port de la Bourdonnais",
            duration: "2.5 hours",
            type: "tour",
            tags: ["Romance", "Night Views", "Relaxation"],
            recommendedProducts: [FALLBACK_PRODUCTS[1]],
            tips: ["Dress warmly for evening", "Bring a camera"]
          }
        ]
      }
    ],
    recommendations: {
      restaurants: [],
      tours: FALLBACK_PRODUCTS.filter(p => p.type === "tour"),
      experiences: FALLBACK_PRODUCTS.filter(p => p.type === "experience")
    },
    tips: {
      transportation: ["Use the metro for quick travel", "Walk when possible to see more", "Download a metro map app"],
      budgeting: ["Book tours in advance for better prices", "Eat lunch at local bistros", "Visit free attractions"],
      cultural: ["Learn basic French phrases", "Respect local dining customs", "Dress appropriately for venues"],
      practical: ["Keep valuables secure", "Carry cash for small vendors", "Check opening hours before visiting"]
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const preferences: TravelPreferences = await request.json()
    
    // Validate required fields
    if (!preferences.startDate || !preferences.endDate || !preferences.travelerType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    console.log('Generating itinerary for preferences:', preferences)

    // Generate itinerary with Gemini AI
    const itinerary = await generateItineraryWithGemini(preferences)
    
    return NextResponse.json({
      success: true,
      itinerary
    })
    
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    )
  }
}