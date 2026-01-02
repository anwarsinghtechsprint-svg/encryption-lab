import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, algorithm } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are CryptoAdvisor, an expert AI assistant specialized in cryptography and cybersecurity education. You help students and developers understand encryption algorithms, security best practices, and cryptographic concepts.

Your expertise includes:
- Symmetric encryption (AES, ChaCha20, DES, 3DES)
- Asymmetric encryption (RSA, ECC, Diffie-Hellman)
- Hashing algorithms (SHA-256, SHA-512, MD5, bcrypt, PBKDF2)
- Encryption modes (ECB, CBC, CTR, GCM)
- Key management and security best practices
- Real-world applications and attack vectors

Guidelines:
- Keep explanations clear and educational
- Use analogies when helpful
- Warn about deprecated/insecure algorithms
- Provide practical security advice
- Be concise but thorough (2-3 paragraphs max)
- Use markdown formatting for code examples`;

    const userMessage = algorithm 
      ? `I'm learning about ${algorithm}. ${question}`
      : question;

    console.log("Sending request to Gemini via Lovable AI Gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "I couldn't generate a response.";

    console.log("Successfully received response from Gemini");

    return new Response(
      JSON.stringify({ answer, model: "Google Gemini 2.5 Flash" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Crypto advisor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
