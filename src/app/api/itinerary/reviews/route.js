import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET endpoint to fetch reviews
export async function GET(req) {
  console.log("Fetch reviews route hit!");

  // Extract itineraryId from query parameters
  const { searchParams } = new URL(req.url);
  const itineraryId = searchParams.get("id");

  if (!itineraryId) {
    return new Response(JSON.stringify({ error: "Itinerary ID is required" }), {
      status: 400,
    });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { itineraryId },
      include: { user: true },
    });

    return new Response(JSON.stringify(reviews), { status: 200 });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), {
      status: 500,
    });
  }
}

// POST endpoint to add a review
export async function POST(req) {
  console.log("Add review route hit!");

  const { itineraryId, rating, comment } = await req.json();

  if (!itineraryId || !rating || !comment) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  try {
    const review = await prisma.review.create({
      data: { itineraryId, rating, comment },
    });

    return new Response(JSON.stringify(review), { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return new Response(JSON.stringify({ error: "Failed to add review" }), {
      status: 500,
    });
  }
}