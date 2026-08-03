'use client';

import React, { useState, useEffect } from 'react';
import WorkflowStepper from '@/components/workflow-stepper';
import LeadModal from '@/components/lead-modal';
import { evaluateAndGradeLead } from '@/lib/ai-services';
import { fetchLeads, updateLead, seedLeads, LeadRecord } from '@/lib/api';
import { Lead, LeadGrade } from '@/types/workflow';
import {
  Filter,
  Trash2,
  RefreshCw,
  Sparkles,
  DatabaseZap,
  Inbox
} from 'lucide-react';

export default function CleaningPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedGradeTab, setSelectedGradeTab] = useState<LeadGrade | 'ALL'>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchLeads();
        if (mounted) setLeads(data as unknown as Lead[]);
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

  const filteredLeads = leads.filter((lead) => {
    if (selectedGradeTab === 'ALL') return true;
    return lead.grade === selectedGradeTab;
  });

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      const data = await seedLeads();
      if (data.leads && data.leads.length > 0) {
        setLeads(data.leads as unknown as Lead[]);
      }
    } catch (e) {
      console.warn('Seeding failed', e);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleRunAICleaning = () => {
    setIsProcessingAI(true);
    setTimeout(async () => {
      const updated = leads.map((lead) => {
        const result = evaluateAndGradeLead(lead);
        return {
          ...lead,
          grade: result.grade,
          matchScore: result.score,
          status: 'cleaned' as const,
        };
      });
      setLeads(updated);
      updated.forEach((l) =>
        updateLead(l.id, { grade: l.grade, matchScore: l.matchScore, status: l.status }).catch(
          () => {}
        )
      );
      setIsProcessingAI(false);
    }, 1200);
  };

  const handleDiscardLead = (id: string) => {
    const updated = leads.map((l) =>
      l.id === id ? { ...l, grade: 'D' as const, matchScore: 20, status: 'cleaned' as const } : l
    );
    setLeads(updated);
    updateLead(id, { grade: 'D', matchScore: 20, status: 'cleaned' }).catch(() => {});
  };

  const handleUpdateLead = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setSelectedLead(updated);
    updateLead(updated.id, updated as unknown as Partial<LeadRecord>).catch(() => {});
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'B':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'C':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'D':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <WorkflowStepper />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Filter className="h-6 w-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-white">模块二：数据清洗与 AI 客户分级 (Lead Grading)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            自动进行企业背景调查，评估机械密封需求匹配度，精准将客户归入 A, B, C, D 级客户池，不匹配者直接弃用。
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
              <span>{isSeeding ? '正在填充演示数据...' : '填充演示数据'}</span>
            </button>
          )}
          <button
            onClick={handleRunAICleaning}
            disabled={isProcessingAI || leads.length === 0}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 flex items-center space-x-2 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isProcessingAI ? 'animate-spin' : ''}`} />
            <span>重新执行 AI 背景调查与全量分级</span>
          </button>
        </div>
      </div>

      {/* Tier Grade Pool Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'ALL', label: '全部客户', count: leads.length },
          { id: 'A', label: 'A级池 (极高价值)', count: leads.filter((l) => l.grade === 'A').length, badge: 'A' },
          { id: 'B', label: 'B级池 (优质潜客)', count: leads.filter((l) => l.grade === 'B').length, badge: 'B' },
          { id: 'C', label: 'C级池 (中等潜在)', count: leads.filter((l) => l.grade === 'C').length, badge: 'C' },
          { id: 'D', label: 'D级池 (需求不匹配/弃用)', count: leads.filter((l) => l.grade === 'D').length, badge: 'D' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedGradeTab(tab.id as LeadGrade | 'ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shrink-0 border ${
              selectedGradeTab === tab.id
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-md'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-950 text-[10px] font-mono border border-slate-800">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {isLoading && (
        <div className="text-center text-xs text-slate-500 py-12">正在从数据库加载客户池...</div>
      )}

      {!isLoading && leads.length === 0 && (
        <div className="rounded-2xl bg-slate-900/80 border border-dashed border-slate-700 p-12 text-center space-y-3">
          <Inbox className="h-10 w-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">潜客池为空</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            请先前往「模块一：数据抓取」抓取采购商，或点击右上角「填充演示数据」快速载入一组机械密封件 B2B 示例客户进行体验。
          </p>
        </div>
      )}

      {/* Grade Cards List */}
      {!isLoading && filteredLeads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => {
            const evalResult = evaluateAndGradeLead(lead);

            return (
              <div
                key={lead.id}
                className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-1">{lead.companyName}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {lead.country} • {lead.city}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getGradeBadge(lead.grade)}`}>
                      {lead.grade}级 ({lead.matchScore}分)
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950">
                      <span className="text-slate-400">行业分类</span>
                      <span className="text-cyan-300 font-medium">{lead.industry}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950">
                      <span className="text-slate-400">原厂对标</span>
                      <span className="text-amber-400 font-mono">{lead.equivalentBrand || '通用替代'}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                    <p className="font-semibold text-slate-400 mb-1 flex items-center space-x-1">
                      <Sparkles className="h-3 w-3 text-cyan-400" />
                      <span>AI 背景评估要点</span>
                    </p>
                    {evalResult.reasoning}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  {lead.grade !== 'D' ? (
                    <button
                      onClick={() => handleDiscardLead(lead.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>需求不匹配，直接丢弃</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-rose-400 font-mono">已弃用客户</span>
                  )}

                  <button
                    onClick={() => setSelectedLead(lead)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-medium transition-colors"
                  >
                    查看详尽调查
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdateLead={handleUpdateLead} />
    </div>
  );
}
