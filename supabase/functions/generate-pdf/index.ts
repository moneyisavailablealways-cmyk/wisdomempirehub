import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define interfaces for the data
interface WisdomItem {
  id: string
  text: string
  type: string
  origin?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Generate PDF function called')
    
    // Get category from URL parameters
    const url = new URL(req.url)
    const category = url.searchParams.get('category')
    
    if (!category || !['proverbs', 'idioms', 'similes', 'quotes'].includes(category)) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing category parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client with service role key for full access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log(`Fetching ${category} data from database`)
    
    // Fetch data from the specified table
    const { data: items, error: fetchError } = await supabase
      .from(category)
      .select('id, text, type, origin')
      .order('id')

    if (fetchError) {
      console.error('Error fetching data:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No data found for this category' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${items.length} items for ${category}`)

    // Create PDF using a simple approach with canvas and text drawing
    const PDFDocument = (await import('https://cdn.skypack.dev/pdfkit@0.13.0')).default
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    
    // Create array to store PDF chunks
    const chunks: Uint8Array[] = []
    
    // Collect PDF data
    doc.on('data', (chunk: Uint8Array) => chunks.push(chunk))
    
    // Create PDF content
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1)
    
    // Add title
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .text(categoryTitle, { align: 'center' })
       .moveDown(2)

    // Add each item
    doc.fontSize(14)
       .font('Helvetica')

    items.forEach((item: WisdomItem, index: number) => {
      // Add item number and text
      doc.text(`${index + 1}. ${item.text}`, { align: 'left' })
      
      // Add origin if available
      if (item.origin) {
        doc.fontSize(12)
           .fillColor('#666666')
           .text(`   — ${item.origin}`, { align: 'left' })
           .fillColor('#000000')
           .fontSize(14)
      }
      
      doc.moveDown(0.5)
      
      // Add new page if needed (check if we're near bottom)
      if (doc.y > 700) {
        doc.addPage()
      }
    })

    // Finalize the PDF
    doc.end()

    // Wait for PDF to be generated
    const pdfBuffer = await new Promise<Uint8Array>((resolve) => {
      doc.on('end', () => {
        const result = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
        let offset = 0
        for (const chunk of chunks) {
          result.set(chunk, offset)
          offset += chunk.length
        }
        resolve(result)
      })
    })

    console.log('PDF generated, uploading to storage')

    // Upload PDF to Supabase Storage
    const fileName = `${category}/${category}.pdf`
    const { error: uploadError } = await supabase.storage
      .from('downloads')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true // Replace existing file
      })

    if (uploadError) {
      console.error('Error uploading PDF:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload PDF' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('PDF uploaded successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'PDF generated and uploaded successfully',
        fileName 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in generate-pdf function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})