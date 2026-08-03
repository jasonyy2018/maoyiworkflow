import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_LEADS } from '@/lib/data';

export async function GET() {
  try {
    let dbLeads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Seed initial leads into SQLite if database is empty
    if (dbLeads.length === 0) {
      for (const lead of INITIAL_LEADS) {
        await prisma.lead.create({
          data: {
            id: lead.id,
            companyName: lead.companyName,
            country: lead.country,
            city: lead.city,
            address: lead.address,
            website: lead.website,
            industry: lead.industry,
            demandType: lead.demandType,
            sealTypes: JSON.stringify(lead.sealTypes),
            grade: lead.grade,
            matchScore: lead.matchScore,
            status: lead.status,
            source: lead.source,
            searchLanguage: lead.searchLanguage,
            backgroundInfo: lead.backgroundInfo,
            painPoints: JSON.stringify(lead.painPoints),
            equivalentBrand: lead.equivalentBrand,
            missingFields: JSON.stringify(lead.missingFields),
            contactPerson: lead.contactPerson,
            title: lead.title,
            email: lead.email,
            phone: lead.phone,
            whatsappNumber: lead.whatsappNumber,
            whatsappStatus: lead.whatsappStatus,
            linkedinUrl: lead.linkedinUrl,
          },
        });
      }
      dbLeads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    const formatted = dbLeads.map((l) => ({
      ...l,
      sealTypes: JSON.parse(l.sealTypes || '[]'),
      painPoints: JSON.parse(l.painPoints || '[]'),
      missingFields: JSON.parse(l.missingFields || '[]'),
      createdAt: l.createdAt.toISOString(),
      lastUpdated: l.updatedAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching leads from SQLite DB:', error);
    return NextResponse.json({ error: 'Failed to fetch leads from SQLite' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prisma.lead.create({
      data: {
        companyName: body.companyName,
        country: body.country,
        city: body.city,
        address: body.address,
        website: body.website,
        industry: body.industry || 'Pump OEM',
        demandType: body.demandType || 'OEM Procurement',
        sealTypes: JSON.stringify(body.sealTypes || []),
        grade: body.grade || 'A',
        matchScore: body.matchScore || 90,
        status: body.status || 'scraped',
        source: body.source || 'Scraper Engine',
        searchLanguage: body.searchLanguage || 'en',
        backgroundInfo: body.backgroundInfo || '',
        painPoints: JSON.stringify(body.painPoints || []),
        equivalentBrand: body.equivalentBrand,
        missingFields: JSON.stringify(body.missingFields || []),
        contactPerson: body.contactPerson,
        title: body.title,
        email: body.email,
        phone: body.phone,
        whatsappNumber: body.whatsappNumber,
        whatsappStatus: body.whatsappStatus || 'pending',
        linkedinUrl: body.linkedinUrl,
      },
    });

    return NextResponse.json({
      ...created,
      sealTypes: JSON.parse(created.sealTypes),
      painPoints: JSON.parse(created.painPoints),
      missingFields: JSON.parse(created.missingFields),
      createdAt: created.createdAt.toISOString(),
      lastUpdated: created.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error creating lead in SQLite:', error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
