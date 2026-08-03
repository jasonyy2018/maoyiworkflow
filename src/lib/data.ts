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
    category: 'North America Market (北美专区)',
    keywords: [
      'Mechanical seal supplier USA',
      'Pump mechanical seal supplier Canada',
      'API 682 cartridge seal distributor Houston',
      'John Crane 58B equivalent supplier Texas',
      'Refinery pump seal maintenance Alberta',
      'Slurry pump seals mining Ontario',
      'Custom mechanical seal manufacturer USA'
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

export const INITIAL_LEADS: Lead[] = [];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [];

export const INITIAL_SYSTEM_STATS: SystemStats = {
  totalScraped: 0,
  gradeA: 0,
  gradeB: 0,
  gradeC: 0,
  gradeD: 0,
  enrichedCount: 0,
  emailsSent: 0,
  waVerifiedCount: 0,
  waSentCount: 0,
  socialPostsScheduled: 0
};
