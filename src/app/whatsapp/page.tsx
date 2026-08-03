'use client';

import React, { useState } from 'react';
import WorkflowStepper from '@/components/workflow-stepper';
import LeadModal from '@/components/lead-modal';
import { INITIAL_LEADS } from '@/lib/data';
import { validateWhatsAppNumber, generateWhatsAppMessage } from '@/lib/ai-services';
import { Lead } from '@/types/workflow';
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  Send,
  Sparkles,
  Phone,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function WhatsAppPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead>(INITIAL_LEADS[0]);
  const [sentWaIds, setSentWaIds] = useState<string[]>(['lead-101']);

  const handleValidateAllNumbers = () => {
    setIsValidating(true);
    setTimeout(() => {
      const updated = leads.map((lead) => {
        const phoneToTest = lead.whatsappNumber || lead.phone || '+79122458890';
        const result = validateWhatsAppNumber(phoneToTest);
        return {
          ...lead,
          whatsappNumber: result.formattedNumber,
          whatsappStatus: result.status,
          status: 'wa_verified' as const
        };
      });
      setLeads(updated);
      setIsValidating(false);
    }, 1200);
  };

  const handleSendSingleWA = (id: string) => {
    if (!sentWaIds.includes(id)) {
      setSentWaIds((prev) => [...prev, id]);
    }
  };

  const waScript = generateWhatsAppMessage(selectedLead);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <WorkflowStepper />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">模块五：WhatsApp 号码批量验证与群发 (WA Manager)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            对抓取客户电话规范化为国际标准格式（如俄罗斯 `+7...`，中东 `+971...`），批量检测 WhatsApp 注册状态并一键发送破冰消息。
          </p>
        </div>

        <button
          onClick={handleValidateAllNumbers}
          disabled={isValidating}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-500 flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Sparkles className={`h-4 w-4 ${isValidating ? 'animate-spin' : ''}`} />
          <span>一键批量验证所有 WhatsApp 注册状态</span>
        </button>
      </div>

      {/* Grid: Left WA Verification Table, Right 1-on-1 WA Script Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: WA Numbers Status Table (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">客户 WhatsApp 验证状态表</h3>
            <span className="text-xs text-emerald-400 font-mono">
              已注册 WA: {leads.filter((l) => l.whatsappStatus === 'verified').length} / {leads.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="px-4 py-3">企业名称</th>
                  <th className="px-4 py-3">规范化国际号码</th>
                  <th className="px-4 py-3">WA 注册状态</th>
                  <th className="px-4 py-3 text-right">互动</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {leads.map((lead) => {
                  const isSelected = selectedLead.id === lead.id;
                  const isSent = sentWaIds.includes(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-950/40 text-emerald-300' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-white truncate max-w-[180px]">
                        {lead.companyName}
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-200">
                        {lead.whatsappNumber || lead.phone || '+79122458890'}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            lead.whatsappStatus === 'verified'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {lead.whatsappStatus === 'verified' ? '已注册 (+WA)' : '待校验'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        {isSent ? (
                          <span className="text-[10px] text-emerald-400 font-mono">已发送营销</span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendSingleWA(lead.id);
                            }}
                            className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[10px] hover:bg-emerald-400"
                          >
                            发送WA破冰
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Interactive WA Message Writer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">1对1 俄/英 WhatsApp 破冰文案</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedLead.companyName}</p>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                {selectedLead.whatsappNumber || '+79122458890'}
              </span>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-sans text-slate-200 leading-relaxed whitespace-pre-wrap">
              {waScript}
            </pre>

            <div className="space-y-2 pt-2">
              <a
                href={`https://wa.me/${(selectedLead.whatsappNumber || selectedLead.phone || '79122458890').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waScript)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <ExternalLink className="h-4 w-4" />
                <span>跳转 WhatsApp Web 网页版一键触达</span>
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(waScript);
                  alert('WhatsApp 破冰话术已成功复制到剪贴板！');
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-medium text-xs hover:bg-slate-700 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>复制消息全文</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
