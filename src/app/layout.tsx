import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ConditionalHeader } from '@/components/layout/ConditionalHeader'
import { ConditionalFooter } from '@/components/layout/ConditionalFooter'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { CartProvider } from '@/components/providers/CartProvider'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { WebVitals } from '@/components/performance/WebVitals'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cuddly Nest - Eiffel Tower Tours & Paris Experiences',
  description: 'Book the best Eiffel Tower tours and Paris experiences. Skip-the-line tickets, summit access, guided tours and more. Trusted by over 5 million travelers.',
  keywords: 'Eiffel Tower tours, Paris experiences, skip the line tickets, summit access, guided tours, Cuddly Nest, Paris travel, France tours',
  authors: [{ name: 'Cuddly Nest' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Cuddly Nest - Eiffel Tower Tours & Paris Experiences',
    description: 'Book the best Eiffel Tower tours and Paris experiences. Skip-the-line tickets, summit access, guided tours and more.',
    type: 'website',
    siteName: 'Cuddly Nest',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cuddly Nest - Eiffel Tower Tours & Paris Experiences',
    description: 'Book the best Eiffel Tower tours and Paris experiences. Skip-the-line tickets, summit access, guided tours and more.',
  },
  alternates: {
    canonical: '/',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Schemas now managed at page level - no global schema conflicts */}
      </head>
      <body className={inter.className}>
        <WebVitals />
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <ConditionalHeader />
                <main className="flex-1">
                  {children}
                </main>
                <ConditionalFooter />
              </div>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}