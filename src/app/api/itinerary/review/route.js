import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  console.log("Add review route hit!");
  const userId = req.headers.authorization;
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { itineraryId, rating, comment } = await req.json();

  if (!itineraryId || !rating || !comment) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const review = await prisma.review.create({
      data: { userId, itineraryId, rating, comment },
    });

    return Response.json(review, { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return Response.json({ error: "Failed to add review" }, { status: 500 });
  }
}
