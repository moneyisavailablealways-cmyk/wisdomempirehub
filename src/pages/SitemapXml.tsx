import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function SitemapXml() {
  const [sitemap, setSitemap] = useState<string>('');

  useEffect(() => {
    generateSitemap();
  }, []);

  const generateSitemap = async () => {
    try {
      // Get counts for each content type
      const { count: proverbCount } = await supabase.from('proverbs').select('*', { count: 'exact', head: true });
      const { count: quoteCount } = await supabase.from('quotes').select('*', { count: 'exact', head: true });
      const { count: idiomCount } = await supabase.from('idioms').select('*', { count: 'exact', head: true });
      const { count: simileCount } = await supabase.from('similes').select('*', { count: 'exact', head: true });

      const maxPerSitemap = 50000;
      const baseUrl = 'https://wisdomempirehub.com';
      const now = new Date().toISOString();

      let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<!-- Main Pages Sitemap -->
<sitemap>
  <loc>${baseUrl}/sitemap-pages.xml</loc>
  <lastmod>${now}</lastmod>
</sitemap>
`;

      // Generate proverb sitemaps
      const proverbSitemaps = Math.ceil((proverbCount || 0) / maxPerSitemap);
      for (let i = 1; i <= proverbSitemaps; i++) {
        sitemapIndex += `<sitemap>
  <loc>${baseUrl}/sitemap-proverbs-${i}.xml</loc>
  <lastmod>${now}</lastmod>
</sitemap>
`;
      }

      // Generate quote sitemaps
      const quoteSitemaps = Math.ceil((quoteCount || 0) / maxPerSitemap);
      for (let i = 1; i <= quoteSitemaps; i++) {
        sitemapIndex += `<sitemap>
  <loc>${baseUrl}/sitemap-quotes-${i}.xml</loc>
  <lastmod>${now}</lastmod>
</sitemap>
`;
      }

      // Generate idiom sitemaps
      const idiomSitemaps = Math.ceil((idiomCount || 0) / maxPerSitemap);
      for (let i = 1; i <= idiomSitemaps; i++) {
        sitemapIndex += `<sitemap>
  <loc>${baseUrl}/sitemap-idioms-${i}.xml</loc>
  <lastmod>${now}</lastmod>
</sitemap>
`;
      }

      // Generate simile sitemaps
      const simileSitemaps = Math.ceil((simileCount || 0) / maxPerSitemap);
      for (let i = 1; i <= simileSitemaps; i++) {
        sitemapIndex += `<sitemap>
  <loc>${baseUrl}/sitemap-similes-${i}.xml</loc>
  <lastmod>${now}</lastmod>
</sitemap>
`;
      }

      sitemapIndex += `</sitemapindex>`;

      setSitemap(sitemapIndex);
      
      // Set content type and display
      document.body.innerHTML = `<pre>${sitemapIndex}</pre>`;
      document.title = 'Sitemap Index';
      
    } catch (error) {
      console.error('Error generating sitemap:', error);
      const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<error>Unable to generate sitemap</error>`;
      setSitemap(errorXml);
      document.body.innerHTML = `<pre>${errorXml}</pre>`;
    }
  };

  return null;
}