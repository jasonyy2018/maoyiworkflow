import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteCtx {
  params: Promise<{ id: string }>;
}

function formatPost(p: any) {
  return {
    ...p,
    hashtags: JSON.parse(p.hashtags || '[]'),
    scheduledTime: p.scheduledTime.toISOString(),
  };
}

export async function PATCH(request: Request, ctx: RouteCtx) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();

    const data: any = {};
    const scalar = [
      'platform', 'title', 'content', 'mediaType', 'mediaUrl', 'status', 'aiSource',
    ];
    for (const field of scalar) {
      if (body[field] !== undefined) data[field] = body[field];
    }
    if (Array.isArray(body.hashtags)) data.hashtags = JSON.stringify(body.hashtags);
    if (body.scheduledTime) data.scheduledTime = new Date(body.scheduledTime);

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 });
    }

    const updated = await prisma.socialPost.update({ where: { id }, data });
    return NextResponse.json(formatPost(updated));
  } catch (error: any) {
    console.error('Error updating social post:', error?.message || error);
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update social post' }, { status: 500 });
  }
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
