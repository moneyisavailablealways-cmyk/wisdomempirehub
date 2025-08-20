import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Process base64 audio in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { audio, voice = 'alloy', instructions = 'You are a helpful assistant.' } = await req.json();

    if (!audio) {
      throw new Error('Audio data is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing voice assistant request...');

    // Step 1: Convert speech to text using Whisper
    console.log('Converting speech to text...');
    const binaryAudio = processBase64Chunks(audio);
    
    const transcriptionFormData = new FormData();
    const audioBlob = new Blob([binaryAudio], { type: 'audio/webm' });
    transcriptionFormData.append('file', audioBlob, 'audio.webm');
    transcriptionFormData.append('model', 'whisper-1');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: transcriptionFormData,
    });

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.text();
      console.error('Whisper API error:', error);
      throw new Error(`Speech-to-text failed: ${error}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    const userText = transcriptionResult.text;
    console.log('Transcribed text:', userText);

    // Step 2: Process with ChatGPT
    console.log('Processing with AI...');
    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: instructions },
          { role: 'user', content: userText }
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!chatResponse.ok) {
      const error = await chatResponse.json();
      console.error('ChatGPT API error:', error);
      throw new Error(error.error?.message || 'AI processing failed');
    }

    const chatResult = await chatResponse.json();
    const aiResponse = chatResult.choices[0].message.content;
    console.log('AI response:', aiResponse);

    // Step 3: Convert AI response to speech
    console.log('Converting response to speech...');
    const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: aiResponse,
        voice: voice,
        response_format: 'mp3',
      }),
    });

    if (!ttsResponse.ok) {
      const error = await ttsResponse.json();
      console.error('TTS API error:', error);
      throw new Error(error.error?.message || 'Text-to-speech failed');
    }

    // Convert audio response to base64
    const audioArrayBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioArrayBuffer))
    );

    console.log('Voice assistant processing complete');

    return new Response(
      JSON.stringify({
        transcription: userText,
        response: aiResponse,
        audioContent: base64Audio,
        voice: voice
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Voice assistant error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});