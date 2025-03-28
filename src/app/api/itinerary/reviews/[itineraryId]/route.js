import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req) {
  const itineraryId = req.nextUrl.pathname.split("/").pop(); 

  if (!itineraryId) {
    return Response.json(
      { error: "itineraryId is required" },
      { status: 400 }
    );
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { itineraryId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(reviews);
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return Response.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}