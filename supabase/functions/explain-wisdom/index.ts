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

    const prompt = `Explain the meaning and significance of this ${type} from ${origin}: "${text}"

Please provide a concise explanation (2-3 sentences) that covers:
1. The literal meaning
2. The deeper wisdom or lesson it conveys
3. How it might apply to modern life

Keep it educational, engaging, and accessible.`;

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
            content: 'You are a wise cultural educator who explains the meaning of proverbs, quotes, idioms, and similes from different cultures. Provide clear, concise explanations that help people understand both the literal and metaphorical meanings.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
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