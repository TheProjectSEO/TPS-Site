'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Globe, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ca', name: 'Català', flag: '🏴󠁥󠁳󠁣󠁴󠁿' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
]

export function Footer() {
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0]

  return (
    <footer className="bg-slate-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Explore Column */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/tours/paris" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Paris
                </Link>
              </li>
              <li>
                <Link href="/tours/london" className="text-gray-300 hover:text-white transition-colors text-sm">
                  London
                </Link>
              </li>
              <li>
                <Link href="/tours/barcelona" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Barcelona
                </Link>
              </li>
              <li>
                <Link href="/tours/rome" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Rome
                </Link>
              </li>
              <li>
                <Link href="/tours/new-york" className="text-gray-300 hover:text-white transition-colors text-sm">
                  New York
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-gray-300 hover:text-white transition-colors text-sm">
                  All Destinations
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Cuddly Nest Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/responsible-disclosure" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Responsible Disclosure
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Newsroom
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/help/suppliers" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Help Center for Suppliers
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/app" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Cuddly Nest App
                </Link>
              </li>
            </ul>
          </div>

          {/* Partnerships Column */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Partnerships</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/suppliers" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Become a Supplier
                </Link>
              </li>
              <li>
                <Link href="/distributors" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Become a Distributor
                </Link>
              </li>
            </ul>
          </div>

          {/* App Downloads & Trustpilot Column */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* App Store Buttons */}
              <div className="space-y-3">
                <Link 
                  href="https://apps.apple.com/app/cuddly-nest" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-3 hover:bg-gray-800 transition-colors">
                    <div className="text-white">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-300">Download on the</div>
                      <div className="text-sm font-semibold text-white">App Store</div>
                    </div>
                  </div>
                </Link>

                <Link 
                  href="https://play.google.com/store/apps/details?id=com.cuddlynest" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-3 hover:bg-gray-800 transition-colors">
                    <div className="text-white">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-300">Get it on</div>
                      <div className="text-sm font-semibold text-white">Google Play</div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Download Stats */}
              <p className="text-xs text-gray-300">
                Downloaded by over 5,000,000 travelers
              </p>

              {/* Trustpilot */}
              <div className="pt-2">
                <Link 
                  href="https://www.trustpilot.com/review/cuddlynest.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <span className="text-green-400 text-sm mr-1">★</span>
                      <span className="text-white text-sm font-semibold">Trustpilot</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-green-400 text-sm">★</span>
                    ))}
                    <span className="text-xs text-gray-300 ml-2">4.9</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    TrustScore 4.9 | 51,716 reviews
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="border-t border-slate-600 pt-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white hover:bg-slate-600 text-sm font-normal px-3 py-2"
              >
                <Globe className="w-4 h-4 mr-2" />
                <span className="mr-1">{currentLanguage.flag}</span>
                {currentLanguage.name}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 max-h-64 overflow-y-auto bg-slate-700 border-slate-600">
              <DropdownMenuRadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage}>
                {languages.map((language) => (
                  <DropdownMenuRadioItem 
                    key={language.code} 
                    value={language.code}
                    className="text-gray-300 hover:text-white hover:bg-slate-600 focus:bg-slate-600 focus:text-white text-sm cursor-pointer"
                  >
                    <span className="mr-2">{language.flag}</span>
                    {language.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-600 pt-6 mt-6">
          <p className="text-gray-400 text-xs text-center">
            © {new Date().getFullYear()} Cuddly Nest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}