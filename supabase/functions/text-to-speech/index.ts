import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const allowedVoices = ["alloy", "adams", "leo", "bella"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, category, voice } = await req.json();
    if (!message) throw new Error("Message is required");

    const selectedVoice = allowedVoices.includes(voice?.toLowerCase())
      ? voice.toLowerCase()
      : "alloy";

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OpenAI API key not configured");

    console.log("Processing message:", message.substring(0, 100) + "...");
    console.log("Voice:", selectedVoice, "Category:", category || "general");

    // 1️⃣ Call OpenAI Chat API for AI response
    const chatResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-2025-04-14",
        messages: [
          {
            role: "system",
            content: `You are Lovable, a friendly AI assistant. Respond concisely with context for category: ${category || "general"}.`
          },
          { role: "user", content: message }
        ],
        max_tokens: 300,
      }),
    });

    if (!chatResponse.ok) {
      const err = await chatResponse.json();
      console.error("OpenAI chat error:", err);
      throw new Error(err.error?.message || "Failed to get AI response");
    }

    const chatData = await chatResponse.json();
    const aiText = chatData.choices?.[0]?.message?.content || "I couldn't generate a response.";

    // 2️⃣ Call OpenAI TTS API for audio
    const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: aiText,
        voice: selectedVoice,
        response_format: "mp3",
      }),
    });

    if (!ttsResponse.ok) {
      const ttsError = await ttsResponse.json();
      console.error("OpenAI TTS error:", ttsError);
      throw new Error(ttsError.error?.message || "Failed to generate speech");
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    // ✅ Return combined response
    return new Response(JSON.stringify({
      text: aiText,
      audio: base64Audio,
      voice: selectedVoice,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI/TTS error:", error);
    return new Response(JSON.stringify({
      text: "Sorry, I couldn't process your request right now.",
      audio: "",
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
