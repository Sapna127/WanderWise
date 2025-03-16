import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  console.log("Modify collaborators route hit!");
  const userId = req.headers.authorization;
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id: itineraryId } = params;
  const { collaboratorId, action } = await req.json();

  if (!collaboratorId || !["add", "remove"].includes(action)) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    if (action === "add") {
      await prisma.collaborator.create({ data: { itineraryId, userId: collaboratorId } });
    } else {
      await prisma.collaborator.deleteMany({ where: { itineraryId, userId: collaboratorId } });
    }

    return Response.json({ message: `Collaborator ${action}ed successfully` }, { status: 200 });
  } catch (error) {
    console.error("Collaborator modification error:", error);
    return Response.json({ error: "Failed to modify collaborators" }, { status: 500 });
  }
}
