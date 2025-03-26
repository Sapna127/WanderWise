import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
  try {
    const token = await getToken({ req: request });
    
    if (!token?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const collaborators = await prisma.collaborator.findMany({
      where: { userId: token.id },
      include: { 
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(collaborators);
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return NextResponse.json(
      { error: "Failed to fetch collaborators" },
      { status: 500 }
    );
  }
}