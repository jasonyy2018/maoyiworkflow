import { Lead, LeadGrade, ScrapeTaskConfig, SocialPost, WhatsAppStatus } from '@/types/workflow';

/**
 * Simulates bilingual data scraping (English / Russian) for Mechanical Seals
 */
export async function simulateDataScrape(config: ScrapeTaskConfig): Promise<Lead[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const newLeads: Lead[] = [
    {
      id: `lead-scraped-${Date.now()}-1`,
      companyName: 'Gazpromneft Pump Engineering Works (Газпромнефть-Насос)',
      country: 'Russia',
      city: 'Omsk',
      website: 'https://omsk-pump-gazprom.ru',
      industry: 'Oil & Gas Refinery',
      demandType: 'Plant Maintenance',
      sealTypes: ['Cartridge Seal', 'Dry Gas Seal'],
      grade: 'A',
      matchScore: 98,
      status: 'scraped',
      source: 'Yandex RU B2B Scraper Engine',
      searchLanguage: 'ru',
      backgroundInfo: 'Major refinery pump overhaul division seeking replacement dual cartridge seals for sour gas and heavy oil pumps.',
      painPoints: [
        'High temperature hydrogen sulfide corrosion on standard rubber o-rings',
        'Urgent need for FFKM secondary seals & 1:1 Burgmann Cartex replacements'
      ],
      equivalentBrand: 'Burgmann Cartex-DN / John Crane Type 5620',
      missingFields: ['email', 'contactPerson'],
      phone: '+7 3812 66-90-00',
      whatsappNumber: '+79136001122',
      whatsappStatus: 'pending',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    },
    {
      id: `lead-scraped-${Date.now()}-2`,
      companyName: 'Baku Petrochemical Fluid Tech MMC',
      country: 'Azerbaijan',
      city: 'Baku',
      website: 'https://bakupetrofluid.az',
      industry: 'Chemical Plant',
      demandType: 'OEM Matching',
      sealTypes: ['Component Seal', 'Agitator Seal'],
      grade: 'B',
      matchScore: 84,
      status: 'scraped',
      source: 'CIS Industrial Search',
      searchLanguage: 'bilingual',
      backgroundInfo: 'Chemical mixer & reactor OEM in Baku. Assembles high-pressure reactor seals for fertilizer plants.',
      painPoints: [
        'Requires dry running agitator seals with cooling jackets',
        'Looking for competitive OEM pricing compared to European imports'
      ],
      equivalentBrand: 'AESSEAL BDFI / EKATO alternative',
      missingFields: ['whatsappNumber', 'linkedinUrl'],
      email: 'tech@bakupetrofluid.az',
      phone: '+994 12 498-7711',
      whatsappStatus: 'pending',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
  ];

  return newLeads;
}

/**
 * AI Lead Background Check & Grading Logic (A, B, C, D)
 */
export function evaluateAndGradeLead(lead: Lead): { grade: LeadGrade; score: number; reasoning: string } {
  let score = 50;
  let reasoning = '';

  if (lead.industry === 'Pump OEM' || lead.industry === 'Oil & Gas Refinery' || lead.industry === 'Chemical Plant') {
    score += 30;
  } else if (lead.industry === 'Seals Distributor' || lead.industry === 'Repair Workshop') {
    score += 20;
  } else {
    score -= 10;
  }

  if (lead.demandType === 'OEM Matching' || lead.demandType === 'Plant Maintenance') {
    score += 15;
  }

  if (lead.equivalentBrand) {
    score += 10;
  }

  let grade: LeadGrade = 'C';
  if (score >= 90) {
    grade = 'A';
    reasoning = 'A级 (特优客户): 核心泵厂 OEM / 炼油化工厂大用户，明确替换需求 (Burgmann/John Crane 替代)，采购量大、预算充足。';
  } else if (score >= 75) {
    grade = 'B';
    reasoning = 'B级 (优质客户): 区域机械密封分销商或中型维修工厂，具备重复采购能力与长远合作潜力。';
  } else if (score >= 50) {
    grade = 'C';
    reasoning = 'C级 (一般客户): 小型维修店铺或通用五金贸易商，需求零散或采购周期较长。';
  } else {
    grade = 'D';
    reasoning = 'D级 (无效/弃用): 需求不匹配，如家用花洒水泵或个人配件购买，建议直接丢弃。';
  }

  return { grade, score, reasoning };
}

/**
 * Enriches missing contact info (email, title, WhatsApp, LinkedIn)
 */
export function enrichLeadInfo(lead: Lead): Lead {
  const updated = { ...lead };
  const missing: string[] = [];

  // Generate plausible contact person & email if missing
  if (!updated.contactPerson) {
    if (updated.country === 'Russia' || updated.country === 'Kazakhstan') {
      updated.contactPerson = 'Ivan Petrov (Иван Петров)';
      updated.title = 'Head of Technical Procurement';
    } else if (updated.country === 'UAE') {
      updated.contactPerson = 'Rashid Al-Hassan';
      updated.title = 'Supply Chain Manager';
    } else {
      updated.contactPerson = 'Markus Weber';
      updated.title = 'Director of Equipment Maintenance';
    }
  }

  if (!updated.email) {
    const domain = updated.website.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const namePart = updated.contactPerson ? updated.contactPerson.toLowerCase().split(' ')[0] : 'info';
    updated.email = `${namePart}@${domain}`;
  }

  if (!updated.whatsappNumber && updated.phone) {
    updated.whatsappNumber = updated.phone.replace(/[^0-9+]/g, '');
  }

  if (!updated.linkedinUrl) {
    const cleanCompany = encodeURIComponent(updated.companyName.split(' ')[0]);
    updated.linkedinUrl = `https://linkedin.com/company/${cleanCompany}`;
  }

  updated.missingFields = missing;
  updated.status = 'enriched';
  updated.lastUpdated = new Date().toISOString();

  return updated;
}

/**
 * AI 1-on-1 Cold Email Generator (Personalized according to Mechanical Seal Pain Points)
 */
export function generateColdEmailText(lead: Lead, language: 'en' | 'ru' = 'en'): { subject: string; body: string } {
  const isRussian = language === 'ru' || (lead.country === 'Russia' || lead.country === 'Kazakhstan');

  if (isRussian) {
    return {
      subject: `Прямые поставки торцовых уплотнений (Аналоги ${lead.equivalentBrand || 'Burgmann / John Crane'}) для ${lead.companyName}`,
      body: `Уважаемый(ая) ${lead.contactPerson || 'Руководитель отдела закупок'},\n\n` +
            `Здравствуйте!\n\n` +
            `Меня зовут Queeny, я представляю завод-изготовитель высокоточных промышленных торцовых уплотнений.\n\n` +
            `Мы изучили деятельность ${lead.companyName} в сфере ${lead.industry === 'Pump OEM' ? 'производства насосного оборудования' : 'обслуживания технологических установок'} и понимаем текущие вызовы на рынке:\n` +
            `1. Сроки поставки оригинальных европейских уплотнений (Burgmann, John Crane, Flowserve) существенно увеличились.\n` +
            `2. Высокие затраты на комплектующие при жестких требованиях к герметичности и коррозионной стойкости (SiC/SiC, TC/TC, Hastelloy).\n\n` +
            `Наш завод предлагает 100% конструктивные аналоги серий ${lead.equivalentBrand || 'MG1, H7N, 58B, Cartex'}:\n` +
            `• Снижение стоимости на 40-50% по сравнению с европейскими брендами.\n` +
            `• Быстрая отгрузка (7-10 дней) с предоставлением гарантии 46080 часов работы.\n` +
            `• Полное соответствие стандартам ISO 9001, API 682 и ГОСТ.\n\n` +
            `Будем рады выслать каталог кросс-номеров и предоставить тестовый комплект уплотнений для испытаний.\n\n` +
            `С уважением,\n` +
            `Queeny AI Team | Mechanical Seals Export Dept.\n` +
            `WhatsApp: +86 189 0000 8888\n` +
            `Email: export@queeny-seals.com`
    };
  }

  return {
    subject: `1:1 Drop-in Mechanical Seal Replacements (${lead.equivalentBrand || 'Burgmann & John Crane Alternative'}) for ${lead.companyName}`,
    body: `Dear ${lead.contactPerson || 'Procurement Director'},\n\n` +
          `I hope this email finds you well.\n\n` +
          `I noticed ${lead.companyName}'s expertise in ${lead.industry} operating high-performance fluid pumps. Many engineering teams today are facing challenges with high OEM prices and extended lead times (8-12 weeks) for standard cartridge & component mechanical seals.\n\n` +
          `At Queeny Seal Solutions, we manufacture direct 1:1 dimensionally interchangeable mechanical seals equivalent to ${lead.equivalentBrand || 'Burgmann, John Crane, and Flowserve'}:\n\n` +
          `• 40-50% Cost Efficiency without sacrificing hard-face quality (SiC, Tungsten Carbide, FFKM).\n` +
          `• Rapid 7 to 14 Days Dispatch directly to global ports.\n` +
          `• Full API 682 & ISO 9001 Quality Assurance with test reports.\n\n` +
          `Would you be open to receiving our cross-reference catalog or requesting a sample seal set for testing on your pump lines?\n\n` +
          `Best regards,\n\n` +
          `Queeny Sales Team | Mechanical Seal Engineering\n` +
          `WhatsApp: +86 189 0000 8888\n` +
          `Website: https://queeny-seals.com`
  };
}

/**
 * WhatsApp Batch Validator Simulation
 */
export function validateWhatsAppNumber(phone: string): { formattedNumber: string; status: WhatsAppStatus } {
  let cleaned = phone.replace(/[^0-9+]/g, '');

  if (cleaned.startsWith('8') && cleaned.length === 11) {
    cleaned = '+7' + cleaned.substring(1); // Standardize Russian numbers starting with 8 to +7
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  // Determine status simulation
  if (cleaned.length < 9) {
    return { formattedNumber: cleaned, status: 'not_registered' };
  }

  // 90% verified rate simulation
  return { formattedNumber: cleaned, status: 'verified' };
}

/**
 * WhatsApp 1-on-1 Personalized Message Generator
 */
export function generateWhatsAppMessage(lead: Lead): string {
  const isRussian = lead.country === 'Russia' || lead.country === 'Kazakhstan';

  if (isRussian) {
    return `Здравствуйте, ${lead.contactPerson || 'коллега'}! 🖐️\n` +
           `Пишу вам по поводу поставки торцовых уплотнений для ${lead.companyName}.\n` +
           `Мы производим 1:1 конструктивные аналоги ${lead.equivalentBrand || 'Burgmann / John Crane'} с экономией 40% и доставкой от 7 дней.\n` +
           `Могу прислать каталог кросс-номеров и прайс в формате PDF? 📄`;
  }

  return `Hi ${lead.contactPerson || 'there'}! 🖐️\n` +
         `Greetings from Queeny Seals! Reaching out regarding high-performance mechanical seals for ${lead.companyName}.\n` +
         `We provide direct 1:1 replacement seals for ${lead.equivalentBrand || 'Burgmann & John Crane'} with 40% cost saving & 7-day fast dispatch.\n` +
         `Would you like me to send our latest catalog & cross-reference guide PDF? 📄`;
}

/**
 * AI Social Media Post Creator (Coze / Feishu style)
 */
export function generateAISocialPost(platform: 'LinkedIn' | 'YouTube' | 'Facebook' | 'Instagram', topic: string): SocialPost {
  const id = `post-ai-${Date.now()}`;
  const hashtags = ['#MechanicalSeals', '#PumpMaintenance', '#BurgmannAlternative', '#JohnCraneAlternative', '#B2BExport'];

  if (platform === 'LinkedIn') {
    return {
      id,
      platform: 'LinkedIn',
      title: `B2B Insights: ${topic}`,
      content: `⚙️ Maximizing Pump Reliability in Harsh Environments\n\nDid you know over 70% of centrifugal pump downtime is caused by mechanical seal leakage? Switching to premium Silicon Carbide (SiC) face combinations dramatically extends MTBF (Mean Time Between Failures).\n\nQueeny Q-Series Seals deliver 1:1 exact fitments for major OEM brands.\n\n👇 Read our full case study below.`,
      mediaType: 'image',
      mediaUrl: '/images/social/linkedin-cartridge-seal.jpg',
      scheduledTime: new Date(Date.now() + 86400000 * 2).toISOString(),
      status: 'scheduled',
      hashtags,
      aiSource: 'Coze Engine'
    };
  }

  return {
    id,
    platform,
    title: `Mechanical Seal Demo - ${topic}`,
    content: `Check out our latest product breakdown for ${platform}! Premium engineering for global B2B procurement teams.`,
    mediaType: 'image',
    mediaUrl: '/images/social/fb-component-seals.jpg',
    scheduledTime: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: 'scheduled',
    hashtags,
    aiSource: 'Feishu Plugin'
  };
}
