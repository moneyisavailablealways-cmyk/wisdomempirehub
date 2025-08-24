import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'text/plain'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://wisdomempirehub.com/api/sitemap.xml

# Preferred URLs
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# Prevent crawling of auth and admin pages
Disallow: /auth
Disallow: /admin

# Allow all wisdom content
Allow: /proverbs/
Allow: /quotes/
Allow: /idioms/
Allow: /similes/`

  return new Response(robotsTxt, {
    headers: corsHeaders,
    status: 200,
  })
})