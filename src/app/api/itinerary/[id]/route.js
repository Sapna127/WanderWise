import prisma from "@/lib/prisma";

export async function GET(req) {
  console.log("Fetch itinerary route hit!");

  // ✅ Fix: Use async `req.nextUrl` for params extraction
  const id = req.nextUrl.pathname.split("/").pop(); 

  if (!id) {
    return Response.json({ error: "Itinerary ID is required" }, { status: 400 });
  }

  console.log("Params received:", id);

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: { user: true, collaborators: true, reviews: true },
    });

    if (!itinerary) {
      return Response.json({ error: "Itinerary not found" }, { status: 404 });
    }

    return Response.json(itinerary);
  } catch (error) {
    console.error("Fetch itinerary error:", error);
    return Response.json({ error: "Failed to fetch itinerary" }, { status: 500 });
  }
}


export async function POST(req) {
  const url = new URL(req.url);
  const itineraryId = url.pathname.split("/").pop();

  if (!itineraryId) {
    return Response.json({ error: "Itinerary ID is required" }, { status: 400 });
  }

  // Extract and decode JWT from headers
  const token = req.headers.get("authorization")?.split(" ")[1]; 
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch (error) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const { email } = await req.json();

  if (!email) {
    return Response.json({ error: "Collaborator email is required" }, { status: 400 });
  }

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId },
    });

    if (!itinerary) {
      return Response.json({ error: "Itinerary not found" }, { status: 404 });
    }

    if (itinerary.visibility !== "PRIVATE") {
      return Response.json({ error: "Collaborators can only be added to private itineraries" }, { status: 403 });
    }

    if (itinerary.userId !== userId) {
      return Response.json({ error: "You can only add collaborators to your own itineraries" }, { status: 403 });
    }

    const collaboratorUser = await prisma.user.findUnique({ where: { email } });

    if (!collaboratorUser) {
      return Response.json({ error: "User with this email not found" }, { status: 404 });
    }

    const existingCollaborator = await prisma.collaborator.findUnique({
      where: { itineraryId_userId: { itineraryId, userId: collaboratorUser.id } },
    });

    if (existingCollaborator) {
      return Response.json({ error: "User is already a collaborator" }, { status: 400 });
    }

    const newCollaborator = await prisma.collaborator.create({
      data: { itineraryId, userId: collaboratorUser.id },
      include: { user: true },
    });

    return Response.json(newCollaborator, { status: 201 });
  } catch (error) {
    console.error("Add collaborator error:", error);
    return Response.json({ error: "Failed to add collaborator" }, { status: 500 });
  }
}