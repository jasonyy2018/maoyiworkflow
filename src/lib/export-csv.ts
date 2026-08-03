'use client';

// Client-side CSV export for the lead pool (BAOM-prefixed BOM so Excel opens UTF-8 correctly).
export function exportLeadsCsv(leads: any[], filename: string) {
  const headers = [
    '公司名称', '国家', '城市', '地址', '行业', '需求类型', '密封类型', '对应原厂牌号',
    '客户级别', '匹配度', '决策人', '职位', '邮箱', '电话', 'WhatsApp', 'WA状态',
    'LinkedIn', '来源', '背景调查', '创建时间',
  ];

  const rows = leads.map((l) => [
    l.companyName, l.country, l.city, l.address || '', l.industry, l.demandType,
    Array.isArray(l.sealTypes) ? l.sealTypes.join(' / ') : '',
    l.equivalentBrand || '', l.grade, l.matchScore, l.contactPerson || '',
    l.title || '', l.email || '', l.phone || '', l.whatsappNumber || '',
    l.whatsappStatus || '', l.linkedinUrl || '', l.source || '',
    l.backgroundInfo || '', l.createdAt ? new Date(l.createdAt).toLocaleDateString() : '',
  ]);

  const escape = (cell: unknown) => {
    const s = String(cell ?? '');
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };

  const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
