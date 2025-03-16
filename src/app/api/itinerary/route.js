import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
  console.log("Create itinerary route hit!");
  const userId = req.headers.authorization; // Assuming JWT or API token contains user ID
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  console.log("Request body:", body);

  try {
    const { destination, duration, tripType, budget, transport, accommodation, interests, startDate, endDate, visibility } = body;

    const prompt = `
      Generate a ${duration}-day travel itinerary for ${destination}.
      Trip Type: ${tripType}. Budget: ${budget}.
      Transport: ${transport}. Accommodation: ${accommodation}.
      Interests: ${interests.join(", ")}.
      Format the response as structured JSON.
    `;

    const result = await model.generateContent(prompt);
    const itineraryData = result.response.text();

    console.log("AI response:", itineraryData);

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
        visibility: visibility || "public",
        userId,
      },
    });

    return Response.json(itinerary, { status: 201 });
  } catch (error) {
    console.error("AI Itinerary Generation Error:", error);
    return Response.json({ error: "Failed to generate itinerary" }, { status: 500 });
  }
}
