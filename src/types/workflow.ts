export type LeadGrade = 'A' | 'B' | 'C' | 'D' | 'UNMATCHED';

export type DemandType = 'OEM Procurement' | 'OEM Matching' | 'Plant Maintenance' | 'Distributor/Agent' | 'Repair Workshop' | 'General Inquiry';

export type WhatsAppStatus = 'verified' | 'unverified' | 'not_registered' | 'pending';

export interface Lead {
  id: string;
  companyName: string;
  country: string;
  city: string;
  address?: string;
  website: string;
  industry: 'Pump OEM' | 'Oil & Gas Refinery' | 'Chemical Plant' | 'Seals Distributor' | 'Repair Workshop' | 'Mining & Paper';
  demandType: DemandType;
  sealTypes: string[]; // e.g. ['Cartridge Seal', 'Component Seal', 'Slurry Seal', 'Dry Gas Seal', 'Agitator Seal']
  grade: LeadGrade;
  matchScore: number; // 0 - 100
  status: 'scraped' | 'cleaned' | 'enriched' | 'emailed' | 'wa_verified' | 'converted';
  source: string;
  searchLanguage: 'en' | 'ru' | 'bilingual';
  backgroundInfo: string;
  painPoints: string[];
  equivalentBrand?: string; // e.g. "Burgmann MG1", "John Crane 58B", "Flowserve QB"
  missingFields: string[];
  contactPerson?: string;
  title?: string;
  email?: string;
  phone?: string;
  whatsappNumber?: string;
  whatsappStatus: WhatsAppStatus;
  linkedinUrl?: string;
  notes?: string;
  createdAt: string;
  lastUpdated: string;
}

export interface ScrapeTaskConfig {
  keywords: string[];
  languages: ('en' | 'ru')[];
  regions: string[];
  industryFilter: string[];
  limit: number;
}

export interface SocialPost {
  id: string;
  platform: 'LinkedIn' | 'YouTube' | 'Facebook' | 'Instagram';
  title: string;
  content: string;
  mediaType: 'image' | 'video' | 'carousel';
  mediaUrl?: string;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published';
  hashtags: string[];
  aiSource: 'Coze Engine' | 'Feishu Plugin' | 'Auto Marketing Engine';
}

export interface SystemStats {
  totalScraped: number;
  gradeA: number;
  gradeB: number;
  gradeC: number;
  gradeD: number;
  enrichedCount: number;
  emailsSent: number;
  waVerifiedCount: number;
  waSentCount: number;
  socialPostsScheduled: number;
}
