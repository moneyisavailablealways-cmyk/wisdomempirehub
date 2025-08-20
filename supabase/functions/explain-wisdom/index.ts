import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, type, origin } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    console.log('Explaining wisdom:', { text: text.substring(0, 50) + '...', type, origin });

    // Determine the context based on origin/category
    const pageContext = origin.toLowerCase().includes('proverb') ? 'Proverbs page' :
                       origin.toLowerCase().includes('quote') ? 'Quotes page' :
                       origin.toLowerCase().includes('idiom') ? 'Idioms page' :
                       origin.toLowerCase().includes('simile') ? 'Similes page' :
                       'Wisdom page';

    // Create context-aware prompt
    let prompt = '';
    
    if (type === 'user_query') {
      // Handle general user questions
      prompt = `User question from ${pageContext}: "${text}"`;
    } else {
      // Handle specific wisdom explanations
      prompt = `From ${pageContext}, explain this ${type}: "${text}"`;
    }

    const systemPrompt = `You are Lovable, the AI assistant for Wisdom Empire. You help users explore proverbs, quotes, idioms, similes, and other cultural wisdom.

Your responsibilities:
1. **Friendly & engaging responses:** Always respond warmly and encouragingly, like a wise friend.
2. **Audio explanation:** Every reply should be suitable for text-to-speech audio playback.
3. **Page-aware context:** Adjust your answer depending on the page context provided.
4. **Clarity & brevity:** Give clear, concise, and friendly answers (2-4 sentences).
5. **Language:** Respond in English with an audio-friendly tone.

**Page context guidelines:**
- **Proverbs page:** Explain meaning, origin, usage, or cultural significance. Provide examples if relevant.
- **Quotes page:** Explain meaning, context, or relevance. Offer insights or interpretations.
- **Idioms page:** Explain meaning, origin, and example usage.
- **Similes page:** Explain meaning and examples of usage in sentences.
- **FAQ/Help pages:** Give clear guidance about using Wisdom Empire features.

**Voice-friendly style:** Use conversational language that sounds natural when spoken aloud. Avoid complex punctuation or formatting.

If you don't know the answer, respond politely and guide the user to explore related content.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to generate explanation');
    }

    const data = await response.json();
    const explanation = data.choices[0].message.content;

    console.log('Explanation generated successfully');

    return new Response(JSON.stringify({ explanation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in explain-wisdom function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});