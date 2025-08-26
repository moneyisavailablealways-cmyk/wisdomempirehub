import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, category } = await req.json();

    if (!message) {
      throw new Error("Message is required");
    }

    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    console.log("Processing message:", message.substring(0, 100) + "...");
    console.log("Category context:", category || "general");

    // System prompt for Lovable
    const systemPrompt = `You are Lovable, the AI assistant for Wisdom Empire. 
You help users explore proverbs, quotes, idioms, similes, and other cultural wisdom.

Responsibilities:
1. Friendly & engaging, like a wise friend. 
2. Replies must be suitable for text-to-speech audio.
3. Support both typing and spoken questions.
4. Adapt answers depending on the page: proverbs, quotes, idioms, similes, FAQ/help.
5. Voice-style answers should be conversational and clear.
6. Keep answers concise but meaningful. 
7. English by default, switch if user asks in another language.
8. If unsure, guide users politely.

Context: The user is currently exploring ${category || "general wisdom"}.

⚡ Output Format (MUST always be valid JSON):
{
  "text": "Your richer reply for chat (with context and examples).",
  "audio": "Your short, conversational reply optimized for voice."
}

Do NOT include code blocks or extra formatting. Always include both fields.`;

    // Call OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ✅ valid model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_completion_tokens: 300,
        response_format: { type: "json_object" }, // ✅ forces JSON output
      }),
    });

    console.log("OpenAI response status:", response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      throw new Error(error.error?.message || "Failed to get AI response");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    console.log("AI response raw:", aiResponse);

    // Validate and parse JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);

      if (!parsedResponse.text || !parsedResponse.audio) {
        throw new Error("Missing required fields in AI response");
      }
    } catch (err) {
      console.error("Failed to parse AI response:", err);
      parsedResponse = {
        text: "I'd be happy to help you explore wisdom and insights. What would you like to learn about today?",
        audio: "Happy to help with wisdom! What do you want to hear today?",
      };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Voice assistant error:", error);

    const errorResponse = {
      text: "I’m sorry, I’m having trouble processing your request right now. Please try again soon.",
      audio: "Sorry, I’m having trouble right now. Please try again.",
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
