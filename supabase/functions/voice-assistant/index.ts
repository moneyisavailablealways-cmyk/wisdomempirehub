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
    const { message, category } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing message:', message.substring(0, 100) + '...');
    console.log('Category context:', category || 'general');

    // Create a conversational system prompt for the Wisdom Empire AI Assistant
    const systemPrompt = `You are Wisdom Empire's AI Assistant, a helpful, lovable, and wise companion.
You guide users with proverbs, quotes, insights, and explanations.

CRITICAL: Always respond in valid JSON format with exactly this structure:
{
  "text": "Your reply for reading in chat (slightly richer).",
  "audio": "Your reply for spoken TTS (short and clear)."
}

Guidelines:
- Be friendly, warm, and encouraging
- Keep "audio" replies short and natural (1-2 sentences)
- "text" replies may add slightly more detail, but stay concise
- Adapt smoothly to both typed and spoken inputs
- Focus on wisdom, insights, and guidance
- Use simple language that sounds natural when spoken

Current category context: ${category || 'general wisdom'}

Never include extra formatting, code blocks, or emojis inside the JSON.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_completion_tokens: 300,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response received:', aiResponse.substring(0, 100) + '...');

    // Parse and validate the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
      
      // Validate required fields
      if (!parsedResponse.text || !parsedResponse.audio) {
        throw new Error('Missing required fields in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response
      parsedResponse = {
        text: "I'd be happy to help you explore wisdom and insights. What would you like to learn about today?",
        audio: "I'd be happy to help you explore wisdom today. What interests you?"
      };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Voice assistant error:', error);
    
    // Return error in the expected JSON format
    const errorResponse = {
      text: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
      audio: "Sorry, I'm having trouble right now. Please try again."
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});