import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  console.log("Fetch reviews route hit!");
  const { id: itineraryId } = params;

  try {
    const reviews = await prisma.review.findMany({
      where: { itineraryId },
      include: { user: true },
    });

    return Response.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return Response.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
