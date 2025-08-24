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

    // Get counts for each content type to determine number of sitemap files needed
    const { data: proverbs } = await supabaseClient.from('proverbs').select('id', { count: 'exact' })
    const { data: quotes } = await supabaseClient.from('quotes').select('id', { count: 'exact' })
    const { data: idioms } = await supabaseClient.from('idioms').select('id', { count: 'exact' })
    const { data: similes } = await supabaseClient.from('similes').select('id', { count: 'exact' })

    const proverbCount = proverbs?.length || 0
    const quoteCount = quotes?.length || 0
    const idiomCount = idioms?.length || 0
    const simileCount = similes?.length || 0

    const maxPerSitemap = 50000
    const baseUrl = 'https://wisdomempirehub.com'
    const now = new Date().toISOString()

    let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<!-- Main Pages Sitemap -->
<sitemap>
  <loc>${baseUrl}/api/sitemap-pages.xml</loc>
  <lastmod>${now}</lastmod>
</sitemap>
`

    // Generate proverb sitemaps
    const proverbSitemaps = Math.ceil(proverbCount / maxPerSitemap)
    for (let i = 1; i <= proverbSitemaps; i++) {
      sitemapIndex += `<sitemap>
  <loc>${baseUrl}/api/sitemap-proverbs-${i}.xml</loc>
  <lastmod>${now}</lastmod>
</sitemap>
`
    }

    // Generate quote sitemaps
    const quoteSitemaps = Math.ceil(quoteCount / maxPerSitemap)
    for (let i = 1; i <= quoteSitemaps; i++) {
      sitemapIndex += `<sitemap>
  <loc>${baseUrl}/api/sitemap-quotes-${i}.xml</loc>
  <lastmod>${now}</lastmod>
</sitemap>
`
    }

    // Generate idiom sitemaps
    const idiomSitemaps = Math.ceil(idiomCount / maxPerSitemap)
    for (let i = 1; i <= idiomSitemaps; i++) {
      sitemapIndex += `<sitemap>
  <loc>${baseUrl}/api/sitemap-idioms-${i}.xml</loc>
  <lastmod>${now}</lastmod>
</sitemap>
`
    }

    // Generate simile sitemaps
    const simileSitemaps = Math.ceil(simileCount / maxPerSitemap)
    for (let i = 1; i <= simileSitemaps; i++) {
      sitemapIndex += `<sitemap>
  <loc>${baseUrl}/api/sitemap-similes-${i}.xml</loc>
  <lastmod>${now}</lastmod>
</sitemap>
`
    }

    sitemapIndex += `</sitemapindex>`

    return new Response(sitemapIndex, {
      headers: corsHeaders,
      status: 200,
    })

  } catch (error) {
    console.error('Error generating sitemap index:', error)
    return new Response('Error generating sitemap index', {
      headers: { 'Content-Type': 'text/plain' },
      status: 500,
    })
  }
})