import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
  console.log("Route hit!");
  const body = await req.json();
  console.log("Request body:", body);

  try {
    const { destination, duration, tripType, budget, transport, accommodation, interests, startDate, endDate } = body;

    const prompt = `
      Generate a ${duration}-day travel itinerary for ${destination}.
      Trip Type: ${tripType}.
      Budget: ${budget}.
      Preferred Transport: ${transport}.
      Preferred Accommodation: ${accommodation}.
      Interests: ${interests.join(", ")}.
      Format the response as structured JSON.
    `;

    const result = await model.generateContent(prompt);
    const itineraryData = result.response.text();

    console.log("Gemini API response:", itineraryData);

    if (!itineraryData) {
      return Response.json({ error: "AI response failed" }, { status: 500 });
    }

    const itinerary = await prisma.itinerary.create({
      data: {
        title: `Trip to ${destination}`,
        destination,
        duration,
        tripType,
        budget,
        transport,
        accommodation,
        interests: JSON.stringify(interests),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        itineraryData,
        userId: "bff3e76c-2189-4c58-89f7-6448c13bbb2a",
      },
    });

    return Response.json(itinerary, { status: 201 });
  } catch (error) {
    console.error("AI Itinerary Generation Error:", error);
    return Response.json({ error: "Failed to generate itinerary" }, { status: 500 });
  }
}
