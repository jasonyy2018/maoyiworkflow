'use client';

import React, { useState } from 'react';
import WorkflowStepper from '@/components/workflow-stepper';
import LeadModal from '@/components/lead-modal';
import { INITIAL_LEADS } from '@/lib/data';
import { enrichLeadInfo } from '@/lib/ai-services';
import { Lead } from '@/types/workflow';
import {
  UserCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  Globe,
  RefreshCw,
  Search
} from 'lucide-react';

export default function EnrichmentPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isBatchEnriching, setIsBatchEnriching] = useState(false);

  const handleBatchEnrich = () => {
    setIsBatchEnriching(true);
    setTimeout(() => {
      const enrichedAll = leads.map((lead) => enrichLeadInfo(lead));
      setLeads(enrichedAll);
      setIsBatchEnriching(false);
    }, 1200);
  };

  const handleUpdateLead = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setSelectedLead(updated);
  };

  const getCompletenessScore = (lead: Lead) => {
    let fields = 0;
    if (lead.contactPerson) fields++;
    if (lead.title) fields++;
    if (lead.email) fields++;
    if (lead.phone) fields++;
    if (lead.whatsappNumber) fields++;
    if (lead.linkedinUrl) fields++;
    return Math.round((fields / 6) * 100);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <WorkflowStepper />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <UserCheck className="h-6 w-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-white">模块三：深度信息补全 (Contact Enrichment)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            针对清洗后的潜在客户，自动补齐采购经理/总工姓名、验证电子邮箱、手机/WhatsApp号码及 LinkedIn 主页。
          </p>
        </div>

        <button
          onClick={handleBatchEnrich}
          disabled={isBatchEnriching}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/20"
        >
          <Sparkles className={`h-4 w-4 ${isBatchEnriching ? 'animate-spin' : ''}`} />
          <span>一键 AI 批量补全所有缺失信息</span>
        </button>
      </div>

      {/* Leads Contact List */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">客户联系人信息完整度表</h3>
          <span className="text-xs text-slate-400 font-mono">
            已补全高完整度客户: {leads.filter((l) => getCompletenessScore(l) >= 80).length} / {leads.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="px-6 py-3.5">企业名称 / 地区</th>
                <th className="px-6 py-3.5">信息完整度</th>
                <th className="px-6 py-3.5">关键决策人 / 职位</th>
                <th className="px-6 py-3.5">电子邮箱</th>
                <th className="px-6 py-3.5">电话 / WhatsApp</th>
                <th className="px-6 py-3.5">LinkedIn Profile</th>
                <th className="px-6 py-3.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leads.map((lead) => {
                const score = getCompletenessScore(lead);

                return (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{lead.companyName}</p>
                      <p className="text-[10px] text-slate-400">{lead.country} • {lead.city}</p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full ${
                              score >= 80 ? 'bg-emerald-400' : score >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-slate-300 font-bold">{score}%</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {lead.contactPerson ? (
                        <div>
                          <p className="font-semibold text-white">{lead.contactPerson}</p>
                          <p className="text-[10px] text-cyan-300">{lead.title}</p>
                        </div>
                      ) : (
                        <span className="text-rose-400 flex items-center space-x-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>缺失决策人</span>
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-mono">
                      {lead.email ? (
                        <span className="text-slate-200">{lead.email}</span>
                      ) : (
                        <span className="text-rose-400">待补全</span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-mono">
                      {lead.whatsappNumber || lead.phone ? (
                        <span className="text-emerald-400">{lead.whatsappNumber || lead.phone}</span>
                      ) : (
                        <span className="text-rose-400">待补全</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {lead.linkedinUrl ? (
                        <a
                          href={lead.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline inline-flex items-center space-x-1"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          <span>Profile</span>
                        </a>
                      ) : (
                        <span className="text-slate-500">未设置</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-medium transition-colors"
                      >
                        单条AI补齐
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdateLead={handleUpdateLead} />
    </div>
  );
}
