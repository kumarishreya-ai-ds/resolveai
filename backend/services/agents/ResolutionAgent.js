import { callGemini } from "./geminiHelper.js";

const openaiFallback = (context) => {
  const intent = context?.intent?.intent || "support request";
  const customerName = context?.customer?.customer?.name || "there";
  const tone = context?.sentiment?.sentiment || "neutral";
  return {
    response: `Hi ${customerName}, thanks for reaching out. We’ve reviewed your ${intent} and are taking the next best action. We understand this feels ${tone}, and we’re actively working to resolve it for you.`,
  };
};

const callOpenAI = async (context) => {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a precise customer support assistant. Return only the final customer reply." },
        { role: "user", content: JSON.stringify(context) },
      ],
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
};

class ResolutionAgent {
  async run({ intent, sentiment, customer, knowledge, message = "" }) {
    const start = Date.now();
    const context = {
      intent,
      sentiment,
      customer,
      knowledge,
      message,
    };

    let responseText = null;
    try {
      responseText = await callOpenAI(context);
    } catch (error) {
      console.warn("OpenAI fallback activated:", error.message);
    }

    if (!responseText) {
      const result = await callGemini(
        `You are a customer support assistant. Write a concise, professional response for a customer. Use the customer's plan and tier when helpful. Context: intent=${intent?.intent || "support"}, sentiment=${sentiment?.sentiment || "neutral"}, customer=${customer?.customer?.name || "customer"}, plan=${customer?.plan || "basic"}, tier=${customer?.tier || "standard"}, knowledge=${JSON.stringify(knowledge || {})}. Return ONLY valid JSON with key: response.`,
        () => openaiFallback(context)
      );
      responseText = result?.response || openaiFallback(context).response;
    }

    return {
      name: "ResolutionAgent",
      durationMs: Date.now() - start,
      output: {
        response: responseText,
        source: process.env.OPENAI_API_KEY ? "openai" : "fallback",
      },
    };
  }
}

export default ResolutionAgent;
