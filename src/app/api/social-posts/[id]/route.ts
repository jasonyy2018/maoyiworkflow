import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteCtx {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, ctx: RouteCtx) {
  try {
    const { id } = await ctx.params;
    await prisma.socialPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting social post:', error?.message || error);
    return NextResponse.json({ error: 'Failed to delete social post' }, { status: 500 });
  }
}
