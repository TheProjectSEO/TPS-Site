import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface CategoryCardProps {
  category: {
    id: string
    name: string
    slug: string
    description?: string
    image_url?: string
    icon?: string
    color?: string
    experience_count?: number
    featured?: boolean
  }
  className?: string
  showExperienceCount?: boolean
}

export function CategoryCard({ 
  category, 
  className = '',
  showExperienceCount = true 
}: CategoryCardProps) {
  const {
    id,
    name,
    slug,
    description,
    image_url,
    icon,
    color,
    experience_count = 0,
    featured
  } = category

  return (
    <Card className={`group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/category/${slug}`}>
            <div className="relative h-48 overflow-hidden">
              {image_url ? (
                <Image
                  src={image_url}
                  alt={name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: color || '#f3f4f6' }}
                >
                  {icon ? (
                    <span className="text-4xl">{icon}</span>
                  ) : (
                    <Tag className="h-12 w-12 text-gray-400" />
                  )}
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Featured Badge */}
              {featured && (
                <Badge className="absolute top-3 left-3 bg-primary text-white">
                  Featured
                </Badge>
              )}

              {/* Experience Count */}
              {showExperienceCount && experience_count > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute top-3 right-3 bg-white/90 text-gray-900"
                >
                  {experience_count} tours
                </Badge>
              )}

              {/* Category Name Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-primary-light transition-colors">
                  {name}
                </h3>
                {description && (
                  <p className="text-white/90 text-sm line-clamp-2">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1 group-hover:text-primary transition-colors">
                {name}
              </h4>
              {description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {description}
                </p>
              )}
              {showExperienceCount && experience_count > 0 && (
                <p className="text-xs text-gray-500">
                  {experience_count} experience{experience_count !== 1 ? 's' : ''} available
                </p>
              )}
            </div>
            <Link href={`/category/${slug}`}>
              <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}