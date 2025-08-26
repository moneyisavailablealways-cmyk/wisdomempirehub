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

    // Create the new Lovable AI Assistant system prompt
    const systemPrompt = `You are Lovable, the AI assistant for Wisdom Empire. You help users explore proverbs, quotes, idioms, similes, and other cultural wisdom.

Your responsibilities:

1. **Friendly & engaging responses:** Always respond warmly and encouragingly, like a wise friend.
2. **Audio explanation:** Every reply should be suitable for Lovable's text-to-speech audio playback.
3. **Typing support:** Users can type questions or phrases; always respond appropriately.
4. **Page-aware context:** Adjust your answer depending on the page the user is on.

   * **Proverbs page:** Explain the meaning, origin, usage, or cultural significance of any proverb. Provide examples if relevant.
   * **Quotes page:** Explain the meaning, context, or relevance of quotes. Offer insights or interpretations.
   * **Idioms page:** Explain idioms, their meaning, origin, and example usage.
   * **Similes page:** Explain similes, their meaning, and examples of usage in sentences.
   * **FAQ / Help pages:** Give clear guidance, instructions, or tips about using Wisdom Empire and its features.

5. **Voice-style tips:** If the user asks for "voice" or "read aloud," respond in a style optimized for audio output.
6. **Clarity & brevity:** Give clear, concise, and friendly answers.
7. **Language:** Respond in English by default. If the user asks in another language, respond naturally in that language, keeping audio-friendly tone.
8. **Fallback:** If you don't know the answer, respond politely and guide the user to explore related content.

Context: The user is currently exploring ${category || 'general wisdom'} on the platform.

⚡ Output Format

Always respond in JSON exactly like this:

{
  "text": "Your reply for reading in chat (slightly richer with context and examples).",
  "audio": "Your reply for spoken TTS (short, clear, and conversational)."
}

🔑 Rules

"text" → richer, more detailed for reading with examples and context.

"audio" → short, conversational, optimized for text-to-speech playback.

Never omit the "audio" field.

Do not include extra formatting, code blocks, or emojis inside the JSON.

Always identify yourself as "Lovable" when introducing yourself.`;

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