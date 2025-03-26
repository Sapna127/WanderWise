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

    const user = await prisma.user.findUnique({
      where: { id: token.id },
      select: {
        id: true,
        name: true,
        email: true,
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}