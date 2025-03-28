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

    const collaborators = await prisma.collaborator.findMany({
      where: { userId: userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      }
    });

    return Response.json(collaborators, { status: 201 });
  } catch (error) {
    console.error("collaborators fetch error:", error);
    return Response.json(
      { error: "Failed to fetch collaborators" },
      { status: 500 }
    );
  }
}
