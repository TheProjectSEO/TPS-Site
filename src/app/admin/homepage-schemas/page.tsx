'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SchemaEditor } from '@/components/admin/SchemaEditor'
import { Badge } from '@/components/ui/badge'
import { Save, RefreshCw } from 'lucide-react'

interface HomepageSchema {
  id: string
  page_section: string
  custom_schema: any
  enabled: boolean
  created_at: string
  updated_at: string
}

const HOMEPAGE_SECTIONS = [
  { key: 'global', name: 'Global Organization Schema', description: 'Site-wide organization and business data' },
  { key: 'hero', name: 'Hero Section Schema', description: 'Schema for the homepage hero section' },
  { key: 'featured', name: 'Featured Content Schema', description: 'Schema for featured tours and destinations' },
  { key: 'testimonials', name: 'Testimonials Schema', description: 'Schema for customer reviews and ratings' }
]

export default function HomepageSchemas() {
  const [schemas, setSchemas] = useState<Record<string, HomepageSchema>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState('')
  const [activeSection, setActiveSection] = useState('global')

  useEffect(() => {
    fetchSchemas()
  }, [])

  const fetchSchemas = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('homepage_schemas')
        .select('*')

      if (error) {
        console.error('Error fetching schemas:', error)
        // Don't return early - set empty schemas map
      }

      const schemasMap: Record<string, HomepageSchema> = {}
      if (data && Array.isArray(data)) {
        data.forEach(schema => {
          schemasMap[schema.page_section] = schema
        })
      }

      setSchemas(schemasMap)
    } catch (error) {
      console.error('Error:', error)
      // Set empty schemas map on error
      setSchemas({})
    } finally {
      setLoading(false)
    }
  }

  const handleSchemaChange = (section: string, schemaJson: string | null) => {
    setSchemas(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        custom_schema: schemaJson ? JSON.parse(schemaJson) : null
      }
    }))
  }

  const saveSchema = async (section: string) => {
    setSaving(section)
    try {
      const supabase = createClient()
      const schema = schemas[section]
      
      const upsertData = {
        page_section: section,
        custom_schema: schema?.custom_schema || null,
        enabled: true,
        updated_at: new Date().toISOString()
      }

      if (schema?.id) {
        // Update existing
        const { error } = await supabase
          .from('homepage_schemas')
          .update(upsertData)
          .eq('id', schema.id)

        if (error) throw error
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('homepage_schemas')
          .insert({
            ...upsertData,
            created_at: new Date().toISOString()
          })
          .select()
          .single()

        if (error) throw error
        
        setSchemas(prev => ({
          ...prev,
          [section]: data
        }))
      }

      alert('Schema saved successfully!')
    } catch (error: any) {
      console.error('Error saving schema:', error)
      alert(`Error saving schema: ${error.message}`)
    } finally {
      setSaving('')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Homepage Schemas</h1>
          <p className="text-gray-600 mt-1">
            Manage custom JSON-LD structured data for different homepage sections
          </p>
        </div>
        <Button onClick={fetchSchemas} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid w-full grid-cols-4">
          {HOMEPAGE_SECTIONS.map(section => (
            <TabsTrigger key={section.key} value={section.key} className="relative">
              {section.name}
              {schemas[section.key]?.custom_schema && (
                <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 text-xs">
                  ✓
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {HOMEPAGE_SECTIONS.map(section => (
          <TabsContent key={section.key} value={section.key} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{section.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  </div>
                  <Button
                    onClick={() => saveSchema(section.key)}
                    disabled={saving === section.key}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving === section.key ? 'Saving...' : 'Save Schema'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SchemaEditor
                  value={schemas[section.key]?.custom_schema ? 
                    JSON.stringify(schemas[section.key].custom_schema, null, 2) : 
                    null}
                  onChange={(schema) => handleSchemaChange(section.key, schema)}
                  pageType="homepage"
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Schema Management Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Global Schema:</strong> Organization and business data that appears on all pages</li>
            <li>• <strong>Hero Schema:</strong> Specific to the main hero section content</li>
            <li>• <strong>Featured Schema:</strong> For featured tours, destinations, and promotional content</li>
            <li>• <strong>Testimonials Schema:</strong> Customer reviews and aggregate rating data</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}