import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function formatPost(p: any) {
  return {
    ...p,
    hashtags: JSON.parse(p.hashtags || '[]'),
    scheduledTime: p.scheduledTime.toISOString(),
  };
}

export async function GET() {
  try {
    const posts = await prisma.socialPost.findMany({
      orderBy: { scheduledTime: 'asc' },
    });
    return NextResponse.json(posts.map(formatPost));
  } catch (error) {
    console.error('Error fetching social posts:', error);
    return NextResponse.json({ error: 'Failed to fetch social posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scheduledTime = body.scheduledTime ? new Date(body.scheduledTime) : new Date(Date.now() + 86400000);

    const created = await prisma.socialPost.create({
      data: {
        platform: body.platform || 'LinkedIn',
        title: body.title || 'Untitled post',
        content: body.content || '',
        mediaType: body.mediaType || 'image',
        mediaUrl: body.mediaUrl,
        scheduledTime,
        status: body.status || 'scheduled',
        hashtags: JSON.stringify(body.hashtags || []),
        aiSource: body.aiSource || 'Coze Engine',
      },
    });

    return NextResponse.json(formatPost(created));
  } catch (error) {
    console.error('Error creating social post:', error);
    return NextResponse.json({ error: 'Failed to create social post' }, { status: 500 });
  }
}
