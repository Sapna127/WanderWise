import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jwtDecode } from "jwt-decode";
import prisma from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
  console.log("Create itinerary route hit!");

  // Extract and validate authentication token
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwtDecode(token);
    const userId = decoded.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Authenticated user ID:", userId);

    // Parse request body
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

    // Validate visibility
    const allowedVisibilityValues = ["PUBLIC", "PRIVATE"];
    const normalizedVisibility = visibility.toUpperCase();
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
        {
          error:
            "Invalid date format. Please provide valid start and end dates.",
        },
        { status: 400 }
      );
    }

    // Generate AI-based itinerary
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
        }
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

    // Clean and parse AI response
    const cleanJson = itineraryData
      .replace(/```json\n?|\n?```/g, "")
      .replace(/^[^{]*({.*})[^}]*$/, "$1")
      .trim();

    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);

      if (
        !parsedData.history ||
        !parsedData.dailyItinerary ||
        !parsedData.expenses
      ) {
        throw new Error("Missing required fields in AI response");
      }

      const formattedData = {
        history: parsedData.history,
        dailyItinerary: parsedData.dailyItinerary,
        expenses: parsedData.expenses,
      };

      // Store itinerary in database
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

      // Return the created itinerary
      return NextResponse.json(
        {
          id: itinerary.id,
          title: itinerary.title,
          destination: itinerary.destination,
          duration: itinerary.duration,
          tripType: itinerary.tripType,
          budget: itinerary.budget,
          transport: itinerary.transport,
          accommodation: itinerary.accommodation,
          interests: JSON.parse(itinerary.interests),
          startDate: itinerary.startDate,
          endDate: itinerary.endDate,
          visibility: itinerary.visibility,
          itineraryData: JSON.parse(itinerary.itineraryData),
        },
        { status: 201 }
      );
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
