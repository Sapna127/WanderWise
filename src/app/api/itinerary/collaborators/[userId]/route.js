import prisma from "@/lib/prisma";
export async function GET(req, { params }) {
  const { userId } = params;

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
    });
  }

  try {
    const collaborators = await prisma.collaborator.findMany({
      where: { userId },
      include: { user: true },
    });

    return new Response(JSON.stringify(collaborators), { status: 200 });
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch collaborators" }),
      { status: 500 }
    );
  }
}