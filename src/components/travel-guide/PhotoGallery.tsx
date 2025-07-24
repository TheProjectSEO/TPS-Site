'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GalleryImage {
  id: string
  image_url: string
  alt_text?: string
  caption?: string
  position: number
}

interface PhotoGalleryProps {
  images: GalleryImage[]
  title?: string
}

export function PhotoGallery({ images, title = "Photo Gallery" }: PhotoGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return
      
      if (e.key === 'Escape') {
        setSelectedImageIndex(null)
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1)
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIndex, images.length])

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImageIndex(null)
  }

  const nextCarouselSlide = () => {
    setCurrentCarouselIndex(prev => 
      prev >= images.length - 1 ? 0 : prev + 1
    )
  }

  const prevCarouselSlide = () => {
    setCurrentCarouselIndex(prev => 
      prev <= 0 ? images.length - 1 : prev - 1
    )
  }

  if (!images || images.length === 0) {
    return null
  }

  const renderMobileCarousel = () => (
    <div className="relative">
      <div className="overflow-hidden rounded-xl">
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentCarouselIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div 
              key={image.id || index} 
              className="w-full flex-shrink-0 relative aspect-square cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={image.image_url}
                alt={image.alt_text || `Gallery image ${index + 1}`}
                fill
                className="object-cover"
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
              
              {/* Alt text on hover - mobile */}
              {image.alt_text && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm">{image.alt_text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={prevCarouselSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full p-0 bg-white/90 hover:bg-white shadow-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextCarouselSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full p-0 bg-white/90 hover:bg-white shadow-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCarouselIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentCarouselIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )

  const renderDesktopGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image, index) => (
        <div 
          key={image.id || index} 
          className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer shadow-lg"
          onClick={() => openLightbox(index)}
          title={image.alt_text}
        >
          <Image
            src={image.image_url}
            alt={image.alt_text || `Gallery image ${index + 1}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Camera className="h-10 w-10 text-white" />
          </div>
          
          {/* Alt text on hover - desktop */}
          {image.alt_text && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm line-clamp-2">{image.alt_text}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <section id="gallery" className="mb-20">
      <h2 className="text-2xl font-semibold text-primary mb-8 text-center">{title}</h2>
      <div className="max-w-6xl mx-auto">
        {isMobile ? renderMobileCarousel() : renderDesktopGrid()}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="relative">
              <Image
                src={images[selectedImageIndex].image_url}
                alt={images[selectedImageIndex].alt_text || `Gallery image ${selectedImageIndex + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />
              
              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  
                  <button
                    onClick={() => setSelectedImageIndex(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>
            
            {/* Image info at bottom */}
            <div className="text-white text-center mt-4 space-y-2">
              {images[selectedImageIndex].alt_text && (
                <p className="text-lg font-medium">{images[selectedImageIndex].alt_text}</p>
              )}
              {images[selectedImageIndex].caption && (
                <p className="text-sm text-gray-300">{images[selectedImageIndex].caption}</p>
              )}
              <p className="text-xs text-gray-400">
                {selectedImageIndex + 1} of {images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}