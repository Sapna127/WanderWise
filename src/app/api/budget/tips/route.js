import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const amount = parseFloat(searchParams.get("amount"));

    const prompt = `The user has spent $${amount}. Provide three personalized cost-saving tips.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const aiResponse = await model.generateContent(prompt);
    const text = aiResponse.response?.text(); // Prevent undefined errors

    if (!text) throw new Error("AI response is empty");

    return new Response(JSON.stringify({ tips: text.split("\n") }), { status: 200 });
  } catch (error) {
    console.error("Error fetching AI tips:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to fetch AI-generated tips" }), { status: 500 });
  }
}
