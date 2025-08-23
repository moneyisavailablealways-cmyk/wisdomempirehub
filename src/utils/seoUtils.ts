interface WisdomItem {
  id: string;
  type: 'proverb' | 'quote' | 'idiom' | 'simile';
  text: string;
  origin: string;
  subcategory?: string;
}

export function generateWisdomTitle(item: WisdomItem): string {
  const truncatedText = item.text.length > 50 
    ? `${item.text.substring(0, 50)}...` 
    : item.text;
  
  const categoryMap = {
    proverb: 'Proverb',
    quote: 'Quote', 
    idiom: 'Idiom',
    simile: 'Simile'
  };

  return `${truncatedText} – ${categoryMap[item.type]} | Wisdom Empire Hub`;
}

export function generateWisdomDescription(item: WisdomItem): string {
  const typeDesc = {
    proverb: 'timeless proverb',
    quote: 'inspiring quote',
    idiom: 'cultural idiom', 
    simile: 'expressive simile'
  };

  const desc = `Discover the meaning of this ${typeDesc[item.type]} from ${item.origin}${item.subcategory ? ` about ${item.subcategory.toLowerCase()}` : ''}. Learn cultural wisdom and expressions from around the world.`;
  
  // Ensure description is between 120-160 characters
  if (desc.length > 160) {
    return desc.substring(0, 157) + '...';
  }
  
  return desc.length < 120 ? desc + ' Explore more cultural heritage at Wisdom Empire Hub.' : desc;
}

export function generateWisdomKeywords(item: WisdomItem): string {
  const baseKeywords = `${item.type}, ${item.origin.toLowerCase()}, cultural wisdom, ${item.type}s`;
  const subcategoryKeywords = item.subcategory ? `, ${item.subcategory.toLowerCase()}, ${item.subcategory.toLowerCase()} ${item.type}s` : '';
  
  return baseKeywords + subcategoryKeywords + ', expressions, sayings, cultural heritage, wisdom empire';
}