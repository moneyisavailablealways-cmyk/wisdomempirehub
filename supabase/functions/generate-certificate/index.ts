import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { donationId } = await req.json();

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get donation details
    const { data: donation, error } = await supabase
      .from('donations')
      .select('*')
      .eq('id', donationId)
      .eq('status', 'completed')
      .single();

    if (error || !donation) {
      throw new Error('Donation not found or not completed');
    }

    // Create PDF certificate
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([792, 612]); // Letter size landscape
    
    // Load fonts
    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const textFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const nameFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Colors
    const darkBlue = rgb(0.1, 0.3, 0.6);
    const lightBlue = rgb(0.4, 0.7, 0.9);
    const gold = rgb(0.8, 0.6, 0.1);

    // Draw border
    page.drawRectangle({
      x: 30,
      y: 30,
      width: 732,
      height: 552,
      borderColor: darkBlue,
      borderWidth: 3,
    });

    page.drawRectangle({
      x: 40,
      y: 40,
      width: 712,
      height: 532,
      borderColor: lightBlue,
      borderWidth: 1,
    });

    // Title
    page.drawText('CERTIFICATE OF APPRECIATION', {
      x: 150,
      y: 480,
      size: 32,
      font: titleFont,
      color: darkBlue,
    });

    // Subtitle
    page.drawText('Wisdom Empire Cultural Preservation Initiative', {
      x: 220,
      y: 440,
      size: 16,
      font: textFont,
      color: darkBlue,
    });

    // Main text
    page.drawText('This certificate is presented to', {
      x: 280,
      y: 380,
      size: 18,
      font: textFont,
      color: darkBlue,
    });

    // Donor name
    page.drawText(donation.name, {
      x: 396 - (donation.name.length * 12), // Center the name
      y: 330,
      size: 36,
      font: nameFont,
      color: gold,
    });

    // Achievement text
    page.drawText('in recognition of your generous contribution as a', {
      x: 240,
      y: 280,
      size: 16,
      font: textFont,
      color: darkBlue,
    });

    // Tier name
    page.drawText(donation.tier, {
      x: 396 - (donation.tier.length * 10), // Center the tier
      y: 240,
      size: 28,
      font: titleFont,
      color: darkBlue,
    });

    // Amount and date
    const donationDate = new Date(donation.created_at).toLocaleDateString();
    page.drawText(`Donation Amount: $${donation.amount}`, {
      x: 100,
      y: 150,
      size: 14,
      font: textFont,
      color: darkBlue,
    });

    page.drawText(`Date: ${donationDate}`, {
      x: 550,
      y: 150,
      size: 14,
      font: textFont,
      color: darkBlue,
    });

    // Thank you message
    page.drawText('Your support helps preserve cultural wisdom for future generations.', {
      x: 180,
      y: 100,
      size: 14,
      font: textFont,
      color: darkBlue,
    });

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="wisdom-empire-certificate-${donation.tier.toLowerCase().replace(/\s+/g, '-')}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});