'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
  placeholder?: string
  className?: string
  showUrlInput?: boolean
  acceptMultiple?: boolean
  onMultipleChange?: (urls: string[]) => void
}

interface UploadResponse {
  success: boolean
  url: string
  filename: string
  originalSize: number
  optimizedSize: number
  compressionRatio: number
  error?: string
}

export function ImageUpload({
  value,
  onChange,
  folder = 'general',
  placeholder = 'Upload an image or enter URL...',
  className = '',
  showUrlInput = true,
  acceptMultiple = false,
  onMultipleChange
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const [urlInput, setUrlInput] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    if (acceptMultiple) {
      await handleMultipleUploads(Array.from(files))
    } else {
      await handleSingleUpload(files[0])
    }
  }

  const handleSingleUpload = async (file: File) => {
    // Validate file size before uploading
    if (file.size > 5 * 1024 * 1024) {
      setUploadProgress(`❌ Error: File too large. Maximum size is 5MB (${Math.round(file.size / 1024 / 1024)}MB uploaded)`)
      setTimeout(() => setUploadProgress(''), 5000)
      return
    }

    setIsUploading(true)
    setUploadProgress('Processing image...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      const data: UploadResponse = await response.json()

      if (data.success) {
        onChange(data.url)
        setUploadProgress(`✅ Uploaded! Saved ${data.compressionRatio}% space`)
        setTimeout(() => setUploadProgress(''), 3000)
      } else {
        console.error('Upload API response:', data)
        const errorMsg = data.error || 'Upload failed'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadProgress(`❌ Error: ${error instanceof Error ? error.message : 'Upload failed'}`)
      setTimeout(() => setUploadProgress(''), 5000)
    } finally {
      setIsUploading(false)
    }
  }

  const handleMultipleUploads = async (files: File[]) => {
    if (!onMultipleChange) return

    setIsUploading(true)
    const urls: string[] = []
    let completed = 0

    for (const file of files) {
      setUploadProgress(`Uploading ${completed + 1}/${files.length}: ${file.name}`)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData
        })

        const data: UploadResponse = await response.json()

        if (data.success) {
          urls.push(data.url)
        } else {
          console.error(`Failed to upload ${file.name}:`, data.error)
        }
      } catch (error) {
        console.error(`Upload error for ${file.name}:`, error)
      }

      completed++
    }

    onMultipleChange(urls)
    setUploadProgress(`✅ Uploaded ${urls.length}/${files.length} images`)
    setTimeout(() => setUploadProgress(''), 3000)
    setIsUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
    }
  }

  const clearImage = () => {
    onChange('')
    setUrlInput('')
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Preview */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Uploaded image"
            className="max-w-xs max-h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            onClick={clearImage}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple={acceptMultiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-2">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-gray-600">{uploadProgress}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">
                  Drag and drop an image here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary hover:underline font-medium"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports: JPEG, PNG, WebP • Max 5MB • Auto-optimized to WebP
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mx-auto"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose {acceptMultiple ? 'Images' : 'Image'}
            </Button>
          </div>
        )}
      </div>

      {/* URL Input */}
      {showUrlInput && (
        <div className="space-y-2">
          <Label htmlFor="image-url">Or enter image URL</Label>
          <div className="flex space-x-2">
            <Input
              id="image-url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
            >
              Add URL
            </Button>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress && (
        <div className="text-sm text-center p-2 bg-gray-50 rounded">
          {uploadProgress}
        </div>
      )}
    </div>
  )
}