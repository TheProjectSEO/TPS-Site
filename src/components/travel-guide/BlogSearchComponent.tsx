'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

interface SearchResult {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  highlighted_text: string
  match_count: number
}

interface BlogSearchComponentProps {
  blogId: string
  content: string
  onSearchResults?: (results: SearchResult[]) => void
}

export function BlogSearchComponent({ blogId, content, onSearchResults }: BlogSearchComponentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [highlightedContent, setHighlightedContent] = useState(content)

  useEffect(() => {
    if (searchTerm.trim()) {
      performSearch(searchTerm)
    } else {
      setSearchResults([])
      setHighlightedContent(content)
    }
  }, [searchTerm, content])

  const performSearch = (term: string) => {
    const searchRegex = new RegExp(term, 'gi')
    const matches = content.match(searchRegex)
    
    if (matches) {
      // Highlight search terms in content
      const highlighted = content.replace(searchRegex, `<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$&</mark>`)
      setHighlightedContent(highlighted)

      // Find contextual excerpts
      const sentences = content.split(/[.!?]+/)
      const matchingSentences = sentences.filter(sentence => 
        sentence.toLowerCase().includes(term.toLowerCase())
      )

      const results: SearchResult[] = matchingSentences.slice(0, 5).map((sentence, index) => ({
        id: `${blogId}-${index}`,
        title: `Match ${index + 1}`,
        excerpt: sentence.trim(),
        content: sentence.trim(),
        slug: `#search-result-${index}`,
        highlighted_text: sentence.replace(searchRegex, `<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$&</mark>`),
        match_count: (sentence.match(searchRegex) || []).length
      }))

      setSearchResults(results)
      onSearchResults?.(results)
    } else {
      setSearchResults([])
      setHighlightedContent(content)
      onSearchResults?.([])
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSearchResults([])
    setHighlightedContent(content)
    setIsSearchOpen(false)
    onSearchResults?.([])
  }

  const scrollToResult = (index: number) => {
    // Scroll to the highlighted text in the content
    const element = document.getElementById(`search-result-${index}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="relative">
      {/* Search Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className="mb-4"
      >
        <Search className="h-4 w-4 mr-2" />
        Search in this guide
      </Button>

      {/* Search Interface */}
      {isSearchOpen && (
        <Card className="mb-6 border-primary/20 shadow-brand-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search within this guide..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus:ring-primary focus:border-primary"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Results */}
            {searchTerm && (
              <div className="space-y-2">
                {searchResults.length > 0 ? (
                  <>
                    <p className="text-sm text-primary font-medium mb-3">
                      Found {searchResults.length} matches for "{searchTerm}"
                    </p>
                    {searchResults.map((result, index) => (
                      <div
                        key={result.id}
                        onClick={() => scrollToResult(index)}
                        className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div 
                          className="text-sm text-gray-700 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: result.highlighted_text }}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {result.match_count} match{result.match_count > 1 ? 'es' : ''}
                        </p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    No matches found for "{searchTerm}"
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Highlighted Content Display */}
      {searchTerm && (
        <div className="hidden">
          <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />
        </div>
      )}
    </div>
  )
}