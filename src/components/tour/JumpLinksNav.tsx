'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface JumpLinksNavProps {
  className?: string
}

const navItems = [
  { id: 'overview', label: 'Overview', color: 'text-secondary border-secondary' },
  { id: 'includes', label: 'Includes', color: 'text-accent border-accent' },
  { id: 'reviews', label: 'Reviews', color: 'text-primary border-primary' },
  { id: 'faqs', label: 'FAQs', color: 'text-secondary border-secondary' },
]

export function JumpLinksNav({ className }: JumpLinksNavProps) {
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id),
      }))

      const currentSection = sections.find(section => {
        if (!section.element) return false
        const rect = section.element.getBoundingClientRect()
        return rect.top <= 120 && rect.bottom >= 120
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Set initial active section

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -100 // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className={cn("sticky top-16 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-4", className)}>
      <nav className="flex space-x-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={cn(
              "text-sm font-medium transition-colors duration-200",
              activeSection === item.id
                ? `${item.color} border-b-2 pb-1`
                : "text-gray-600 hover:text-accent"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}