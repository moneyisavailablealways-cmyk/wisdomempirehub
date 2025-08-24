import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get page number from URL parameters
    const url = new URL(req.url)
    const pageParam = url.pathname.match(/sitemap-proverbs-(\d+)\.xml/)
    const page = pageParam ? parseInt(pageParam[1]) : 1
    
    const maxPerSitemap = 50000
    const offset = (page - 1) * maxPerSitemap

    // Fetch proverbs with pagination
    const { data: proverbs, error } = await supabaseClient
      .from('proverbs')
      .select('id, created_at')
      .range(offset, offset + maxPerSitemap - 1)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    const baseUrl = 'https://wisdomempirehub.com'
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

    if (proverbs) {
      for (const proverb of proverbs) {
        const lastmod = new Date(proverb.created_at).toISOString()
        sitemap += `<url>
  <loc>${baseUrl}/proverbs/${proverb.id}</loc>
  <lastmod>${lastmod}</lastmod>
  <priority>0.8</priority>
</url>
`
      }
    }

    sitemap += `</urlset>`

    return new Response(sitemap, {
      headers: corsHeaders,
      status: 200,
    })

  } catch (error) {
    console.error('Error generating proverbs sitemap:', error)
    return new Response('Error generating proverbs sitemap', {
      headers: { 'Content-Type': 'text/plain' },
      status: 500,
    })
  }
})