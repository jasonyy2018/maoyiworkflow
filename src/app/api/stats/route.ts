import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SystemStats } from '@/types/workflow';

export async function GET() {
  try {
    const [totalScraped, gradeA, gradeB, gradeC, gradeD, enrichedCount, emailsSent, waVerifiedCount, waSentCount, socialPostsScheduled] =
      await Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { grade: 'A' } }),
        prisma.lead.count({ where: { grade: 'B' } }),
        prisma.lead.count({ where: { grade: 'C' } }),
        prisma.lead.count({ where: { grade: 'D' } }),
        prisma.lead.count({
          where: {
            OR: [{ contactPerson: { not: null } }, { email: { not: null } }],
          },
        }),
        prisma.lead.count({ where: { status: 'emailed' } }),
        prisma.lead.count({ where: { whatsappStatus: 'verified' } }),
        prisma.lead.count({ where: { status: 'wa_verified' } }),
        prisma.socialPost.count(),
      ]);

    const stats: SystemStats = {
      totalScraped,
      gradeA,
      gradeB,
      gradeC,
      gradeD,
      enrichedCount,
      emailsSent,
      waVerifiedCount,
      waSentCount,
      socialPostsScheduled,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error computing stats:', error);
    return NextResponse.json(
      {
        totalScraped: 0,
        gradeA: 0,
        gradeB: 0,
        gradeC: 0,
        gradeD: 0,
        enrichedCount: 0,
        emailsSent: 0,
        waVerifiedCount: 0,
        waSentCount: 0,
        socialPostsScheduled: 0,
      } as SystemStats,
      { status: 500 }
    );
  }
}
