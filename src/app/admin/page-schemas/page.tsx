'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, Plus, Edit, Trash2, Layers, Code, AlertCircle, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PageSchema {
  id: string
  name: string
  description: string
  schema_type: string
  template_schema: any
  is_default: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

const SCHEMA_TYPES = [
  { value: 'category', label: 'Category Pages' },
  { value: 'tour', label: 'Tour/Experience Pages' },
  { value: 'blog', label: 'Blog/Travel Guide Pages' },
  { value: 'homepage', label: 'Homepage Sections' },
  { value: 'general', label: 'General Pages' }
]

export default function PageSchemasAdminPage() {
  const [schemas, setSchemas] = useState<PageSchema[]>([])
  const [selectedType, setSelectedType] = useState<string>('category')
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchema, setEditingSchema] = useState<PageSchema | null>(null)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState<'success' | 'error'>('success')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schema_type: 'category',
    template_schema: {},
    is_default: false,
    is_active: true
  })

  const [schemaInput, setSchemaInput] = useState('')
  const [isValidJson, setIsValidJson] = useState(true)
  const [jsonError, setJsonError] = useState('')

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      schema_type: 'category',
      template_schema: {},
      is_default: false,
      is_active: true
    })
    setSchemaInput('')
    setIsValidJson(true)
    setJsonError('')
  }

  const fetchSchemas = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('page_schemas')
        .select('*')
        .eq('schema_type', selectedType)
        .order('is_default', { ascending: false })
        .order('name')

      if (error) throw error
      setSchemas(data || [])
    } catch (error) {
      console.error('Error fetching schemas:', error)
      setAlertMessage('Error fetching schemas')
      setAlertType('error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSchemas()
  }, [selectedType])

  const validateJson = (jsonString: string) => {
    try {
      if (!jsonString.trim()) {
        setIsValidJson(true)
        setJsonError('')
        return null
      }
      
      const parsed = JSON.parse(jsonString)
      
      // Basic schema validation
      if (!parsed['@context']) {
        setIsValidJson(false)
        setJsonError('Schema must include @context')
        return null
      }
      
      if (!parsed['@type']) {
        setIsValidJson(false)
        setJsonError('Schema must include @type')
        return null
      }
      
      setIsValidJson(true)
      setJsonError('')
      return parsed
    } catch (error) {
      setIsValidJson(false)
      setJsonError('Invalid JSON format')
      return null
    }
  }

  const handleSchemaInputChange = (value: string) => {
    setSchemaInput(value)
    const parsed = validateJson(value)
    if (parsed) {
      setFormData({ ...formData, template_schema: parsed })
    }
  }

  const handleSave = async () => {
    try {
      const supabase = createClient()
      
      if (!formData.name.trim()) {
        setAlertMessage('Schema name is required')
        setAlertType('error')
        return
      }

      const parsed = validateJson(schemaInput)
      if (!parsed) {
        setAlertMessage('Invalid JSON schema')
        setAlertType('error')
        return
      }

      const schemaData = {
        ...formData,
        template_schema: parsed
      }

      let result
      if (editingSchema) {
        result = await supabase
          .from('page_schemas')
          .update(schemaData)
          .eq('id', editingSchema.id)
      } else {
        result = await supabase
          .from('page_schemas')
          .insert([schemaData])
      }

      if (result.error) throw result.error

      setAlertMessage(editingSchema ? 'Schema updated successfully!' : 'Schema created successfully!')
      setAlertType('success')
      setIsDialogOpen(false)
      setEditingSchema(null)
      resetForm()
      await fetchSchemas()
    } catch (error) {
      console.error('Error saving schema:', error)
      setAlertMessage('Error saving schema')
      setAlertType('error')
    }
  }

  const handleEdit = (schema: PageSchema) => {
    setEditingSchema(schema)
    setFormData({
      name: schema.name,
      description: schema.description || '',
      schema_type: schema.schema_type,
      template_schema: schema.template_schema,
      is_default: schema.is_default,
      is_active: schema.is_active
    })
    setSchemaInput(JSON.stringify(schema.template_schema, null, 2))
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schema template?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('page_schemas')
        .delete()
        .eq('id', id)

      if (error) throw error

      setAlertMessage('Schema deleted successfully!')
      setAlertType('success')
      await fetchSchemas()
    } catch (error) {
      console.error('Error deleting schema:', error)
      setAlertMessage('Error deleting schema')
      setAlertType('error')
    }
  }

  const formatJson = () => {
    try {
      const parsed = JSON.parse(schemaInput)
      const formatted = JSON.stringify(parsed, null, 2)
      setSchemaInput(formatted)
      setFormData({ ...formData, template_schema: parsed })
    } catch (error) {
      // JSON is invalid, don't format
    }
  }

  const getSchemaTypeLabel = (type: string) => {
    const schemaType = SCHEMA_TYPES.find(t => t.value === type)
    return schemaType?.label || type
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Page Schema Templates</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingSchema(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Schema Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSchema ? 'Edit Schema Template' : 'Add New Schema Template'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Default Category Schema"
                    />
                  </div>
                  <div>
                    <Label htmlFor="schema_type">Schema Type</Label>
                    <Select value={formData.schema_type} onValueChange={(value) => setFormData({ ...formData, schema_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SCHEMA_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description of this schema template"
                    rows={2}
                  />
                </div>

                {/* Schema JSON Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="schema-input">JSON-LD Schema Template</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={formatJson}
                        disabled={!schemaInput.trim()}
                      >
                        Format JSON
                      </Button>
                    </div>
                  </div>
                  
                  <Textarea
                    id="schema-input"
                    value={schemaInput}
                    onChange={(e) => handleSchemaInputChange(e.target.value)}
                    placeholder="Enter your JSON-LD schema template here..."
                    className="font-mono text-sm min-h-[300px]"
                  />
                  
                  {/* JSON Validation Status */}
                  <div className="flex items-center gap-2">
                    {isValidJson ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Valid JSON
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Invalid JSON
                      </Badge>
                    )}
                    {jsonError && (
                      <span className="text-sm text-red-600">{jsonError}</span>
                    )}
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_default"
                      checked={formData.is_default}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
                    />
                    <Label htmlFor="is_default">Default Template</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={!isValidJson || !formData.name.trim()}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingSchema ? 'Update Template' : 'Create Template'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Type Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter by Schema Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCHEMA_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Alert Messages */}
        {alertMessage && (
          <Alert className={`mb-6 ${alertType === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={alertType === 'error' ? 'text-red-700' : 'text-green-700'}>
              {alertMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Schema Templates List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading schema templates...</p>
            </div>
          ) : schemas.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Layers className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">No schema templates found</p>
                <p className="text-gray-400 mt-2">Create your first schema template for {getSchemaTypeLabel(selectedType)}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemas.map((schema) => (
                <Card key={schema.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{schema.name}</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(schema)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(schema.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">{schema.description}</p>
                      
                      <div className="flex items-center gap-2">
                        {schema.is_default && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Default
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {schema.template_schema['@type'] || 'Schema'}
                        </Badge>
                        {!schema.is_active && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                            Inactive
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Code className="h-3 w-3" />
                        <span>{getSchemaTypeLabel(schema.schema_type)}</span>
                      </div>

                      <div className="text-xs text-gray-400">
                        Created: {new Date(schema.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}