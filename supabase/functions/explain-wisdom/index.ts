import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, type, origin } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Explaining wisdom:', { text: text.substring(0, 50) + '...', type, origin });

    const pageContext = origin.toLowerCase().includes('proverb') ? 'Proverbs page' :
                       origin.toLowerCase().includes('quote') ? 'Quotes page' :
                       origin.toLowerCase().includes('idiom') ? 'Idioms page' :
                       origin.toLowerCase().includes('simile') ? 'Similes page' :
                       'Wisdom page';

    let prompt = '';
    if (type === 'user_query') {
      prompt = `User question from ${pageContext}: "${text}"`;
    } else {
      prompt = `From ${pageContext}, explain this ${type}: "${text}"`;
    }

    const systemPrompt = `You are Lovable, the AI assistant for Wisdom Empire. You help users explore proverbs, quotes, idioms, similes, and other cultural wisdom.

Your responsibilities:
1. **Friendly & engaging responses:** Always respond warmly and encouragingly, like a wise friend.
2. **Audio explanation:** Every reply should be suitable for text-to-speech audio playback.
3. **Typing support:** Users can type questions or phrases; always respond appropriately.
4. **Page-aware context:** Adjust your answer depending on the page context provided.
5. **Clarity & brevity:** Give clear, concise, and friendly answers (2-4 sentences).
6. **Language:** Respond in English with an audio-friendly tone.

**Page context guidelines:**
- **Proverbs page:** Explain meaning, origin, usage, or cultural significance. Provide examples if relevant.
- **Quotes page:** Explain meaning, context, or relevance. Offer insights or interpretations.
- **Idioms page:** Explain meaning, origin, and example usage.
- **Similes page:** Explain meaning and examples of usage in sentences.

**Voice-friendly style:** Use conversational language that sounds natural when spoken aloud. Avoid complex punctuation or formatting.

If you don't know the answer, respond politely and guide the user to explore related content.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI gateway error:', response.status, error);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required, please add credits.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('Failed to generate explanation');
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
