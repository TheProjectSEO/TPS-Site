'use client'

import { useEffect } from 'react'
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

interface MetricData {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

function sendToAnalytics(metric: MetricData) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      id: metric.id
    })
  }

  // In production, you would send this to your analytics service
  // Example: Google Analytics, DataDog, New Relic, etc.
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_rating: metric.rating,
      metric_id: metric.id,
    })
  }
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Measure Core Web Vitals
    getCLS(sendToAnalytics)
    getFID(sendToAnalytics)
    getFCP(sendToAnalytics)
    getLCP(sendToAnalytics)
    getTTFB(sendToAnalytics)

    // Custom performance metrics
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Page Load Time
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
      console.log('Page Load Time:', loadTime + 'ms')

      // DOM Content Loaded
      const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
      console.log('DOM Content Loaded:', domContentLoaded + 'ms')

      // Time to Interactive (approximation)
      const timeToInteractive = performance.timing.domInteractive - performance.timing.navigationStart
      console.log('Time to Interactive:', timeToInteractive + 'ms')
    }
  }, [])

  // This component doesn't render anything
  return null
}

// Performance observer for monitoring long tasks
export function observeLongTasks() {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long Task detected:', {
              duration: Math.round(entry.duration),
              startTime: Math.round(entry.startTime),
              name: entry.name
            })
          }
        }
      })
      
      observer.observe({ entryTypes: ['longtask'] })
    } catch (error) {
      console.warn('Long task observer not supported')
    }
  }
}

// Memory usage monitoring
export function observeMemoryUsage() {
  if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (performance as any)) {
    const memory = (performance as any).memory
    console.log('Memory Usage:', {
      used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
    })
  }
}