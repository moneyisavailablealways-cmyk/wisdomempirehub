import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
    const { donationData, paymentMethod } = await req.json();
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse amount (remove $ and handle monthly)
    let amount = 0;
    if (donationData.amount.includes('$')) {
      const amountStr = donationData.amount.replace('$', '').replace('/month', '');
      if (amountStr.endsWith('+')) {
        amount = parseInt(amountStr.replace('+', '')) * 100; // Convert to cents
      } else {
        amount = parseInt(amountStr) * 100; // Convert to cents
      }
    }

    // Store donation in database
    const { data: donation, error: dbError } = await supabase
      .from('donations')
      .insert({
        name: donationData.name,
        email: donationData.email,
        tier: donationData.tier,
        amount: amount / 100, // Store as decimal
        payment_method: paymentMethod,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to create donation record');
    }

    let paymentUrl = '';

    if (paymentMethod === 'stripe') {
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${donationData.tier} - Wisdom Empire Donation`,
              description: 'Support cultural wisdom preservation',
            },
            unit_amount: amount,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.get("origin")}/donate/success?donation_id=${donation.id}`,
        cancel_url: `${req.headers.get("origin")}/donate?cancelled=true`,
        metadata: {
          donation_id: donation.id,
        },
      });

      // Update donation with Stripe session ID
      await supabase
        .from('donations')
        .update({ stripe_session_id: session.id })
        .eq('id', donation.id);

      paymentUrl = session.url || '';
    } else if (paymentMethod === 'paypal') {
      // For PayPal, we'll simulate the process for now
      paymentUrl = `${req.headers.get("origin")}/donate/success?donation_id=${donation.id}&method=paypal`;
    } else if (paymentMethod === 'crypto') {
      // For Crypto, we'll simulate the process for now
      paymentUrl = `${req.headers.get("origin")}/donate/success?donation_id=${donation.id}&method=crypto`;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      paymentUrl,
      donationId: donation.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
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