'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import WorkflowStepper from '@/components/workflow-stepper';
import LeadModal from '@/components/lead-modal';
import { INITIAL_LEADS, INITIAL_SYSTEM_STATS } from '@/lib/data';
import { Lead } from '@/types/workflow';
import {
  Search,
  Filter,
  UserCheck,
  Mail,
  MessageSquare,
  Share2,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Building2,
  ArrowUpRight,
  Globe,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const stats = INITIAL_SYSTEM_STATS;

  const handleUpdateLead = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setSelectedLead(updated);
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
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Queeny 外贸 AI 工作流 • 机械密封件专版</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            全球机械密封件 (Mechanical Seals) B2B 智能化拓客中心
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            结合中/英/俄三语网络搜索抓取、AI背景调查分级（A/B/C/D池）、缺失联系人补全、1对1痛点开发信、WhatsApp号码批量验证及4大社媒矩阵定时营销。
          </p>
        </div>
      </div>

      {/* Visual Workflow Stepper Header */}
      <WorkflowStepper />

      {/* 6 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 hover:border-cyan-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">1. 数据抓取</span>
            <Search className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mt-2 font-mono">{stats.totalScraped}</p>
          <p className="text-[10px] text-slate-500 mt-1">已抓取潜在客户</p>
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 hover:border-emerald-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">2. A/B级高意向</span>
            <Filter className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-2 font-mono">
            {stats.gradeA + stats.gradeB}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">A级 {stats.gradeA} | B级 {stats.gradeB}</p>
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 hover:border-blue-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">3. 已补全信息</span>
            <UserCheck className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-400 mt-2 font-mono">{stats.enrichedCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">含决策人/邮箱/WA</p>
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 hover:border-indigo-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">4. 开发信发送</span>
            <Mail className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-indigo-400 mt-2 font-mono">{stats.emailsSent}</p>
          <p className="text-[10px] text-slate-500 mt-1">1对1 俄/英精准邮件</p>
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 hover:border-emerald-400/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">5. WA 已验证</span>
            <MessageSquare className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-2 font-mono">{stats.waVerifiedCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">包含破冰短消息</p>
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 hover:border-purple-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">6. 社媒排期帖</span>
            <Share2 className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-purple-400 mt-2 font-mono">{stats.socialPostsScheduled}</p>
          <p className="text-[10px] text-slate-500 mt-1">LinkedIn/FB/Ins/YT</p>
        </div>
      </div>

      {/* Mechanical Seals Industry Special Features Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Replacement Brand Matrix */}
        <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>原厂品牌替代库 (Cross Ref)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">1:1 Drop-in</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-amber-400 font-medium">Burgmann H7N / MG1</span>
              <span className="text-slate-400 font-mono">→ Queeny Q-H7N</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-amber-400 font-medium">John Crane 58B / 2100</span>
              <span className="text-slate-400 font-mono">→ Queeny Q-58B</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-amber-400 font-medium">Flowserve QB / Cartex</span>
              <span className="text-slate-400 font-mono">→ Queeny Q-Cartex</span>
            </div>
          </div>
        </div>

        {/* Card 2: Russian & CIS Bilingual Intelligence */}
        <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>俄语/独联体市场拓客词</span>
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono">RU/EN Active</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono text-slate-300">
            <p className="p-1.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
              • торцевое уплотнение закупка
            </p>
            <p className="p-1.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
              • аналоги Burgmann MG1 Россия
            </p>
            <p className="p-1.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
              • насосы уплотнения поставщик
            </p>
          </div>
        </div>

        {/* Card 3: Quick Action Buttons */}
        <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>快捷启动营销工作流</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">一键从搜索抓取到生成开发信全流程自动化</p>
          </div>

          <div className="space-y-2">
            <Link
              href="/scraper"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
            >
              <span>立即抓取海外新潜在客户</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/cleaning"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 font-medium text-xs hover:bg-slate-700 transition-colors"
            >
              <span>查看 A/B/C/D 客户分级池</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Leads Management Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">机械密封件海外潜在客户数据库 (Recent Leads)</h3>
            <p className="text-xs text-slate-400">点击客户姓名可打开 AI 背景调查、对标分析及开发信生成</p>
          </div>
          <Link href="/scraper" className="text-xs text-cyan-400 hover:underline flex items-center space-x-1">
            <span>前往数据抓取模块</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="px-6 py-3.5">企业名称 / 地区</th>
                <th className="px-6 py-3.5">目标行业 & 需求</th>
                <th className="px-6 py-3.5">对标型号</th>
                <th className="px-6 py-3.5">AI 分级 & 匹配度</th>
                <th className="px-6 py-3.5">决策人 / 联系方式</th>
                <th className="px-6 py-3.5">WhatsApp</th>
                <th className="px-6 py-3.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="font-bold text-white hover:text-cyan-400 text-left block max-w-xs truncate"
                    >
                      {lead.companyName}
                    </button>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {lead.country} • {lead.city}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-medium">
                      {lead.industry}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">{lead.demandType}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-mono text-amber-400">{lead.equivalentBrand || '通用型号'}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold border ${getGradeBadge(lead.grade)}`}>
                      {lead.grade}级 ({lead.matchScore}分)
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-200">{lead.contactPerson || '待补全'}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{lead.email || '无邮箱'}</p>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        lead.whatsappStatus === 'verified'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {lead.whatsappStatus === 'verified' ? '已验证 WA' : '待验证'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-cyan-500 hover:text-slate-950 font-medium transition-colors"
                    >
                      查看与营销
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Modal Drawer */}
      <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdateLead={handleUpdateLead} />
    </div>
  );
}
