import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  type?: 'website' | 'article';
  image?: string;
  preloadImage?: string;
}

export function SEOHead({
  title = "Wisdom Empire Hub - Cultural Knowledge & Timeless Wisdom",
  description = "Discover timeless wisdom through proverbs, quotes, idioms, and similes from cultures around the world. Educational platform preserving global cultural heritage.",
  keywords = "proverbs, quotes, idioms, similes, cultural wisdom, education, heritage, global cultures, sayings, expressions",
  canonical,
  type = 'website',
  image = "/lovable-uploads/logo-optimized.webp",
  preloadImage
}: SEOHeadProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const canonicalUrl = canonical || currentUrl;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Preload critical images */}
      {preloadImage && (
        <link rel="preload" as="image" href={preloadImage} fetchPriority="high" type="image/webp" />
      )}
      
      {/* DNS prefetch for performance */}
      <link rel="dns-prefetch" href="https://sxvrqshcqmbmogkwcixe.supabase.co" />
      <link rel="preconnect" href="https://sxvrqshcqmbmogkwcixe.supabase.co" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Wisdom Empire Hub" />
    </Helmet>
  );
}