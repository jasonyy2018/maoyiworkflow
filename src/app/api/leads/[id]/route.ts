import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteCtx {
  params: Promise<{ id: string }>;
}

function formatLead(l: any) {
  return {
    ...l,
    sealTypes: JSON.parse(l.sealTypes || '[]'),
    painPoints: JSON.parse(l.painPoints || '[]'),
    missingFields: JSON.parse(l.missingFields || '[]'),
    createdAt: l.createdAt.toISOString(),
    lastUpdated: l.updatedAt.toISOString(),
  };
}

export async function PATCH(request: Request, ctx: RouteCtx) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();

    const data: Record<string, unknown> = {};

    // Only touch fields that were actually provided in the patch.
    const scalarFields = [
      'companyName', 'country', 'city', 'address', 'website', 'industry',
      'demandType', 'grade', 'matchScore', 'status', 'source', 'searchLanguage',
      'backgroundInfo', 'equivalentBrand', 'contactPerson', 'title', 'email',
      'phone', 'whatsappNumber', 'whatsappStatus', 'linkedinUrl', 'notes',
    ];
    for (const field of scalarFields) {
      if (body[field] !== undefined) data[field] = body[field];
    }

    // JSON-string-encoded array columns
    const jsonFields = ['sealTypes', 'painPoints', 'missingFields'];
    for (const field of jsonFields) {
      if (Array.isArray(body[field])) data[field] = JSON.stringify(body[field]);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 });
    }

    const updated = await prisma.lead.update({
      where: { id },
      data,
    });

    return NextResponse.json(formatLead(updated));
  } catch (error: any) {
    console.error('Error updating lead:', error?.message || error);
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, ctx: RouteCtx) {
  try {
    const { id } = await ctx.params;
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting lead:', error?.message || error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
