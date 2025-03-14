// api/budget/set.js
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

// api/budget/expenses.js
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

// api/budget/summary.js
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { expenses: true }
    });
    return new Response(JSON.stringify(budgets), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch summary' }), { status: 500 });
  }
}

// api/budget/tips.js
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const amount = parseFloat(searchParams.get('amount'));
    const tips = [];

    if (amount > 100) tips.push('Consider using public transport instead of taxis.');
    if (amount > 500) tips.push('Review your subscription plans for unnecessary services.');
    
    return new Response(JSON.stringify({ tips }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch tips' }), { status: 500 });
  }
}
