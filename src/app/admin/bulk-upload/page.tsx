'use client'

import { useState, useEffect } from 'react'
import { Upload, FileText, Eye, Download, AlertCircle, CheckCircle, Clock, Play, Pause, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { bulkUploadService, PageTemplate, BulkUploadJob, ProcessingProgress } from '@/lib/services/bulkUploadService'
import { pageProcessingService } from '@/lib/services/pageProcessingService'

export default function BulkUploadPage() {
  const [templates, setTemplates] = useState<PageTemplate[]>([])
  const [jobs, setJobs] = useState<BulkUploadJob[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [jobName, setJobName] = useState('')
  const [csvData, setCsvData] = useState<any[]>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvErrors, setCsvErrors] = useState<string[]>([])
  const [validationErrors, setValidationErrors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [processingJob, setProcessingJob] = useState<string | null>(null)
  const [processingProgress, setProcessingProgress] = useState<ProcessingProgress | null>(null)
  const [activeTab, setActiveTab] = useState('upload')

  useEffect(() => {
    loadTemplates()
    loadJobs()
  }, [])

  const loadTemplates = async () => {
    try {
      const templatesData = await bulkUploadService.getPageTemplates()
      setTemplates(templatesData)
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  const loadJobs = async () => {
    try {
      const jobsData = await bulkUploadService.getAllJobs()
      setJobs(jobsData)
    } catch (error) {
      console.error('Failed to load jobs:', error)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadFile(file)
    setLoading(true)

    try {
      const result = await bulkUploadService.parseCSV(file)
      setCsvData(result.data)
      setCsvHeaders(result.headers)
      setCsvErrors(result.errors)
      
      // Auto-generate job name
      if (!jobName) {
        const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
        setJobName(`${selectedTemplate?.name || 'Bulk Upload'} - ${timestamp}`)
      }
    } catch (error) {
      console.error('CSV parsing failed:', error)
      setCsvErrors([error instanceof Error ? error.message : 'Failed to parse CSV'])
    } finally {
      setLoading(false)
    }
  }

  const validateCSVData = async () => {
    if (!selectedTemplate || !csvData.length) return

    setLoading(true)
    try {
      const result = await bulkUploadService.validateCSVData(csvData, selectedTemplate)
      setValidationErrors(result.errors)
    } catch (error) {
      console.error('Validation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const createJob = async () => {
    if (!selectedTemplate || !uploadFile || !jobName) return

    setLoading(true)
    try {
      const job = await bulkUploadService.createBulkUploadJob(
        selectedTemplate.id,
        jobName,
        uploadFile.name,
        uploadFile.size,
        csvData.length
      )

      // Store CSV data
      await bulkUploadService.storeCSVData(job.id, csvData)

      // Refresh jobs list
      await loadJobs()
      
      // Switch to jobs tab
      setActiveTab('jobs')
      
      // Reset form
      setUploadFile(null)
      setCsvData([])
      setCsvHeaders([])
      setCsvErrors([])
      setValidationErrors([])
      setJobName('')
      
      // Start processing if no validation errors
      if (validationErrors.length === 0) {
        startProcessing(job.id)
      }
    } catch (error) {
      console.error('Failed to create job:', error)
    } finally {
      setLoading(false)
    }
  }

  const startProcessing = async (jobId: string) => {
    setProcessingJob(jobId)
    
    try {
      const template = await bulkUploadService.getPageTemplate(templates.find(t => t.id === selectedTemplate?.id)?.id || '')
      if (!template) return

      // Update job status
      await bulkUploadService.updateJobStatus(jobId, 'processing')
      
      // Get CSV data
      const csvRows = await bulkUploadService.getCSVData(jobId)
      
      let processedCount = 0
      let successCount = 0
      let errorCount = 0
      const jobErrors: string[] = []
      
      // Process each row
      for (const csvRow of csvRows) {
        try {
          const result = await pageProcessingService.processCSVRow(csvRow, template)
          
          if (result.success && result.pageId) {
            await pageProcessingService.recordGeneratedPage(
              jobId,
              csvRow.id,
              template.id,
              template.page_type,
              template.page_type === 'experience' ? 'experiences' : 'category_pages',
              result.pageId,
              csvRow.raw_data.title || csvRow.raw_data.category_name,
              csvRow.raw_data.slug || bulkUploadService.generateSlug(csvRow.raw_data.title || csvRow.raw_data.category_name),
              'draft'
            )
            successCount++
          } else {
            errorCount++
            jobErrors.push(...result.errors)
          }
          
          processedCount++
          
          // Update progress
          await bulkUploadService.updateJobStatus(jobId, 'processing', {
            processed_rows: processedCount,
            successful_rows: successCount,
            failed_rows: errorCount,
            errors: jobErrors
          })
          
        } catch (error) {
          errorCount++
          jobErrors.push(`Row ${csvRow.row_number}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
      
      // Mark job as completed
      await bulkUploadService.updateJobStatus(jobId, 'completed', {
        processed_rows: processedCount,
        successful_rows: successCount,
        failed_rows: errorCount,
        errors: jobErrors
      })
      
      // Refresh jobs
      await loadJobs()
      
    } catch (error) {
      console.error('Processing failed:', error)
      await bulkUploadService.updateJobStatus(jobId, 'failed', {
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setProcessingJob(null)
      setProcessingProgress(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      processing: 'default',
      completed: 'default',
      failed: 'destructive',
      paused: 'secondary'
    }
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const downloadTemplate = (template: PageTemplate) => {
    const headers = [...template.required_fields, ...Object.keys(template.optional_fields)]
    const csvContent = headers.join(',') + '\n' + headers.map(() => '').join(',')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-template.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bulk Page Upload</h1>
        <p className="text-gray-600">Upload CSV files to create multiple pages at once</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Select Template</CardTitle>
              <CardDescription>Choose the type of pages you want to create</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant="outline">{template.page_type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadTemplate(template)
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Upload CSV File</CardTitle>
                <CardDescription>
                  Upload your CSV file with the data for {selectedTemplate.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="jobName">Job Name</Label>
                  <Input
                    id="jobName"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    placeholder="Enter a name for this upload job"
                  />
                </div>

                <div>
                  <Label htmlFor="csvFile">CSV File</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={loading}
                  />
                </div>

                {csvErrors.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-semibold mb-2">CSV Parsing Errors:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {csvErrors.map((error, index) => (
                          <li key={index} className="text-sm">{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {csvData.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {csvData.length} rows found
                      </span>
                      <Button
                        onClick={validateCSVData}
                        disabled={loading}
                        size="sm"
                      >
                        Validate Data
                      </Button>
                    </div>

                    {validationErrors.length > 0 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="font-semibold mb-2">Validation Errors:</div>
                          <div className="max-h-40 overflow-y-auto">
                            {validationErrors.map((error, index) => (
                              <div key={index} className="text-sm mb-2">
                                <strong>Row {error.row}:</strong>
                                <ul className="list-disc list-inside ml-4">
                                  {error.errors.map((err: any, i: number) => (
                                    <li key={i} className={err.severity === 'error' ? 'text-red-600' : 'text-yellow-600'}>
                                      {err.field}: {err.error}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={createJob}
                        disabled={loading || !jobName || csvErrors.length > 0}
                        className="flex-1"
                      >
                        {loading ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Creating Job...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Create Upload Job
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Jobs</CardTitle>
              <CardDescription>Monitor and manage your bulk upload jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <h3 className="font-semibold">{job.job_name}</h3>
                          <p className="text-sm text-gray-600">{job.original_filename}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(job.status)}
                        {job.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => startProcessing(job.id)}
                            disabled={!!processingJob}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total:</span>
                        <span className="ml-2 font-medium">{job.total_rows}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Processed:</span>
                        <span className="ml-2 font-medium">{job.processed_rows}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Successful:</span>
                        <span className="ml-2 font-medium text-green-600">{job.successful_rows}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Failed:</span>
                        <span className="ml-2 font-medium text-red-600">{job.failed_rows}</span>
                      </div>
                    </div>

                    {job.status === 'processing' && (
                      <Progress value={(job.processed_rows / job.total_rows) * 100} />
                    )}

                    {job.errors.length > 0 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="font-semibold mb-2">Errors ({job.errors.length}):</div>
                          <div className="max-h-32 overflow-y-auto">
                            {job.errors.slice(0, 5).map((error, index) => (
                              <div key={index} className="text-sm">{error}</div>
                            ))}
                            {job.errors.length > 5 && (
                              <div className="text-sm text-gray-600">
                                ... and {job.errors.length - 5} more errors
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}

                {jobs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No upload jobs found. Create your first job in the Upload tab.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Templates</CardTitle>
              <CardDescription>Configure and manage page templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{template.page_type}</Badge>
                        <Badge variant="secondary">v{template.version}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Required Fields:</span>
                        <div className="mt-1 space-y-1">
                          {template.required_fields.map((field) => (
                            <Badge key={field} variant="outline" className="mr-1">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Optional Fields:</span>
                        <div className="mt-1 space-y-1">
                          {Object.keys(template.optional_fields).slice(0, 8).map((field) => (
                            <Badge key={field} variant="secondary" className="mr-1">
                              {field}
                            </Badge>
                          ))}
                          {Object.keys(template.optional_fields).length > 8 && (
                            <span className="text-gray-500">
                              +{Object.keys(template.optional_fields).length - 8} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadTemplate(template)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}