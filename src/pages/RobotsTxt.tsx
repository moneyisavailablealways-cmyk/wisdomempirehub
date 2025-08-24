import { useEffect } from 'react';

export function RobotsTxt() {
  useEffect(() => {
    const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://wisdomempirehub.com/sitemap.xml

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
Allow: /similes/`;

    // Set the content type to text/plain
    const blob = new Blob([robotsTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Download or serve the robots.txt content
    const link = document.createElement('a');
    link.href = url;
    link.download = 'robots.txt';
    
    // Set the response content
    document.body.innerHTML = `<pre>${robotsTxt}</pre>`;
    document.title = 'robots.txt';
  }, []);

  return null;
}