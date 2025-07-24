import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: faqs, error } = await supabase
      .from('faqs')
      .select(`
        *,
        experiences(title, slug)
      `)
      .order('sort_order', { ascending: true })

    if (error) throw error

    return NextResponse.json({ faqs })
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    console.log('Received FAQ data:', body)
    
    // Handle experience_id properly
    const faqData = {
      ...body,
      experience_id: body.experience_id || null
    }
    
    console.log('Processed FAQ data:', faqData)
    
    const { data, error } = await supabase
      .from('faqs')
      .insert([faqData])
      .select()

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log('Successfully created FAQ:', data)
    return NextResponse.json({ faq: data[0] })
  } catch (error) {
    console.error('Error creating FAQ:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create FAQ' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updates } = body
    
    // Handle experience_id properly
    const sanitizedUpdates = {
      ...updates,
      experience_id: updates.experience_id || null
    }
    
    const { data, error } = await supabase
      .from('faqs')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json({ faq: data[0] })
  } catch (error) {
    console.error('Error updating FAQ:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update FAQ' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'FAQ ID is required' },
        { status: 400 }
      )
    }
    
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete FAQ' },
      { status: 500 }
    )
  }
}