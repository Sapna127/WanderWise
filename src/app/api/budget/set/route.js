import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { userId, amount, currency } = await req.json();
    const budget = await prisma.budget.create({
      data: { userId, amount, currency }
    });
    return new Response(JSON.stringify(budget), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to set budget' }), { status: 500 });
  }
}
