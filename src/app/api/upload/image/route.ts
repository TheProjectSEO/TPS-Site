import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import sharp from 'sharp'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'general'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' 
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File size too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Process image with Sharp
    let processedBuffer: Buffer
    let fileName: string
    
    try {
      // Get original image metadata
      const metadata = await sharp(buffer).metadata()
      
      // Generate filename with timestamp
      const timestamp = Date.now()
      const originalName = file.name.replace(/\.[^/.]+$/, '') // Remove extension
      fileName = `${folder}/${originalName}-${timestamp}.webp`

      // Process image: resize if too large, convert to WebP, optimize
      const sharpInstance = sharp(buffer)
        .webp({ 
          quality: 85, // Good balance between quality and file size
          effort: 4    // Higher effort = better compression
        })

      // Resize if image is too large (max 1920px width, maintain aspect ratio)
      if (metadata.width && metadata.width > 1920) {
        sharpInstance.resize(1920, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
      }

      processedBuffer = await sharpInstance.toBuffer()

      console.log(`Image processed: ${file.size} bytes -> ${processedBuffer.length} bytes`)
      
    } catch (sharpError) {
      console.error('Sharp processing error:', sharpError)
      return NextResponse.json({ 
        error: 'Failed to process image. Please ensure it\'s a valid image file.' 
      }, { status: 400 })
    }

    // Upload to Supabase Storage - bucket confirmed to exist
    console.log('Uploading to bucket: travel-guide-images')
    console.log('File name:', fileName)
    console.log('File size:', processedBuffer.length)
    console.log('Project URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    const { data, error } = await supabase.storage
      .from('travel-guide-images')
      .upload(fileName, processedBuffer, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload failed with error:', error)
      console.error('Error code:', error.message)
      console.error('Full error object:', JSON.stringify(error, null, 2))
      
      return NextResponse.json({ 
        error: `Upload failed: ${error.message}`,
        errorCode: error.error || 'unknown',
        projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('travel-guide-images')
      .getPublicUrl(fileName)

    const imageUrl = urlData.publicUrl

    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename: fileName,
      originalSize: file.size,
      optimizedSize: processedBuffer.length,
      compressionRatio: Math.round((1 - processedBuffer.length / file.size) * 100)
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'Image upload endpoint is running',
    maxFileSize: '5MB',
    allowedTypes: ALLOWED_TYPES,
    outputFormat: 'WebP'
  })
}