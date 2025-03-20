import { NextResponse } from "next/server";
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
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  const userId = authResult.user?.userId; // Extract userId from JWT payload
  console.log("Authenticated user ID:", userId);

  try {
    const body = await req.json();
    console.log("Request body:", body);

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

    // Validate required fields
    if (
      !destination ||
      !duration ||
      !tripType ||
      !budget ||
      !transport ||
      !accommodation ||
      !interests ||
      !startDate ||
      !endDate ||
      !visibility
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate visibility against enum values
    const allowedVisibilityValues = ["PUBLIC", "PRIVATE"];
    const normalizedVisibility = visibility.toUpperCase(); // Convert to uppercase
    if (!allowedVisibilityValues.includes(normalizedVisibility)) {
      return NextResponse.json(
        { error: "Invalid visibility value. Allowed values: PUBLIC, PRIVATE" },
        { status: 400 }
      );
    }

    // Validate dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Please provide valid start and end dates." },
        { status: 400 }
      );
    }

    // Generate AI-based itinerary using Gemini API
    const prompt = `
      Generate a ${duration}-day travel itinerary for ${destination}.
      Trip Type: ${tripType}. Budget: ${budget}.
      Transport: ${transport}. Accommodation: ${accommodation}.
      Interests: ${interests.join(", ")}.

      IMPORTANT: You must respond with ONLY a valid JSON object in the following format:
      {
        "history": "Brief historical background of the destination",
        "dailyItinerary": [
          {
            "day": 1,
            "activities": ["Activity 1", "Activity 2"],
            "meals": ["Breakfast", "Lunch", "Dinner"]
          }
        ],
        "expenses": {
          "daily": {
            "food": "amount",
            "transport": "amount",
            "activities": "amount"
          },
          "total": "amount"
        },
        "photos": ["photo description 1", "photo description 2"]
      }

      Do not include any markdown formatting, explanations, or additional text. Only return the JSON object.
    `;

    let itineraryData;
    try {
      const result = await model.generateContent(prompt);
      itineraryData = result.response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      return NextResponse.json(
        { error: "Failed to generate itinerary using Gemini API" },
        { status: 500 }
      );
    }

    if (!itineraryData) {
      return NextResponse.json(
        { error: "AI response failed" },
        { status: 500 }
      );
    }

    // Clean up the response by removing any markdown or extra text
    const cleanJson = itineraryData
      .replace(/```json\n?|\n?```/g, "") // Remove markdown code blocks
      .replace(/^[^{]*({.*})[^}]*$/, "$1") // Extract only the JSON object
      .trim();

    // Parse AI response (handle potential errors)
    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);

      // Validate required fields
      if (
        !parsedData.history ||
        !parsedData.dailyItinerary ||
        !parsedData.expenses ||
        !parsedData.photos
      ) {
        throw new Error("Missing required fields in AI response");
      }

      // Ensure the data is in the correct format for Prisma JSON field
      const formattedData = {
        history: parsedData.history,
        dailyItinerary: parsedData.dailyItinerary,
        expenses: parsedData.expenses,
        photos: parsedData.photos,
      };

      // Store the itinerary in the database
      let itinerary;
      try {
        itinerary = await prisma.itinerary.create({
          data: {
            title: `Trip to ${destination}`,
            destination,
            duration,
            tripType,
            budget,
            transport,
            accommodation,
            interests: JSON.stringify(interests),
            startDate: startDateObj,
            endDate: endDateObj,
            itineraryData: JSON.stringify(formattedData),
            visibility: normalizedVisibility,
            userId,
          },
        });
      } catch (error) {
        console.error("Prisma Error:", error);
        return NextResponse.json(
          { error: "Failed to create itinerary in the database" },
          { status: 500 }
        );
      }

      return NextResponse.json(itinerary, { status: 201 });
    } catch (error) {
      console.error("JSON Parsing Error:", error);
      return NextResponse.json(
        { error: "Invalid AI response format", details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}