import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const allowedVoices = ["alloy", "adams", "leo", "bella"];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, voice } = await req.json();

    if (!text) throw new Error("Text is required");

    const selectedVoice = allowedVoices.includes(voice?.toLowerCase())
      ? voice.toLowerCase()
      : "alloy";

    console.log("Generating speech for text:", text.substring(0, 50) + "...");
    console.log("Using voice:", selectedVoice);

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OpenAI API key not configured");

    // Call OpenAI TTS endpoint
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: selectedVoice,
        response_format: "mp3",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI TTS error:", error);
      throw new Error(error.error?.message || "Failed to generate speech");
    }

    // Convert audio buffer to Base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    console.log("Speech generated successfully, length:", base64Audio.length);

    return new Response(JSON.stringify({
      audioContent: base64Audio,
      voice: selectedVoice,
      textLength: text.length
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Text-to-speech error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
