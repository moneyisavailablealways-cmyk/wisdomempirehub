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
    const { text, voice } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const selectedVoice = allowedVoices.includes(voice?.toLowerCase())
      ? voice.toLowerCase()
      : "alloy";

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    console.log("Generating speech for text:", text.substring(0, 100) + "...");
    console.log("Using voice:", selectedVoice);

    // TTS request
    const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: selectedVoice,
        response_format: "base64",
      }),
    });

    if (!ttsResponse.ok) {
      const err = await ttsResponse.json();
      console.error("OpenAI TTS Error:", err);
      throw new Error(err.error?.message || "Failed to generate speech");
    }

    const ttsData = await ttsResponse.json();
    const base64Audio = ttsData.audio;

    if (!base64Audio) {
      throw new Error("No audio returned from TTS");
    }

    return new Response(JSON.stringify({ audioContent: base64Audio }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Text-to-Speech Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
