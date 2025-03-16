import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { budgetId, category, amount, currency } = await req.json();
    const expense = await prisma.expense.create({
      data: { budgetId, category, amount, currency }
    });
    return new Response(JSON.stringify(expense), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to add expense' }), { status: 500 });
  }
}
