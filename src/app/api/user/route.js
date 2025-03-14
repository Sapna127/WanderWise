import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name, password } = body || {};

    if (!email || !name || !password) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 409 });
    }

    const newUser = await prisma.user.create({
      data: { email, name, password }
    });

    return Response.json(newUser, { status: 201 });
  } catch (error) {
    console.error("User Creation Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
