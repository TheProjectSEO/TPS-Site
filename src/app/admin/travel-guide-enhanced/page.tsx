'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { travelGuideService, TravelGuideData } from '@/lib/supabase/travelGuideService'

export default function EnhancedTravelGuideAdminPage() {
  const [guides, setGuides] = useState<TravelGuideData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    fetchGuides()
  }, [])

  const fetchGuides = async () => {
    try {
      setLoading(true)
      const data = await travelGuideService.getAllTravelGuides()
      setGuides(data)
    } catch (error) {
      console.error('Error fetching travel guides:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.destination.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && guide.published) ||
                         (filterStatus === 'draft' && !guide.published)
    
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this travel guide?')) {
      try {
        await travelGuideService.deleteTravelGuide(id)
        fetchGuides()
      } catch (error) {
        console.error('Error deleting travel guide:', error)
      }
    }
  }

  const togglePublished = async (id: string, published: boolean) => {
    try {
      await travelGuideService.updateTravelGuide(id, { 
        published: !published,
        published_at: !published ? new Date().toISOString() : null
      })
      fetchGuides()
    } catch (error) {
      console.error('Error updating travel guide:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600 font-medium">Loading travel guides...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Enhanced Travel Guides</h1>
            <p className="text-secondary font-medium mt-2">
              Manage your comprehensive travel guide content with CMS integration
            </p>
          </div>
          <Link href="/admin/travel-guide-enhanced/new">
            <Button className="bg-gradient-primary text-white shadow-brand-sm hover:shadow-brand-md">
              <Plus className="h-4 w-4 mr-2" />
              Create New Guide
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-brand">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Guides</p>
                  <p className="text-2xl font-bold text-primary">{guides.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-brand">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Published</p>
                  <p className="text-2xl font-bold text-secondary">
                    {guides.filter(g => g.published).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-brand">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Drafts</p>
                  <p className="text-2xl font-bold text-accent">
                    {guides.filter(g => !g.published).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center">
                  <Edit className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="card-brand mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search guides by title or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px]">
                    <Filter className="h-4 w-4 mr-2" />
                    {filterStatus === 'all' ? 'All' : 
                     filterStatus === 'published' ? 'Published' : 'Drafts'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    All Guides
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('published')}>
                    Published
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('draft')}>
                    Drafts
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Travel Guides Table */}
        <Card className="card-brand">
          <CardHeader>
            <CardTitle className="text-primary">
              Travel Guides ({filteredGuides.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guide</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuides.map((guide) => (
                  <TableRow key={guide.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          {guide.featured_image && (
                            <img
                              src={guide.featured_image}
                              alt={guide.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{guide.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {guide.excerpt}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-primary border-primary">
                        {guide.destination}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={guide.published ? "default" : "secondary"}
                        className={guide.published ? 
                          "bg-green-100 text-green-800" : 
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {guide.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {guide.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {guide.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{guide.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {guide.published_at ? 
                        new Date(guide.published_at).toLocaleDateString() : 
                        'Not published'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublished(guide.id, guide.published)}
                          className="text-xs"
                        >
                          {guide.published ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Link href={`/admin/travel-guide-enhanced/edit/${guide.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(guide.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {guide.published && (
                          <Link href={`/travel-guide/${guide.slug}`} target="_blank">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredGuides.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No travel guides found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first travel guide to get started'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}