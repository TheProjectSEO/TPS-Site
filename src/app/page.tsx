import { UnifiedHomepage } from '@/components/home/UnifiedHomepage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cuddly Nest - Eiffel Tower Tours & Paris Experiences',
  description: 'Book the best Eiffel Tower tours and Paris experiences. Skip-the-line tickets, summit access, guided tours and more. Trusted by over 5 million travelers.',
  keywords: 'Eiffel Tower tours, Paris experiences, skip the line tickets, summit access, guided tours, Cuddly Nest, Paris travel, France tours',
  openGraph: {
    title: 'Cuddly Nest - Eiffel Tower Tours & Paris Experiences',
    description: 'Book the best Eiffel Tower tours and Paris experiences. Skip-the-line tickets, summit access, guided tours and more.',
    images: ['/images/eiffel-tower.webp'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cuddly Nest - Eiffel Tower Tours & Paris Experiences',
    description: 'Book the best Eiffel Tower tours and Paris experiences. Skip-the-line tickets, summit access, guided tours and more.',
    images: ['/images/eiffel-tower.webp'],
  },
}

export default function Home() {
  return (
    <>
      {/* Preload critical resources */}
      <link 
        rel="preload" 
        href="/images/eiffel-tower.webp" 
        as="image" 
        fetchPriority="high"
      />
      <UnifiedHomepage />
    </>
  )
}