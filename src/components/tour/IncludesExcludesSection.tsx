'use client'

import { useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface IncludeExclude {
  id: string
  type: 'include' | 'exclude'
  item: string
  sort_order: number
}

interface IncludesExcludesSectionProps {
  experienceId: string
  className?: string
}

export function IncludesExcludesSection({ experienceId, className = '' }: IncludesExcludesSectionProps) {
  const [items, setItems] = useState<IncludeExclude[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIncludesExcludes = async () => {
      try {
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('experience_includes_excludes')
          .select('*')
          .eq('experience_id', experienceId)
          .order('type', { ascending: true }) // includes first, then excludes
          .order('sort_order', { ascending: true })

        if (error) {
          console.error('Error fetching includes/excludes:', error)
        } else {
          setItems(data || [])
        }
      } catch (error) {
        console.error('Error fetching includes/excludes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchIncludesExcludes()
  }, [experienceId])

  if (loading) {
    return (
      <div className={className}>
        <h2 className="text-2xl font-bold mb-6 text-primary">What's Included</h2>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const includes = items.filter(item => item.type === 'include')
  const excludes = items.filter(item => item.type === 'exclude')

  // Fallback data if no items found in database
  const defaultIncludes = [
    'Entry tickets',
    'Professional guide',
    'Audio guide (multiple languages)',
    'Skip-the-line access'
  ]

  const defaultExcludes = [
    'Transportation to meeting point',
    'Food and drinks',
    'Gratuities',
    'Personal expenses'
  ]

  const finalIncludes = includes.length > 0 ? includes : defaultIncludes.map((item, index) => ({
    id: `default-include-${index}`,
    type: 'include' as const,
    item,
    sort_order: index
  }))

  const finalExcludes = excludes.length > 0 ? excludes : defaultExcludes.map((item, index) => ({
    id: `default-exclude-${index}`,
    type: 'exclude' as const,
    item,
    sort_order: index
  }))

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-6 text-accent">What's Included</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-secondary">Included</h3>
          <ul className="space-y-2">
            {finalIncludes.map((include) => (
              <li key={include.id} className="flex items-start">
                <Check className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                <span>{include.item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3 text-red-700">Not Included</h3>
          <ul className="space-y-2">
            {finalExcludes.map((exclude) => (
              <li key={exclude.id} className="flex items-start">
                <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>{exclude.item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}