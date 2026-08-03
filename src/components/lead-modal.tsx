'use client';

import React, { useState } from 'react';
import { Lead } from '@/types/workflow';
import { generateColdEmailText, generateWhatsAppMessage, enrichLeadInfo } from '@/lib/ai-services';
import {
  X,
  Building2,
  Globe,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  FileText,
  Copy,
  Check
} from 'lucide-react';

interface LeadModalProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateLead: (updatedLead: Lead) => void;
}

export default function LeadModal({ lead, onClose, onUpdateLead }: LeadModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'email' | 'whatsapp'>('info');
  const [emailLang, setEmailLang] = useState<'en' | 'ru'>('ru');
  const [copied, setCopied] = useState(false);

  if (!lead) return null;

  const emailData = generateColdEmailText(lead, emailLang);
  const waMessage = generateWhatsAppMessage(lead);

  const handleEnrich = () => {
    const enriched = enrichLeadInfo(lead);
    onUpdateLead(enriched);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">{lead.companyName}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getGradeBadge(lead.grade)}`}>
                  {lead.grade}级客户 ({lead.matchScore}分)
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                <span>{lead.country} • {lead.city}</span>
                <span>|</span>
                <span className="text-cyan-400">{lead.industry}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 px-6 pt-3 border-b border-slate-800/80 bg-slate-950/30">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'info'
                ? 'border-cyan-400 text-cyan-400 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            背景调查 & 机械密封对标
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-colors border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'email'
                ? 'border-cyan-400 text-cyan-400 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>AI 1对1精准开发信</span>
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-colors border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'whatsapp'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>WhatsApp 营销破冰</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Company Background & Seals Analysis */}
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800/80 space-y-3">
                  <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>企业背景调查与需求定位</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{lead.backgroundInfo}</p>
                </div>

                {/* Replacement Brand Model Matrix */}
                <div className="rounded-xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 p-4 border border-cyan-500/20 space-y-2">
                  <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider">
                    机械密封对标型号 (Direct Replacement)
                  </span>
                  <div className="flex items-center justify-between rounded-lg bg-slate-950 p-3 border border-slate-800">
                    <div>
                      <p className="text-[10px] text-slate-400">原厂标配品牌/型号</p>
                      <p className="text-sm font-bold text-amber-400">{lead.equivalentBrand || 'Burgmann / John Crane 58B'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">Queeny 1:1 替代型号</p>
                      <p className="text-sm font-bold text-cyan-400">Queeny Q-Series Drop-in</p>
                    </div>
                  </div>
                </div>

                {/* Pain Points */}
                <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    <span>客户核心痛点 (Pain Points)</span>
                  </h4>
                  <ul className="space-y-2">
                    {lead.painPoints.map((pain, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>{pain}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Contact Info & Enrichment */}
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                      深度联系人信息 (Enriched Contacts)
                    </h4>
                    {lead.missingFields.length > 0 && (
                      <button
                        onClick={handleEnrich}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] hover:bg-cyan-500/30 flex items-center space-x-1 transition-colors"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>AI 补全缺失项</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80">
                      <span className="text-slate-400">决策人姓名</span>
                      <span className="font-semibold text-white">{lead.contactPerson || '未补全'}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80">
                      <span className="text-slate-400">职位</span>
                      <span className="text-cyan-300">{lead.title || '采购经理/总工'}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80">
                      <span className="text-slate-400">电子邮箱</span>
                      <span className="font-mono text-slate-200">{lead.email || '未补全'}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80">
                      <span className="text-slate-400">电话/手机</span>
                      <span className="font-mono text-slate-200">{lead.phone || '未补全'}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80">
                      <span className="text-slate-400">WhatsApp 验证状态</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          lead.whatsappStatus === 'verified'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {lead.whatsappStatus === 'verified' ? '已验证注册 (+WA)' : '待校验/未注册'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80">
                      <span className="text-slate-400">LinkedIn 主页</span>
                      {lead.linkedinUrl ? (
                        <a
                          href={lead.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline flex items-center space-x-1"
                        >
                          <Globe className="h-3 w-3" />
                          <span>查看 Profile</span>
                        </a>
                      ) : (
                        <span className="text-slate-500">未设置</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Cold Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-300">开发信语言切换</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEmailLang('ru')}
                    className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                      emailLang === 'ru'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    俄语 (Russian)
                  </button>
                  <button
                    onClick={() => setEmailLang('en')}
                    className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                      emailLang === 'en'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    英语 (English)
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">邮件主题 (Subject)</p>
                  <p className="text-sm font-semibold text-cyan-300 mt-1">{emailData.subject}</p>
                </div>
                <div className="h-px bg-slate-800" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">邮件正文 (Personalized Cold Email Body)</p>
                  <pre className="mt-2 text-xs font-sans text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-900 p-4 rounded-lg border border-slate-800/80">
                    {emailData.body}
                  </pre>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => handleCopy(`${emailData.subject}\n\n${emailData.body}`)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 flex items-center space-x-1.5 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? '已复制邮件全文' : '复制开发信'}</span>
                </button>
                <button
                  onClick={() => {
                    alert(`已为您触发发送至 ${lead.email || 'a.volkov@ural-hydropump.ru'}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 flex items-center space-x-1.5 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span>立即测试发送开发信</span>
                </button>
              </div>
            </div>
          )}

          {/* WhatsApp Tab */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
                    <MessageSquare className="h-4 w-4" />
                    <span>WhatsApp 1对1 破冰营销话术</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    目标号码: {lead.whatsappNumber || lead.phone || '+79122458890'}
                  </span>
                </div>
                <pre className="text-xs font-sans text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-900 p-4 rounded-lg border border-slate-800">
                  {waMessage}
                </pre>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => handleCopy(waMessage)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 flex items-center space-x-1.5 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span>复制 WA 话术</span>
                </button>
                <a
                  href={`https://wa.me/${(lead.whatsappNumber || lead.phone || '79122458890').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 flex items-center space-x-1.5 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span>打开 WhatsApp Web 发送</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
