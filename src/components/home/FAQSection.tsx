'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface FAQ {
  id: string
  question: string
  answer: string
  sort_order: number
  enabled: boolean
}

interface FAQSectionProps {
  overrideData?: {
    title: string
    subtitle: string
  }
}

export function FAQSection({ overrideData }: FAQSectionProps = {}) {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [sectionSettings, setSectionSettings] = useState({
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about our experiences and services',
    enabled: true
  })

  useEffect(() => {
    fetchFAQs()
  }, [overrideData])

  const fetchFAQs = async () => {
    try {
      const supabase = createClient()
      
      // Use override data if provided
      if (overrideData) {
        setSectionSettings(prev => ({
          ...prev,
          title: overrideData.title,
          description: overrideData.subtitle,
          enabled: true
        }))
      } else {
        // Fetch section settings
        const { data: settingsData } = await supabase
          .from('homepage_settings')
          .select('*')
          .eq('section_name', 'faq_section')
          .single()

        if (settingsData) {
          setSectionSettings({
            title: settingsData.title || 'Frequently Asked Questions',
            description: settingsData.description || 'Find answers to common questions about our experiences and services',
            enabled: settingsData.enabled !== false
          })
        }
      }

      // Fetch only general FAQs (not product-specific) for homepage
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('enabled', true)
        .is('experience_id', null) // Only show general FAQs, not product-specific ones
        .order('sort_order')
        .limit(8) // Limit to maximum 8 FAQs on homepage

      if (error) {
        console.error('Error fetching FAQs:', error)
      } else {
        setFaqs(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading FAQs...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!sectionSettings.enabled) {
    return null
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-accent mb-3 md:mb-4">
            {sectionSettings.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            {sectionSettings.description}
          </p>
        </div>

        {faqs.length > 0 ? (
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={faq.id} 
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full p-5 md:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group"
                >
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 pr-4 group-hover:text-purple-600 transition-colors">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 ml-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      expandedItems.has(faq.id) 
                        ? 'bg-purple-100 text-purple-600 rotate-180' 
                        : 'bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>
                
                {expandedItems.has(faq.id) && (
                  <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                    <div className="border-t border-gray-100 pt-4">
                      <div className="text-gray-700 leading-relaxed text-sm md:text-base">
                        {faq.answer.split('\n').map((line, idx) => (
                          <p key={idx} className={idx > 0 ? 'mt-3' : ''}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <p className="text-gray-600">No FAQs available at the moment.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}