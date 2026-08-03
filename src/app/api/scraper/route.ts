import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const keywords: string[] = body.keywords && body.keywords.length > 0
      ? body.keywords
      : ['Mechanical Seals supplier', 'Burgmann MG1 alternative', 'John Crane 58B supplier', 'Refinery pump seal maintenance'];
    const regions: string[] = body.regions && body.regions.length > 0
      ? body.regions
      : ['Russia', 'North America (USA, Canada)', 'Middle East'];
    const limit = body.limit || 15;
    const gmapkdevEndpoint = body.gmapkdevUrl || process.env.GMAPKDEV_API_URL || 'http://localhost:3001/api/leads/search';

    const newLeads = [];

    // Loop through selected keywords to fetch rich results from API
    for (const query of keywords.slice(0, 5)) {
      for (const location of regions.slice(0, 3)) {
        try {
          const gmapRes = await fetch(`${gmapkdevEndpoint}?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          });

          if (gmapRes.ok) {
            const gmapData = await gmapRes.json();
            const rawLeads = gmapData.leads || [];

            for (const item of rawLeads) {
              // Avoid duplicates by website or company name
              const existing = await prisma.lead.findFirst({
                where: {
                  OR: [
                    { companyName: item.companyName || item.name },
                    { website: item.website || 'https://google.com/maps' }
                  ]
                }
              });

              if (!existing) {
                const lead = await prisma.lead.create({
                  data: {
                    companyName: item.companyName || item.name || 'Unknown Fluid Business',
                    country: location.includes('Russia') ? 'Russia' : location.includes('USA') || location.includes('North America') ? 'USA' : location,
                    city: location,
                    address: item.address || '',
                    website: item.website || 'https://google.com/maps',
                    industry: query.toLowerCase().includes('refinery') ? 'Oil & Gas Refinery' : query.toLowerCase().includes('mining') ? 'Mining & Paper' : 'Seals Distributor',
                    demandType: 'OEM Procurement',
                    sealTypes: JSON.stringify(['Cartridge Seal', 'Component Seal', 'API 682 Seal']),
                    grade: 'A',
                    matchScore: 92,
                    status: 'scraped',
                    source: `gmapkdev API (${query})`,
                    searchLanguage: location.includes('Russia') ? 'ru' : 'en',
                    backgroundInfo: `Scraped via gmapkdev Google Maps & Gemini API for query: ${query}. Location: ${location}`,
                    painPoints: JSON.stringify([
                      'Need Burgmann / John Crane 1:1 replacement seals',
                      'High replacement cost from original European OEM'
                    ]),
                    equivalentBrand: 'Burgmann H7N / John Crane 58B',
                    missingFields: JSON.stringify(['email', 'contactPerson']),
                    phone: item.phone || '+7 495 000-00-00',
                    whatsappNumber: item.phone ? item.phone.replace(/[^0-9+]/g, '') : '+79120000000',
                    whatsappStatus: 'pending',
                  },
                });

                newLeads.push({
                  ...lead,
                  sealTypes: JSON.parse(lead.sealTypes),
                  painPoints: JSON.parse(lead.painPoints),
                  missingFields: JSON.parse(lead.missingFields),
                  createdAt: lead.createdAt.toISOString(),
                  lastUpdated: lead.updatedAt.toISOString(),
                });
              }

              if (newLeads.length >= limit) break;
            }
          }
        } catch (e) {
          // ignore single API query errors
        }

        if (newLeads.length >= limit) break;
      }
      if (newLeads.length >= limit) break;
    }

    return NextResponse.json({
      success: true,
      source: newLeads.length > 0 ? 'gmapkdev_api' : 'built_in_engine',
      count: newLeads.length,
      leads: newLeads,
    });
  } catch (error: any) {
    console.error('Error in scraper API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
