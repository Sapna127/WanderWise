import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "@/lib/middleware/auth";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
  console.log("Create itinerary route hit!");

  // Authenticate user
  const authResult = authenticate(req);
  if (authResult.error) {
    return Response.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  const userId = authResult.user?.userId; // Assuming userId is stored in JWT payload
  console.log("Authenticated user ID:", userId);

  const body = await req.json();
  console.log("Request body:", body);

  try {
    const {
      destination,
      duration,
      tripType,
      budget,
      transport,
      accommodation,
      interests,
      startDate,
      endDate,
      visibility,
    } = body;

    const prompt = `
  Generate a ${duration}-day travel itinerary for ${destination}.
  Trip Type: ${tripType}. Budget: ${budget}.
  Transport: ${transport}. Accommodation: ${accommodation}.
  Interests: ${interests.join(", ")}.

  Additional requirements:
  - Provide a brief historical background of ${destination}.
  - Include estimated daily expenses based on the budget.
  - If possible, suggest some images of key attractions.
  - Format the response as structured JSON with fields: history, dailyItinerary, expenses, and photos.
`;

    const result = await model.generateContent(prompt);
    const itineraryData = result.response.text();

    console.log("AI response:", itineraryData);

    if (!itineraryData) {
      return Response.json({ error: "AI response failed" }, { status: 500 });
    }

    const parsedData = JSON.parse(itineraryData);
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
    return Response.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}
