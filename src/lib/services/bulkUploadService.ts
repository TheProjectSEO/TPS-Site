import { createClient } from '@/lib/supabase'
import Papa from 'papaparse'

export interface PageTemplate {
  id: string
  name: string
  page_type: 'experience' | 'category'
  component_path: string
  description: string
  required_fields: string[]
  optional_fields: Record<string, string>
  field_mappings: Record<string, string>
  default_values: Record<string, any>
  validation_rules: Record<string, any>
  css_config?: any
  js_config?: any
  version: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BulkUploadJob {
  id: string
  template_id: string
  job_name: string
  original_filename: string
  file_size: number
  total_rows: number
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'paused'
  processed_rows: number
  successful_rows: number
  failed_rows: number
  errors: any[]
  warnings: any[]
  processing_started_at?: string
  processing_completed_at?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface CSVUploadData {
  id: string
  job_id: string
  row_number: number
  raw_data: Record<string, any>
  processed_data?: Record<string, any>
  validation_errors: any[]
  processing_status: 'pending' | 'processed' | 'failed' | 'skipped'
  created_at: string
}

export interface BulkGeneratedPage {
  id: string
  job_id: string
  csv_row_id: string
  template_id: string
  page_type: 'experience' | 'category'
  target_table: 'experiences' | 'category_pages'
  target_id?: string
  title: string
  slug: string
  status: 'draft' | 'published' | 'failed'
  generation_errors: any[]
  created_at: string
}

export interface ValidationError {
  field: string
  value: any
  error: string
  severity: 'error' | 'warning'
}

export interface ProcessingProgress {
  jobId: string
  totalRows: number
  processedRows: number
  successfulRows: number
  failedRows: number
  status: string
  errors: any[]
  warnings: any[]
}

export class BulkUploadService {
  private supabase = createClient()

  // ===== TEMPLATE MANAGEMENT =====

  async getPageTemplates(): Promise<PageTemplate[]> {
    const { data, error } = await this.supabase
      .from('page_templates')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  }

  async getPageTemplate(id: string): Promise<PageTemplate | null> {
    const { data, error } = await this.supabase
      .from('page_templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  }

  // ===== CSV PROCESSING =====

  async parseCSV(file: File): Promise<{
    headers: string[]
    data: Record<string, any>[]
    errors: string[]
  }> {
    return new Promise((resolve, reject) => {
      const errors: string[] = []
      
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => {
          // Clean and normalize header names
          return header.trim().toLowerCase().replace(/\s+/g, '_')
        },
        transform: (value, field) => {
          // Handle completely empty or null values
          if (value === null || value === undefined) {
            return null
          }
          
          // Convert to string and trim
          const stringValue = String(value).trim()
          
          // Handle special data types
          if (field && field.endsWith('_array')) {
            // Handle arrays (comma-separated values)
            return stringValue ? stringValue.split(',').map(v => v.trim()) : []
          }
          if (field && field.endsWith('_json')) {
            // Handle JSON fields
            try {
              return stringValue ? JSON.parse(stringValue) : null
            } catch (e) {
              errors.push(`Invalid JSON in field ${field}: ${stringValue}`)
              return null
            }
          }
          if (field && field.endsWith('_boolean')) {
            // Handle boolean fields
            return stringValue ? ['true', '1', 'yes', 'on'].includes(stringValue.toLowerCase()) : false
          }
          if (field && field.endsWith('_number')) {
            // Handle numeric fields
            const num = parseFloat(stringValue)
            return !isNaN(num) ? num : null
          }
          
          // For special field names, handle differently
          if (field === 'highlights' || field === 'languages') {
            // These should be arrays
            return stringValue ? stringValue.split(',').map(v => v.trim()) : []
          }
          
          if (field === 'featured' || field === 'bestseller') {
            // These should be booleans
            return stringValue ? ['true', '1', 'yes', 'on'].includes(stringValue.toLowerCase()) : false
          }
          
          if (field === 'price' || field === 'original_price' || field === 'duration_hours' || field === 'max_group_size' || field === 'min_age') {
            // These should be numbers
            const num = parseFloat(stringValue)
            return !isNaN(num) ? num : null
          }
          
          // Default: return as string, or null if empty
          return stringValue || null
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            results.errors.forEach(error => {
              errors.push(`Row ${error.row}: ${error.message}`)
            })
          }

          resolve({
            headers: results.meta.fields || [],
            data: results.data as Record<string, any>[],
            errors
          })
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`))
        }
      })
    })
  }

  async validateCSVData(
    data: Record<string, any>[],
    template: PageTemplate
  ): Promise<{
    validData: Record<string, any>[]
    errors: Array<{ row: number; errors: ValidationError[] }>
  }> {
    const validData: Record<string, any>[] = []
    const errors: Array<{ row: number; errors: ValidationError[] }> = []

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const rowErrors: ValidationError[] = []

      // Check required fields
      template.required_fields.forEach(field => {
        const value = row[field]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          rowErrors.push({
            field,
            value,
            error: `Required field '${field}' is missing or empty`,
            severity: 'error'
          })
        }
      })

      // Validate field types and rules
      Object.keys(template.validation_rules).forEach(field => {
        const rules = template.validation_rules[field]
        const value = row[field]

        if (value !== null && value !== undefined && value !== '') {
          // Type validation
          if (rules.type === 'array' && !Array.isArray(value)) {
            rowErrors.push({
              field,
              value,
              error: `Field '${field}' must be an array`,
              severity: 'error'
            })
          }

          // Length validation
          if (rules.min_length && typeof value === 'string' && value.length < rules.min_length) {
            rowErrors.push({
              field,
              value,
              error: `Field '${field}' must be at least ${rules.min_length} characters long`,
              severity: 'error'
            })
          }

          if (rules.max_length && typeof value === 'string' && value.length > rules.max_length) {
            rowErrors.push({
              field,
              value,
              error: `Field '${field}' must not exceed ${rules.max_length} characters`,
              severity: 'error'
            })
          }

          // Numeric validation
          if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
            rowErrors.push({
              field,
              value,
              error: `Field '${field}' must be at least ${rules.min}`,
              severity: 'error'
            })
          }

          if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
            rowErrors.push({
              field,
              value,
              error: `Field '${field}' must not exceed ${rules.max}`,
              severity: 'error'
            })
          }

          // Enum validation
          if (rules.enum && !rules.enum.includes(value)) {
            rowErrors.push({
              field,
              value,
              error: `Field '${field}' must be one of: ${rules.enum.join(', ')}`,
              severity: 'error'
            })
          }

          // Pattern validation
          if (rules.pattern && typeof value === 'string' && !new RegExp(rules.pattern).test(value)) {
            rowErrors.push({
              field,
              value,
              error: `Field '${field}' does not match required pattern`,
              severity: 'error'
            })
          }

          // Format validation
          if (rules.format === 'url' && typeof value === 'string') {
            try {
              new URL(value)
            } catch {
              rowErrors.push({
                field,
                value,
                error: `Field '${field}' must be a valid URL`,
                severity: 'error'
              })
            }
          }
        }
      })

      // Check for duplicate slugs
      if (row.slug) {
        const duplicateIndex = validData.findIndex(item => item.slug === row.slug)
        if (duplicateIndex !== -1) {
          rowErrors.push({
            field: 'slug',
            value: row.slug,
            error: `Duplicate slug found at row ${duplicateIndex + 1}`,
            severity: 'error'
          })
        }
      }

      if (rowErrors.length > 0) {
        errors.push({ row: i + 1, errors: rowErrors })
      } else {
        validData.push(row)
      }
    }

    return { validData, errors }
  }

  // ===== JOB MANAGEMENT =====

  async createBulkUploadJob(
    templateId: string,
    jobName: string,
    filename: string,
    fileSize: number,
    totalRows: number,
    userId?: string
  ): Promise<BulkUploadJob> {
    const { data, error } = await this.supabase
      .from('bulk_upload_jobs')
      .insert([{
        template_id: templateId,
        job_name: jobName,
        original_filename: filename,
        file_size: fileSize,
        total_rows: totalRows,
        created_by: userId
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateJobStatus(
    jobId: string,
    status: BulkUploadJob['status'],
    updates?: Partial<BulkUploadJob>
  ): Promise<void> {
    const { error } = await this.supabase
      .from('bulk_upload_jobs')
      .update({
        status,
        ...updates,
        ...(status === 'processing' && { processing_started_at: new Date().toISOString() }),
        ...(status === 'completed' && { processing_completed_at: new Date().toISOString() })
      })
      .eq('id', jobId)

    if (error) throw error
  }

  async getJob(jobId: string): Promise<BulkUploadJob | null> {
    const { data, error } = await this.supabase
      .from('bulk_upload_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error) return null
    return data
  }

  async getJobsByUser(userId: string): Promise<BulkUploadJob[]> {
    const { data, error } = await this.supabase
      .from('bulk_upload_jobs')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getAllJobs(): Promise<BulkUploadJob[]> {
    const { data, error } = await this.supabase
      .from('bulk_upload_jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // ===== CSV DATA STORAGE =====

  async storeCSVData(
    jobId: string,
    csvData: Record<string, any>[]
  ): Promise<void> {
    const records = csvData.map((row, index) => ({
      job_id: jobId,
      row_number: index + 1,
      raw_data: row
    }))

    const { error } = await this.supabase
      .from('csv_upload_data')
      .insert(records)

    if (error) throw error
  }

  async getCSVData(jobId: string): Promise<CSVUploadData[]> {
    const { data, error } = await this.supabase
      .from('csv_upload_data')
      .select('*')
      .eq('job_id', jobId)
      .order('row_number')

    if (error) throw error
    return data || []
  }

  // ===== SLUG GENERATION =====

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  async ensureUniqueSlug(slug: string, table: string, excludeId?: string): Promise<string> {
    let uniqueSlug = slug
    let counter = 1

    while (true) {
      let query = this.supabase
        .from(table)
        .select('id')
        .eq('slug', uniqueSlug)

      if (excludeId) {
        query = query.neq('id', excludeId)
      }

      const { data } = await query
      
      if (!data || data.length === 0) {
        break
      }

      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    return uniqueSlug
  }

  // ===== PROGRESS TRACKING =====

  async getJobProgress(jobId: string): Promise<ProcessingProgress | null> {
    const job = await this.getJob(jobId)
    if (!job) return null

    return {
      jobId: job.id,
      totalRows: job.total_rows,
      processedRows: job.processed_rows,
      successfulRows: job.successful_rows,
      failedRows: job.failed_rows,
      status: job.status,
      errors: job.errors,
      warnings: job.warnings
    }
  }

  // ===== UTILITY METHODS =====

  async lookupCategoryId(slug: string): Promise<string | null> {
    const { data } = await this.supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()

    return data?.id || null
  }

  async lookupCityId(slug: string): Promise<string | null> {
    const { data } = await this.supabase
      .from('cities')
      .select('id')
      .eq('slug', slug)
      .single()

    return data?.id || null
  }
}

export const bulkUploadService = new BulkUploadService()