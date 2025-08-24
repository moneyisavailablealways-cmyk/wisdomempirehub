import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const baseUrl = 'https://wisdomempirehub.com'
  const now = new Date().toISOString()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<!-- Main Pages -->
<url>
  <loc>${baseUrl}/</loc>
  <lastmod>${now}</lastmod>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>

<url>
  <loc>${baseUrl}/proverbs</loc>
  <lastmod>${now}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>

<url>
  <loc>${baseUrl}/quotes</loc>
  <lastmod>${now}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>

<url>
  <loc>${baseUrl}/idioms</loc>
  <lastmod>${now}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>

<url>
  <loc>${baseUrl}/similes</loc>
  <lastmod>${now}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>

<!-- Static Pages -->
<url>
  <loc>${baseUrl}/contact</loc>
  <lastmod>${now}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>

<url>
  <loc>${baseUrl}/donate</loc>
  <lastmod>${now}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>

<url>
  <loc>${baseUrl}/faq</loc>
  <lastmod>${now}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.6</priority>
</url>

<url>
  <loc>${baseUrl}/privacy</loc>
  <lastmod>${now}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.5</priority>
</url>

<url>
  <loc>${baseUrl}/terms</loc>
  <lastmod>${now}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.5</priority>
</url>

</urlset>`

  return new Response(sitemap, {
    headers: corsHeaders,
    status: 200,
  })
})