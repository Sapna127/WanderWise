import prisma from '@/lib/prisma';

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
