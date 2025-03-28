import prisma from "@/lib/prisma";
import { jwtDecode } from "jwt-decode";

export async function POST(req) {
  try {
    // Authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwtDecode(token);
    const userId = decoded.userId;

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Request validation
    const { itineraryId, rating, comment } = await req.json();
    if (!itineraryId || !rating || !comment) {
      return Response.json(
        { error: "Missing itineraryId, rating, or comment" },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        itineraryId,
        rating: parseInt(rating),
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return Response.json(review, { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return Response.json(
      { error: error.message || "Failed to create review" },
      { status: 500 }
    );
  }
}