import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppNavigation } from "@/components/AppNavigation";
import { BottomTabs } from "@/components/BottomTabs";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Proverbs from "./pages/Proverbs";
import Quotes from "./pages/Quotes";
import Idioms from "./pages/Idioms";
import Similes from "./pages/Similes";
import WisdomItemPage from "./pages/WisdomItem";
import Donate from "./pages/Donate";
import DonateSuccess from "./pages/DonateSuccess";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { RobotsTxt } from "./pages/RobotsTxt";
import { SitemapXml } from "./pages/SitemapXml";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <SettingsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-background flex flex-col">
                <AppNavigation />
                <main className="flex-1 pb-16 md:pb-0">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/proverbs" element={<Proverbs />} />
                    <Route path="/quotes" element={<Quotes />} />
                    <Route path="/idioms" element={<Idioms />} />
          <Route path="/similes" element={<Similes />} />
          <Route path="/:type/:id" element={<WisdomItemPage />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/donate/success" element={<DonateSuccess />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/robots.txt" element={<RobotsTxt />} />
                    <Route path="/sitemap.xml" element={<SitemapXml />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <BottomTabs />
              </div>
            </BrowserRouter>
          </SettingsProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;