import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { simulateDataScrape } from '@/lib/ai-services';

// Seeds realistic demo leads (mechanical seals B2B) so the workflow is not blank
// on first launch. Skips seeding when leads already exist.
export async function POST() {
  try {
    const existing = await prisma.lead.count();
    if (existing > 0) {
      return NextResponse.json({
        success: true,
        skipped: true,
        count: 0,
        message: 'Leads already exist in the database; nothing was seeded.',
      });
    }

    const demoLeads = await simulateDataScrape({
      keywords: ['Mechanical seal supplier', 'John Crane alternative'],
      languages: ['en', 'ru'],
      regions: ['Russia', 'North America', 'Middle East'],
      industryFilter: ['Pump OEM', 'Oil & Gas Refinery'],
      limit: 6,
    });

    const created: any[] = [];
    for (const lead of demoLeads) {
      const row = await prisma.lead.create({
        data: {
          companyName: lead.companyName,
          country: lead.country,
          city: lead.city,
          address: lead.address,
          website: lead.website,
          industry: lead.industry,
          demandType: lead.demandType,
          sealTypes: JSON.stringify(lead.sealTypes || []),
          grade: lead.grade || 'A',
          matchScore: lead.matchScore ?? 90,
          status: lead.status || 'scraped',
          source: lead.source || 'Seed Engine',
          searchLanguage: lead.searchLanguage || 'en',
          backgroundInfo: lead.backgroundInfo || '',
          painPoints: JSON.stringify(lead.painPoints || []),
          equivalentBrand: lead.equivalentBrand,
          missingFields: JSON.stringify(lead.missingFields || []),
          contactPerson: lead.contactPerson,
          title: lead.title,
          email: lead.email,
          phone: lead.phone,
          whatsappNumber: lead.whatsappNumber,
          whatsappStatus: lead.whatsappStatus || 'pending',
          linkedinUrl: lead.linkedinUrl,
          notes: lead.notes,
        },
      });
      created.push({
        ...row,
        sealTypes: JSON.parse(row.sealTypes || '[]'),
        painPoints: JSON.parse(row.painPoints || '[]'),
        missingFields: JSON.parse(row.missingFields || '[]'),
        createdAt: row.createdAt.toISOString(),
        lastUpdated: row.updatedAt.toISOString(),
      });
    }

    return NextResponse.json({ success: true, count: created.length, leads: created });
  } catch (error) {
    console.error('Error seeding leads:', error);
    return NextResponse.json({ error: 'Failed to seed demo leads' }, { status: 500 });
  }
}
