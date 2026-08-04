'use client';

import { SocialPost, SystemStats } from '@/types/workflow';

// SQLite/Prisma returns JSON-array fields as strings; the API formats them for the client.
export interface LeadRecord {
  id: string;
  companyName: string;
  country: string;
  city: string;
  address?: string | null;
  website: string;
  industry: string;
  demandType: string;
  sealTypes: string[];
  grade: string;
  matchScore: number;
  status: string;
  source: string;
  searchLanguage: string;
  backgroundInfo: string;
  painPoints: string[];
  equivalentBrand?: string | null;
  missingFields: string[];
  contactPerson?: string | null;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsappNumber?: string | null;
  whatsappStatus: string;
  linkedinUrl?: string | null;
  notes?: string | null;
  createdAt: string;
  lastUpdated: string;
}

const jsonHeaders = { 'Content-Type': 'application/json' };

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const err = await res.json();
      if (err?.error) detail = err.error;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export async function fetchLeads(): Promise<LeadRecord[]> {
  const res = await fetch('/api/leads', { next: { revalidate: 0 } });
  return handle<LeadRecord[]>(res);
}

export async function updateLead(id: string, patch: Partial<LeadRecord>): Promise<LeadRecord> {
  const res = await fetch(`/api/leads/${id}`, {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify(patch),
  });
  return handle<LeadRecord>(res);
}

export async function deleteLead(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
  return handle<{ success: boolean }>(res);
}

export async function seedLeads(): Promise<{ count: number; leads: LeadRecord[] }> {
  const res = await fetch('/api/leads/seed', { method: 'POST' });
  return handle<{ count: number; leads: LeadRecord[] }>(res);
}

export async function clearAllLeads(): Promise<{ success: boolean }> {
  const res = await fetch('/api/leads', { method: 'DELETE' });
  return handle<{ success: boolean }>(res);
}

export async function fetchStats(): Promise<SystemStats> {
  const res = await fetch('/api/stats', { next: { revalidate: 0 } });
  return handle<SystemStats>(res);
}

export interface SocialPostRecord extends Omit<SocialPost, 'scheduledTime'> {
  scheduledTime: string;
}

export async function fetchSocialPosts(): Promise<SocialPostRecord[]> {
  const res = await fetch('/api/social-posts', { next: { revalidate: 0 } });
  return handle<SocialPostRecord[]>(res);
}

export async function createSocialPost(
  post: Omit<SocialPostRecord, 'id' | 'createdAt'>
): Promise<SocialPostRecord> {
  const res = await fetch('/api/social-posts', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(post),
  });
  return handle<SocialPostRecord>(res);
}

export async function deleteSocialPost(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/social-posts/${id}`, { method: 'DELETE' });
  return handle<{ success: boolean }>(res);
}

export async function updateSocialPost(
  id: string,
  patch: Partial<SocialPostRecord>
): Promise<SocialPostRecord> {
  const res = await fetch(`/api/social-posts/${id}`, {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify(patch),
  });
  return handle<SocialPostRecord>(res);
}

// Calls the /api/ai route (OpenAI-compatible). Returns { configured:false } when no
// API key is set; otherwise { configured:true, usedAi, ... } for the requested task.
export async function aiRun(body: Record<string, unknown>): Promise<any> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error('AI 请求失败');
  }
  return res.json();
}

// Real WhatsApp registration check via /api/whatsapp/verify. Returns
// { configured:false } when no provider is configured (client falls back to simulation).
export async function waVerify(number: string, country?: string): Promise<any> {
  const res = await fetch('/api/whatsapp/verify', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ number, country }),
  });
  if (!res.ok) {
    throw new Error('WA 校验请求失败');
  }
  return res.json();
}
