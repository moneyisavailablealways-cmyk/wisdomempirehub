import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Quote, MessageSquare, Zap, HelpCircle, Volume2, Download, Edit, Users, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    { id: "1", icon: HelpCircle, question: "How do I show or hide the meaning of a proverb?", answer: "Click the \"Show Meaning\" link under the proverb. Click again to hide it." },
    { id: "2", icon: Edit, question: "Can I add my own proverbs?", answer: "Yes! Registered users can submit and edit proverbs through the edit feature." },
    { id: "3", icon: Download, question: "Can I download the proverbs?", answer: "Yes, look for the download icon on each card to save a copy." },
    { id: "4", icon: Volume2, question: "Why can't I hear the audio?", answer: "Make sure your device volume is up and your browser allows audio playback." },
    { id: "5", icon: Users, question: "Is the content free to use?", answer: "All content is free for personal use. For commercial use, please contact us." }
  ];

  // --- Voice Assistant state ---
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const VOICE_ASSISTANT_URL = "https://<your-project-ref>.functions.supabase.co/voice-assistant";

  const sendMessage = async (msg: string, audioFile?: File) => {
    const formData = new FormData();
    if (audioFile) formData.append("file", audioFile);
    else formData.append("text", msg);

    try {
      const res = await fetch(VOICE_ASSISTANT_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to communicate with AI assistant");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);

      // Play base64 audio
      const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
      audio.play();
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: AI assistant failed." }]);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    let chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });
      sendMessage("", audioBlob as unknown as File);
    };

    recorder.start();
    setListening(true);

    setTimeout(() => {
      recorder.stop();
      setListening(false);
    }, 5000); // 5 seconds max
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Quick Navigation */}
      <section className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4 flex flex-wrap gap-2 justify-center">
          <Button variant="outline" size="sm" asChild>
            <Link to="/proverbs" className="flex items-center gap-2"><BookOpen className="h-4 w-4" />Proverbs</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/quotes" className="flex items-center gap-2"><Quote className="h-4 w-4" />Quotes</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/idioms" className="flex items-center gap-2"><MessageSquare className="h-4 w-4" />Idioms</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/similes" className="flex items-center gap-2"><Zap className="h-4 w-4" />Similes</Link>
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* FAQ Accordion */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-wisdom text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">Find answers to common questions about using Wisdom Empire</p>
        </div>

        <Card>
          <CardContent className="p-8 bg-slate-900 rounded-2xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map(faq => {
                const IconComponent = faq.icon;
                return (
                  <AccordionItem key={faq.id} value={faq.id} className="border-b border-border last:border-b-0">
                    <AccordionTrigger className="text-left hover:no-underline py-6 bg-teal-950 hover:bg-teal-800 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-wisdom-gold flex-shrink-0" />
                        <span className="font-medium text-foreground">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="ml-8 text-muted-foreground">{faq.answer}</div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        {/* Voice Assistant */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">Ask AI Assistant</CardTitle>
          </CardHeader>
          <CardContent className="bg-slate-900 rounded-2xl p-6">
            <div className="h-48 overflow-y-auto border p-3 rounded-lg mb-3 bg-slate-800 text-foreground">
              {messages.map((m, i) => (
                <div key={i} className={`mb-2 ${m.role === "user" ? "text-blue-400" : "text-green-400"}`}>
                  <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.content}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Type your question..."
                className="flex-1 border p-2 rounded-lg bg-slate-800 text-white"
              />
              <Button onClick={() => sendMessage(input)}>Send</Button>
              <Button
                onClick={startRecording}
                className={listening ? "bg-red-500 text-white" : "bg-green-500 text-white"}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mt-8">
          <CardContent className="p-8 text-center bg-slate-900 rounded-2xl">
            <h3 className="text-xl font-semibold text-foreground mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">Can't find what you're looking for? Get in touch with our support team.</p>
            <Button asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
