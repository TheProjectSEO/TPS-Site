"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TravelPreferences } from "./types"
import { Calendar, Users, Heart, MapPin, Euro, Clock, Sparkles } from "lucide-react"

interface CuddlyAIFormProps {
  onSubmit: (preferences: TravelPreferences) => void
  isLoading: boolean
  hasSubmitted: boolean
}

const INTERESTS = [
  "Art & Museums", "Architecture", "Food & Wine", "History", "Shopping", 
  "Romance", "Photography", "Nightlife", "Parks & Gardens", "Culture",
  "Local Experiences", "Fashion", "Music", "Theater", "Cafes", "Markets"
]

const DIETARY_OPTIONS = [
  "Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-Free", "Lactose-Free"
]

export function CuddlyAIForm({ onSubmit, isLoading, hasSubmitted }: CuddlyAIFormProps) {
  const [preferences, setPreferences] = useState<Partial<TravelPreferences>>({
    location: "Paris",
    travelerType: "couple",
    groupSize: 2,
    travelStyle: "mid-range",
    budget: { range: "1000-2000", currency: "EUR" },
    pace: "moderate",
    interests: [],
    dietaryRestrictions: []
  })

  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])

  const handleInterestToggle = (interest: string) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest]
    
    setSelectedInterests(updated)
    setPreferences(prev => ({ ...prev, interests: updated }))
  }

  const handleDietaryToggle = (dietary: string) => {
    const updated = selectedDietary.includes(dietary)
      ? selectedDietary.filter(d => d !== dietary)
      : [...selectedDietary, dietary]
    
    setSelectedDietary(updated)
    setPreferences(prev => ({ ...prev, dietaryRestrictions: updated }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('📝 Form submitted with preferences:', preferences)
    console.log('🎯 Selected interests:', selectedInterests)
    
    // Validate required fields
    if (!preferences.startDate || !preferences.endDate || !preferences.travelerType) {
      console.error('❌ Form validation failed - missing required fields:', {
        startDate: preferences.startDate,
        endDate: preferences.endDate,
        travelerType: preferences.travelerType
      })
      alert('Please fill in all required fields: dates and traveler type')
      return
    }

    // Calculate duration
    const start = new Date(preferences.startDate)
    const end = new Date(preferences.endDate)
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    console.log('📅 Calculated duration:', duration, 'days')

    const completePreferences: TravelPreferences = {
      location: "Paris",
      startDate: preferences.startDate!,
      endDate: preferences.endDate!,
      duration,
      travelerType: preferences.travelerType!,
      groupSize: preferences.groupSize || 2,
      ages: preferences.ages,
      interests: selectedInterests.length > 0 ? selectedInterests : ["Culture", "Local Experiences"],
      travelStyle: preferences.travelStyle || "mid-range",
      budget: preferences.budget || { range: "1000-2000", currency: "EUR" },
      dietaryRestrictions: selectedDietary.length > 0 ? selectedDietary : undefined,
      accessibility: preferences.accessibility,
      pace: preferences.pace || "moderate",
      specialOccasions: preferences.specialOccasions,
      mustDo: preferences.mustDo,
      avoidances: preferences.avoidances
    }

    console.log('✅ Complete preferences object:', completePreferences)
    onSubmit(completePreferences)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dates Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Calendar className="w-5 h-5" />
          <h3 className="font-semibold text-lg">When are you traveling?</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={preferences.startDate || ""}
              onChange={(e) => setPreferences(prev => ({ ...prev, startDate: e.target.value }))}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={preferences.endDate || ""}
              onChange={(e) => setPreferences(prev => ({ ...prev, endDate: e.target.value }))}
              required
              min={preferences.startDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Travelers Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Users className="w-5 h-5" />
          <h3 className="font-semibold text-lg">Who's traveling?</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="travelerType">Traveler Type</Label>
            <Select 
              value={preferences.travelerType} 
              onValueChange={(value) => setPreferences(prev => ({ ...prev, travelerType: value as any }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo">Solo Traveler</SelectItem>
                <SelectItem value="couple">Couple</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="friends">Friends</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="groupSize">Group Size</Label>
            <Select 
              value={preferences.groupSize?.toString()} 
              onValueChange={(value) => setPreferences(prev => ({ ...prev, groupSize: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Number of people" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'person' : 'people'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="ages">Ages/Details (Optional)</Label>
          <Input
            id="ages"
            placeholder="e.g., Adults (25-35), Family with kids (8, 12)"
            value={preferences.ages || ""}
            onChange={(e) => setPreferences(prev => ({ ...prev, ages: e.target.value }))}
          />
        </div>
      </div>

      <Separator />

      {/* Interests Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Heart className="w-5 h-5" />
          <h3 className="font-semibold text-lg">What interests you?</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(interest => (
            <Badge
              key={interest}
              variant={selectedInterests.includes(interest) ? "default" : "outline"}
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleInterestToggle(interest)}
            >
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Budget & Style Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Euro className="w-5 h-5" />
          <h3 className="font-semibold text-lg">Budget & Style</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="budget">Budget Range</Label>
            <Select 
              value={preferences.budget?.range} 
              onValueChange={(value) => setPreferences(prev => ({ 
                ...prev, 
                budget: { ...prev.budget!, range: value as any }
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-500">Under €500</SelectItem>
                <SelectItem value="500-1000">€500 - €1,000</SelectItem>
                <SelectItem value="1000-2000">€1,000 - €2,000</SelectItem>
                <SelectItem value="2000-5000">€2,000 - €5,000</SelectItem>
                <SelectItem value="5000-plus">€5,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="travelStyle">Travel Style</Label>
            <Select 
              value={preferences.travelStyle} 
              onValueChange={(value) => setPreferences(prev => ({ ...prev, travelStyle: value as any }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget-Friendly</SelectItem>
                <SelectItem value="mid-range">Mid-Range</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="pace">Travel Pace</Label>
          <Select 
            value={preferences.pace} 
            onValueChange={(value) => setPreferences(prev => ({ ...prev, pace: value as any }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select pace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slow">Slow & Relaxed</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="packed">Packed & Active</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Special Requirements */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-semibold text-lg">Special Requirements</h3>
        </div>

        <div>
          <Label>Dietary Restrictions (Optional)</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {DIETARY_OPTIONS.map(dietary => (
              <Badge
                key={dietary}
                variant={selectedDietary.includes(dietary) ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleDietaryToggle(dietary)}
              >
                {dietary}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="specialOccasions">Special Occasions (Optional)</Label>
          <Input
            id="specialOccasions"
            placeholder="e.g., Anniversary, Birthday, Honeymoon"
            value={preferences.specialOccasions || ""}
            onChange={(e) => setPreferences(prev => ({ ...prev, specialOccasions: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="accessibility">Accessibility Needs (Optional)</Label>
          <Textarea
            id="accessibility"
            placeholder="Any mobility or accessibility requirements"
            value={preferences.accessibility || ""}
            onChange={(e) => setPreferences(prev => ({ ...prev, accessibility: e.target.value }))}
            rows={3}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <Button 
          type="submit" 
          size="lg" 
          className="w-full"
          disabled={isLoading || !preferences.startDate || !preferences.endDate}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Creating Your Perfect Itinerary...
            </>
          ) : hasSubmitted ? (
            "Regenerate Itinerary"
          ) : (
            "Create My Paris Itinerary"
          )}
        </Button>
      </div>
    </form>
  )
}