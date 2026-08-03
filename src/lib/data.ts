import { Lead, SocialPost, SystemStats } from '@/types/workflow';

export const BILINGUAL_KEYWORDS_PRESETS = [
  {
    category: 'Russian Market (俄语专区)',
    keywords: [
      'торцевое уплотнение закупка',
      'дистрибьютор торцовых уплотнений',
      'насосы уплотнения поставщик Россия',
      'аналоги Burgmann MG1 закупка',
      'замена John Crane 58B уплотнение',
      'картриджные уплотнения ремонт НПЗ',
      'сальниковые уплотнения химический насос'
    ]
  },
  {
    category: 'Global English (英语专区)',
    keywords: [
      'Mechanical seal supplier B2B',
      'John Crane alternative manufacturer',
      'Burgmann mechanical seal replacement',
      'Slurry pump mechanical seal procurement',
      'API 682 cartridge seal exporter',
      'Dry gas seal maintenance supplier'
    ]
  },
  {
    category: 'Middle East & CIS (中东与独联体)',
    keywords: [
      'Refinery pump seal supplier Dubai',
      'Oilfield mechanical seals distributor Kazakhstan',
      'Chemical seal repair workshop UAE',
      'High temperature seal supplier Baku'
    ]
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    companyName: 'Ural Hydro-Pump & Seals LLC (УралГидроНасос)',
    country: 'Russia',
    city: 'Yekaterinburg',
    address: 'ул. Машиностроителей 19, Екатеринбург',
    website: 'https://ural-hydropump.ru',
    industry: 'Pump OEM',
    demandType: 'OEM Matching',
    sealTypes: ['Cartridge Seal', 'Component Seal'],
    grade: 'A',
    matchScore: 96,
    status: 'wa_verified',
    source: 'Yandex B2B Scraper (Russian)',
    searchLanguage: 'ru',
    backgroundInfo: 'Leading manufacturer of industrial centrifugal pumps for Russian oil refineries and chemical plants. Currently sourcing alternatives to Burgmann H7N and John Crane 58B.',
    painPoints: [
      'Original Burgmann seals prices increased by 65% due to sanctions',
      'Need direct factory supply with 46080-hour lifespan warranty',
      'Require Silicon Carbide (SiC) vs SiC hard face materials'
    ],
    equivalentBrand: 'Burgmann H7N / John Crane 58B',
    missingFields: [],
    contactPerson: 'Alexei Volkov (Алексей Волков)',
    title: 'Head of Procurement & Technical Supply',
    email: 'a.volkov@ural-hydropump.ru',
    phone: '+7 343 289-44-12',
    whatsappNumber: '+79122458890',
    whatsappStatus: 'verified',
    linkedinUrl: 'https://linkedin.com/in/alexei-volkov-pump-tech',
    createdAt: '2026-08-01T09:30:00Z',
    lastUpdated: '2026-08-03T11:20:00Z'
  },
  {
    id: 'lead-102',
    companyName: 'Novosibirsk Chemical Processing Ltd (НовосибирскХимПолимер)',
    country: 'Russia',
    city: 'Novosibirsk',
    website: 'https://novosib-chem.ru',
    industry: 'Chemical Plant',
    demandType: 'Plant Maintenance',
    sealTypes: ['Slurry Seal', 'Agitator Seal'],
    grade: 'A',
    matchScore: 92,
    status: 'enriched',
    source: 'Google CIS B2B Scraper',
    searchLanguage: 'bilingual',
    backgroundInfo: 'Major chemical fertilizer and polymer manufacturer operating 14 heavy acid pump lines requiring corrosive-resistant agitator mechanical seals.',
    painPoints: [
      'Severe corrosion on standard SS316L housing, requiring Hastelloy C-276 alloy',
      'Long lead time (12 weeks) from European suppliers',
      'Urgent stock availability needed for Q3 maintenance turnaround'
    ],
    equivalentBrand: 'Flowserve QB / AESSEAL CDSA',
    missingFields: [],
    contactPerson: 'Dmitry Morozov',
    title: 'Chief Maintenance Engineer',
    email: 'd.morozov@novosib-chem.ru',
    phone: '+7 383 312-90-55',
    whatsappNumber: '+79139887766',
    whatsappStatus: 'verified',
    linkedinUrl: 'https://linkedin.com/in/dmitry-morozov-chem',
    createdAt: '2026-08-02T14:15:00Z',
    lastUpdated: '2026-08-03T10:45:00Z'
  },
  {
    id: 'lead-103',
    companyName: 'Gulf Fluid Machinery Systems FZE',
    country: 'UAE',
    city: 'Dubai',
    address: 'Jebel Ali Free Zone, South 3, Dubai',
    website: 'https://gulffluidseals.ae',
    industry: 'Seals Distributor',
    demandType: 'Distributor/Agent',
    sealTypes: ['Component Seal', 'Cartridge Seal', 'Dry Gas Seal'],
    grade: 'A',
    matchScore: 94,
    status: 'emailed',
    source: 'Dubai Chamber Directory',
    searchLanguage: 'en',
    backgroundInfo: 'Tier-1 mechanical seal and pump component distributor serving UAE, Oman, and Saudi Arabia oilfield service contractors.',
    painPoints: [
      'Seeking reliable Asian OEM partner for private label packaging',
      'Need competitive pricing for standard MG1 / 2100 component seals',
      'Requires rapid sample dispatch to Dubai hub'
    ],
    equivalentBrand: 'Burgmann MG1 / John Crane 2100',
    missingFields: [],
    contactPerson: 'Tariq Al-Mansoor',
    title: 'Managing Director & Partner',
    email: 'tariq@gulffluidseals.ae',
    phone: '+971 4 883-9120',
    whatsappNumber: '+971509123456',
    whatsappStatus: 'verified',
    linkedinUrl: 'https://linkedin.com/in/tariq-al-mansoor-fluid',
    createdAt: '2026-08-01T11:00:00Z',
    lastUpdated: '2026-08-03T08:15:00Z'
  },
  {
    id: 'lead-104',
    companyName: 'Kazakhstan Oilfield Service Corporation (KazOilService)',
    country: 'Kazakhstan',
    city: 'Atyrau',
    website: 'https://kazoilservice.kz',
    industry: 'Oil & Gas Refinery',
    demandType: 'Plant Maintenance',
    sealTypes: ['Cartridge Seal', 'Dry Gas Seal'],
    grade: 'B',
    matchScore: 85,
    status: 'cleaned',
    source: 'CIS Oil & Gas Trade Portal',
    searchLanguage: 'ru',
    backgroundInfo: 'Provides oilfield pump overhaul services in Atyrau region. Consumes API 682 Plan 52/53 dual cartridge seals.',
    painPoints: [
      'High temperature seal face distortion during summer operation (+45°C)',
      'Looking for double seal barrier systems with pressure pots'
    ],
    equivalentBrand: 'John Crane Type 5620 / Burgmann Cartex',
    missingFields: ['contactPerson', 'email'],
    phone: '+7 7122 95-01-33',
    whatsappNumber: '+77015554321',
    whatsappStatus: 'unverified',
    createdAt: '2026-08-02T16:20:00Z',
    lastUpdated: '2026-08-03T09:00:00Z'
  },
  {
    id: 'lead-105',
    companyName: 'Stuttgart Industrietechnik GmbH',
    country: 'Germany',
    city: 'Stuttgart',
    website: 'https://stuttgart-industrietechnik.de',
    industry: 'Repair Workshop',
    demandType: 'Repair Workshop',
    sealTypes: ['Component Seal', 'Slurry Seal'],
    grade: 'B',
    matchScore: 81,
    status: 'scraped',
    source: 'EU Industrial Directory',
    searchLanguage: 'en',
    backgroundInfo: 'Industrial gearbox and pump repair center for Southern Germany manufacturing plants.',
    painPoints: [
      'Need fast replacement seal faces (SiC / Carbon / TC rings) in standard metric sizes',
      'Small batch order flexibility needed'
    ],
    equivalentBrand: 'Burgmann M3N / M7N',
    missingFields: ['contactPerson', 'whatsappNumber', 'linkedinUrl'],
    email: 'info@stuttgart-industrietechnik.de',
    phone: '+49 711 9876543',
    whatsappStatus: 'pending',
    createdAt: '2026-08-03T02:10:00Z',
    lastUpdated: '2026-08-03T02:10:00Z'
  },
  {
    id: 'lead-106',
    companyName: 'PT Nusantara Mining Equipment',
    country: 'Indonesia',
    city: 'Jakarta',
    website: 'https://nusantara-mining.co.id',
    industry: 'Mining & Paper',
    demandType: 'OEM Matching',
    sealTypes: ['Slurry Seal'],
    grade: 'C',
    matchScore: 68,
    status: 'scraped',
    source: 'SE Asia B2B Trade Leads',
    searchLanguage: 'en',
    backgroundInfo: 'Heavy mining slurry pump repair contractor operating in Kalimantan copper mines.',
    painPoints: [
      'Slurry seal erosion under 40% solids concentration',
      'Require tungsten carbide vs tungsten carbide faces'
    ],
    equivalentBrand: 'Warman Slurry Seal / Chesterton 170',
    missingFields: ['email', 'phone', 'contactPerson'],
    whatsappStatus: 'pending',
    createdAt: '2026-08-03T05:40:00Z',
    lastUpdated: '2026-08-03T05:40:00Z'
  },
  {
    id: 'lead-107',
    companyName: 'Moskva General Hardware Trading House',
    country: 'Russia',
    city: 'Moscow',
    website: 'https://moskva-hardware-trade.ru',
    industry: 'Seals Distributor',
    demandType: 'General Inquiry',
    sealTypes: ['Component Seal'],
    grade: 'D',
    matchScore: 35,
    status: 'cleaned',
    source: 'Yandex General Directory',
    searchLanguage: 'ru',
    backgroundInfo: 'General consumer hardware store selling garden water pump seals and plumbing washers. Low volume commercial relevance.',
    painPoints: ['Only looking for cheap 12mm rubber o-rings and household garden pump spares'],
    missingFields: ['contactPerson'],
    email: 'sales@moskva-hardware-trade.ru',
    phone: '+7 495 123-45-67',
    whatsappStatus: 'not_registered',
    createdAt: '2026-08-02T11:00:00Z',
    lastUpdated: '2026-08-03T07:30:00Z'
  }
];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-201',
    platform: 'LinkedIn',
    title: 'Solving Mechanical Seal Leakage in High-Corrosion Petrochemical Pumps',
    content: '🔧 Experiencing premature seal failure under high pressure in chemical pumps?\n\nOriginal Burgmann or John Crane cartridge seals often incur long lead times and high replacement costs. Queeny Q-H7N Series double cartridge mechanical seals feature SiC/SiC hard faces and Hastelloy C spring units, offering a direct 1:1 drop-in replacement with 45% cost savings.\n\n✅ ISO 9001 & CE Certified\n✅ Rapid 7-day dispatch to global ports\n✅ Customized face materials for aggressive acids\n\nContact our engineering team today for technical cross-reference catalogs!',
    mediaType: 'image',
    mediaUrl: '/images/social/linkedin-cartridge-seal.jpg',
    scheduledTime: '2026-08-04T10:00:00Z',
    status: 'scheduled',
    hashtags: ['#MechanicalSeals', '#PumpMaintenance', '#BurgmannAlternative', '#JohnCraneAlternative', '#B2BExport'],
    aiSource: 'Coze Engine'
  },
  {
    id: 'post-202',
    platform: 'YouTube',
    title: 'Russian Subtitles: High-Pressure Mechanical Seal Hydrostatic Test Demo (Торцевые уплотнения)',
    content: 'Watch our 4.0MPa pressure hydrostatic seal chamber test! Demonstrating zero leakage performance for Queeny Q-58B seals under extreme temperature cycles.\n\n0:00 Introduction\n1:15 Seal Assembly Inspection\n2:30 Hydrostatic Pressure Test (40 Bar)\n4:10 Russian Market Direct Supply Advantages',
    mediaType: 'video',
    mediaUrl: '/videos/social/seal-test-demo.mp4',
    scheduledTime: '2026-08-05T14:30:00Z',
    status: 'scheduled',
    hashtags: ['#ТорцевоеУплотнение', '#MechanicalSealTest', '#PumpRepair', '#RefinerySeals'],
    aiSource: 'Feishu Plugin'
  },
  {
    id: 'post-203',
    platform: 'Facebook',
    title: 'Fast-Track Supply of Mechanical Seals for CIS & Middle East Pump Distributors',
    content: 'Looking for a reliable factory partner for standard Burgmann MG1, M3N, and John Crane 2100 component seals?\n\nQueeny Seal Solutions guarantees top quality, laser-etched model numbering, and custom OEM branding for your distribution business.',
    mediaType: 'carousel',
    mediaUrl: '/images/social/fb-component-seals.jpg',
    scheduledTime: '2026-08-06T09:00:00Z',
    status: 'draft',
    hashtags: ['#FluidHandling', '#SealDistributor', '#IndustrialPumps'],
    aiSource: 'Auto Marketing Engine'
  }
];

export const INITIAL_SYSTEM_STATS: SystemStats = {
  totalScraped: 148,
  gradeA: 42,
  gradeB: 58,
  gradeC: 32,
  gradeD: 16,
  enrichedCount: 94,
  emailsSent: 68,
  waVerifiedCount: 76,
  waSentCount: 52,
  socialPostsScheduled: 12
};
