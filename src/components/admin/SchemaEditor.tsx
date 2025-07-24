'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, AlertCircle, CheckCircle, Code, Layers, FileText } from 'lucide-react'

interface SchemaTemplate {
  id: string
  name: string
  description: string
  schema_type: string
  template_schema: any
  is_default: boolean
  is_active: boolean
}

interface SchemaEditorProps {
  schemaMode: 'default' | 'custom'
  customSchema: any
  onSchemaModeChange: (mode: 'default' | 'custom') => void
  onCustomSchemaChange: (schema: any) => void
  schemaType?: string
}

function SchemaEditor({ 
  schemaMode, 
  customSchema, 
  onSchemaModeChange, 
  onCustomSchemaChange,
  schemaType = 'category'
}: SchemaEditorProps) {
  const [templates, setTemplates] = useState<SchemaTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [schemaInput, setSchemaInput] = useState('')
  const [isValidJson, setIsValidJson] = useState(true)
  const [jsonError, setJsonError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState('')
  const [newTemplateDescription, setNewTemplateDescription] = useState('')
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [schemaType])

  useEffect(() => {
    if (customSchema) {
      setSchemaInput(JSON.stringify(customSchema, null, 2))
    }
  }, [customSchema])

  const fetchTemplates = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('page_schemas')
        .select('*')
        .eq('schema_type', schemaType)
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('name')

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

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
      onCustomSchemaChange(parsed)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      const formattedSchema = JSON.stringify(template.template_schema, null, 2)
      setSchemaInput(formattedSchema)
      onCustomSchemaChange(template.template_schema)
    }
  }

  const formatJson = () => {
    try {
      const parsed = JSON.parse(schemaInput)
      const formatted = JSON.stringify(parsed, null, 2)
      setSchemaInput(formatted)
      onCustomSchemaChange(parsed)
    } catch (error) {
      // JSON is invalid, don't format
    }
  }

  const clearSchema = () => {
    setSchemaInput('')
    setSelectedTemplate('')
    onCustomSchemaChange(null)
  }

  const saveAsTemplate = async () => {
    if (!newTemplateName.trim() || !schemaInput.trim()) return

    try {
      setIsLoading(true)
      const supabase = createClient()
      const parsed = validateJson(schemaInput)
      
      if (!parsed) {
        throw new Error('Invalid schema JSON')
      }

      const { error } = await supabase
        .from('page_schemas')
        .insert([{
          name: newTemplateName,
          description: newTemplateDescription,
          schema_type: schemaType,
          template_schema: parsed,
          is_default: false,
          is_active: true
        }])

      if (error) throw error

      setNewTemplateName('')
      setNewTemplateDescription('')
      setShowSaveTemplate(false)
      await fetchTemplates()
    } catch (error) {
      console.error('Error saving template:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Schema Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Schema Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Schema Mode</Label>
              <Select value={schemaMode} onValueChange={(value: 'default' | 'custom') => onSchemaModeChange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Default Schema
                    </div>
                  </SelectItem>
                  <SelectItem value="custom">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      Custom Schema
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {schemaMode === 'default' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Using default schema generation based on your content. Schema will be automatically generated using your page content and SEO fields.
                </AlertDescription>
              </Alert>
            )}

            {schemaMode === 'custom' && (
              <Alert>
                <Code className="h-4 w-4" />
                <AlertDescription>
                  Using custom schema. You can select from templates or write your own JSON-LD schema.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Custom Schema Editor */}
      {schemaMode === 'custom' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Custom Schema Editor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editor">Schema Editor</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="editor" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="schema-input">JSON-LD Schema</Label>
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
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearSchema}
                        disabled={!schemaInput.trim()}
                      >
                        Clear
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSaveTemplate(true)}
                        disabled={!schemaInput.trim() || !isValidJson}
                      >
                        Save as Template
                      </Button>
                    </div>
                  </div>
                  
                  <Textarea
                    id="schema-input"
                    value={schemaInput}
                    onChange={(e) => handleSchemaInputChange(e.target.value)}
                    placeholder="Enter your JSON-LD schema here..."
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

                {/* Save Template Form */}
                {showSaveTemplate && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Save as Template</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input
                          id="template-name"
                          value={newTemplateName}
                          onChange={(e) => setNewTemplateName(e.target.value)}
                          placeholder="Enter template name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="template-description">Description</Label>
                        <Textarea
                          id="template-description"
                          value={newTemplateDescription}
                          onChange={(e) => setNewTemplateDescription(e.target.value)}
                          placeholder="Enter template description"
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={saveAsTemplate}
                          disabled={!newTemplateName.trim() || !isValidJson || isLoading}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? 'Saving...' : 'Save Template'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowSaveTemplate(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="templates" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <Card 
                      key={template.id} 
                      className={`cursor-pointer transition-all ${
                        selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{template.name}</h3>
                          <div className="flex items-center gap-1">
                            {template.is_default && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Default
                              </Badge>
                            )}
                            <Badge variant="outline">
                              {template.template_schema['@type'] || 'Schema'}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FileText className="h-3 w-3" />
                          <span>{template.schema_type}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {templates.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Layers className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No templates available for this schema type</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export { SchemaEditor }