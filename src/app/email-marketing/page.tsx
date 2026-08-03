'use client';

import React, { useState, useEffect } from 'react';
import WorkflowStepper from '@/components/workflow-stepper';
import LeadModal from '@/components/lead-modal';
import { generateColdEmailText } from '@/lib/ai-services';
import { fetchLeads, updateLead, seedLeads, LeadRecord } from '@/lib/api';
import { Lead } from '@/types/workflow';
import {
  Mail,
  Send,
  Sparkles,
  CheckCircle2,
  DatabaseZap,
  Inbox
} from 'lucide-react';

export default function EmailMarketingPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [emailLanguage, setEmailLanguage] = useState<'en' | 'ru'>('ru');
  const [sendingBatch, setSendingBatch] = useState(false);
  const [sentLeads, setSentLeads] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchLeads();
        if (mounted) {
          setLeads(data as unknown as Lead[]);
          if (data.length > 0) setSelectedLead(data[0] as unknown as Lead);
        }
      } catch (e) {
        console.warn('Could not load leads from DB', e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      const data = await seedLeads();
      if (data.leads && data.leads.length > 0) {
        setLeads(data.leads as unknown as Lead[]);
        setSelectedLead(data.leads[0] as unknown as Lead);
      }
    } catch (e) {
      console.warn('Seeding failed', e);
    } finally {
      setIsSeeding(false);
    }
  };

  const emailContent = selectedLead
    ? generateColdEmailText(selectedLead, emailLanguage)
    : {
        subject: '暂无活动开发信 (请先在抓取模块新增潜客)',
        body: '目前潜客池为空。请前往“模块一：数据抓取”添加潜客后即可在此处生成 1对1 精准开发信。'
      };

  const markEmailed = (lead: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: 'emailed' as const } : l)));
    updateLead(lead.id, { status: 'emailed' }).catch(() => {});
  };

  const handleSendSingleEmail = (id: string) => {
    if (!sentLeads.includes(id)) {
      setSentLeads((prev) => [...prev, id]);
      const target = leads.find((l) => l.id === id);
      if (target) markEmailed(target);
    }
  };

  const handleBatchSendEmails = () => {
    setSendingBatch(true);
    setTimeout(() => {
      const targets = leads.filter((l) => l.grade === 'A' || l.grade === 'B');
      const allIds = targets.map((l) => l.id);
      setSentLeads((prev) => Array.from(new Set([...prev, ...allIds])));
      targets.forEach((l) => markEmailed(l));
      setSendingBatch(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <WorkflowStepper />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Mail className="h-6 w-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-white">模块四：AI 1对1精准开发信营销 (Cold Email Outreach)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            深入剖析客户背景与机械密封采购痛点（降本40%、7天快速交期、替代Burgmann/John Crane），一对一自动生成俄/英双语开发信。
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {leads.length === 0 && !isLoading && (
            <button
              onClick={handleSeedDemo}
              disabled={isSeeding}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 flex items-center space-x-2 transition-colors"
            >
              <DatabaseZap className={`h-4 w-4 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? '填充演示数据...' : '填充演示数据'}</span>
            </button>
          )}
          <button
            onClick={handleBatchSendEmails}
            disabled={sendingBatch || leads.length === 0}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <Send className={`h-4 w-4 ${sendingBatch ? 'animate-bounce' : ''}`} />
            <span>批量一键发送所有 A/B 级 AI 开发信</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Target Leads Selector, Right Email Previewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target Leads List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">选择营销目标客户</h3>
            <span className="text-[10px] text-slate-400">已发送: {sentLeads.length} / {leads.length}</span>
          </div>

          {isLoading ? (
            <div className="text-center text-xs text-slate-500 py-8">加载潜客列表...</div>
          ) : leads.length === 0 ? (
            <div className="rounded-2xl bg-slate-900/80 border border-dashed border-slate-700 p-8 text-center space-y-2">
              <Inbox className="h-7 w-7 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500">暂无潜客。请先抓取或填充演示数据。</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
              {leads.map((lead) => {
                const isSelected = selectedLead?.id === lead.id;
                const isSent = sentLeads.includes(lead.id) || lead.status === 'emailed';

                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/50 border-cyan-500/50 shadow-lg shadow-cyan-950/40'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-xs">{lead.companyName}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{lead.country} • {lead.industry}</p>
                      </div>
                      {isSent ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono">
                          已发送
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono">
                          待发
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-mono">
                        {lead.equivalentBrand || 'Standard Replacement'}
                      </span>
                      <span className="text-slate-400 font-mono">{lead.email || '邮箱待补全'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: AI Mail Writer & Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls Bar */}
          <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-semibold text-white">AI 开发信生成引擎</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEmailLanguage('ru')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  emailLanguage === 'ru'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                俄语 (RU)
              </button>
              <button
                onClick={() => setEmailLanguage('en')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  emailLanguage === 'en'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                英语 (EN)
              </button>
            </div>
          </div>

          {/* Email Preview Card */}
          <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800 space-y-4 shadow-2xl">
            <div className="space-y-2 pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">收件人 (To):</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {selectedLead?.contactPerson || 'Procurement Lead'} &lt;{selectedLead?.email || '未接入主邮箱'}&gt;
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">邮件主题 (Subject):</span>
                <span className="font-semibold text-white">{emailContent.subject}</span>
              </div>
            </div>

            {/* Mail Body */}
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                1对1 AI 痛点分析与定制正文
              </p>
              <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-sans text-slate-200 leading-relaxed whitespace-pre-wrap">
                {emailContent.body}
              </pre>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>包含机械密封 40% 替代降本 & 7天快速交期痛点</span>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => selectedLead && handleSendSingleEmail(selectedLead.id)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 flex items-center space-x-1.5 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span>{selectedLead && (sentLeads.includes(selectedLead.id) || selectedLead.status === 'emailed') ? '已发送 (重新发送)' : '单封立即发送'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
