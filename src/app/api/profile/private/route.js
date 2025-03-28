import prisma from "@/lib/prisma";
import { jwtDecode } from "jwt-decode";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwtDecode(token);
    const userId = decoded.userId;

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraries = await prisma.itinerary.findMany({
      where: {
        userId: token.id,
        visibility: "PRIVATE",
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
      orderBy: { createdAt: "desc" },
    });

    return Response.json(itineraries, { status: 201 });
  } catch (error) {
    console.error("Error fetching private itineraries:", error);
    return Response.json(
      { error: "Failed to fetch private itineraries" },
      { status: 500 }
    );
  }
}
