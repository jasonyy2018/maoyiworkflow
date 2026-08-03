'use client';

import React, { useState } from 'react';
import WorkflowStepper from '@/components/workflow-stepper';
import { BILINGUAL_KEYWORDS_PRESETS, INITIAL_LEADS } from '@/lib/data';
import { simulateDataScrape } from '@/lib/ai-services';
import { Lead } from '@/types/workflow';
import {
  Search,
  Globe,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function ScraperPage() {
  const [selectedPreset, setSelectedPreset] = useState<string>('Russian Market (俄语专区)');
  const [customKeywords, setCustomKeywords] = useState<string[]>(
    BILINGUAL_KEYWORDS_PRESETS[0].keywords
  );
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['Russia', 'CIS (Kazakhstan, Azerbaijan)', 'Middle East']);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(['Pump OEM', 'Oil & Gas Refinery', 'Chemical Plant', 'Seals Distributor']);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedResults, setScrapedResults] = useState<Lead[]>(INITIAL_LEADS);
  const [logs, setLogs] = useState<string[]>([
    '[System Ready] B2B Mechanical Seals Lead Scraper initialized with Yandex & Google search APIs.'
  ]);

  const handleAddKeyword = () => {
    if (newKeywordInput.trim() && !customKeywords.includes(newKeywordInput.trim())) {
      setCustomKeywords([...customKeywords, newKeywordInput.trim()]);
      setNewKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setCustomKeywords(customKeywords.filter((k) => k !== kw));
  };

  const handleSelectPreset = (category: string) => {
    setSelectedPreset(category);
    const preset = BILINGUAL_KEYWORDS_PRESETS.find((p) => p.category === category);
    if (preset) {
      setCustomKeywords(preset.keywords);
    }
  };

  const handleRunScraper = async () => {
    setIsScraping(true);
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] 启动机械密封件全球抓取任务...`,
      `[Language Filter] 俄语/英语双语搜索模式生效: ${customKeywords.length} 个关键词`,
      `[Target Region] 目标区域: ${selectedRegions.join(', ')}`
    ]);

    try {
      const newLeads = await simulateDataScrape({
        keywords: customKeywords,
        languages: ['ru', 'en'],
        regions: selectedRegions,
        industryFilter: selectedIndustries,
        limit: 10
      });

      setScrapedResults((prev) => [...newLeads, ...prev]);
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 抓取完成！成功挖掘 ${newLeads.length} 条全新海外潜客。已自动送往“数据清洗与分级”池。`
      ]);
    } catch (e) {
      setLogs((prev) => [...prev, `[Error] 抓取模拟过程遇到异常`]);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <WorkflowStepper />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Search className="h-6 w-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-white">模块一：俄/英双语智能数据抓取 (Lead Mining)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            输入俄语（如 `торцевое уплотнение закупка`）或英文关键词，面向全球搜索泵厂 OEM、化工厂与密封件分销商。
          </p>
        </div>

        <button
          onClick={handleRunScraper}
          disabled={isScraping}
          className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-lg transition-all ${
            isScraping
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20'
          }`}
        >
          {isScraping ? (
            <>
              <Clock className="h-5 w-5 animate-spin" />
              <span>AI 引擎正在抓取中...</span>
            </>
          ) : (
            <>
              <Play className="h-5 w-5 fill-current" />
              <span>启动双语全网抓取任务</span>
            </>
          )}
        </button>
      </div>

      {/* Scraper Configurations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Preset & Keyword Generator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preset Selectors */}
          <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>1. 选择目标词库预设 (Keyword Presets)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BILINGUAL_KEYWORDS_PRESETS.map((preset) => (
                <button
                  key={preset.category}
                  onClick={() => handleSelectPreset(preset.category)}
                  className={`p-3 rounded-xl text-left text-xs font-semibold transition-all border ${
                    selectedPreset === preset.category
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-md shadow-cyan-950/50'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <p className="font-bold">{preset.category}</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    {preset.keywords.length} 个深度专业词
                  </p>
                </button>
              ))}
            </div>

            {/* Keyword Chips */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">当前活动的搜索关键词组</label>
              <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 min-h-[100px]">
                {customKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 text-cyan-300 border border-slate-800 text-xs font-mono"
                  >
                    <span>{kw}</span>
                    <button
                      onClick={() => handleRemoveKeyword(kw)}
                      className="text-slate-500 hover:text-rose-400 ml-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Keyword Input */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  placeholder="添加俄语或英语关键词，例: дистрибьютор уплотнений..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleAddKeyword}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>添加</span>
                </button>
              </div>
            </div>
          </div>

          {/* Region & Persona Filtering */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white">2. 目标抓取地区 (Regions)</label>
              <div className="space-y-2 text-xs text-slate-300">
                {['Russia', 'CIS (Kazakhstan, Azerbaijan)', 'Middle East', 'Europe', 'SE Asia'].map((region) => (
                  <label key={region} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRegions.includes(region)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedRegions([...selectedRegions, region]);
                        else setSelectedRegions(selectedRegions.filter((r) => r !== region));
                      }}
                      className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                    />
                    <span>{region}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white">3. 目标企业画像 (Buyer Persona)</label>
              <div className="space-y-2 text-xs text-slate-300">
                {['Pump OEM', 'Oil & Gas Refinery', 'Chemical Plant', 'Seals Distributor', 'Repair Workshop'].map((persona) => (
                  <label key={persona} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedIndustries.includes(persona)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIndustries([...selectedIndustries, persona]);
                        else setSelectedIndustries(selectedIndustries.filter((i) => i !== persona));
                      }}
                      className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                    />
                    <span>{persona}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Log Console */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col h-full font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-cyan-400 font-bold flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4" />
              <span>抓取任务日志控制台</span>
            </span>
            <span className="text-[10px] text-slate-500">Live Status</span>
          </div>

          <div className="flex-1 overflow-y-auto mt-3 space-y-2 text-slate-400 text-[11px] leading-relaxed max-h-[360px] scrollbar-thin">
            {logs.map((log, idx) => (
              <p key={idx} className={log.includes('完成') ? 'text-emerald-400 font-bold' : ''}>
                {log}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Scraped Results Feed Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">已抓取的潜在客户列表 ({scrapedResults.length} 家)</h3>
            <p className="text-xs text-slate-400">所有数据抓取后可一键进入“数据清洗与客户分级”池</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="px-6 py-3.5">企业名称 / 网站</th>
                <th className="px-6 py-3.5">国家/城市</th>
                <th className="px-6 py-3.5">目标行业</th>
                <th className="px-6 py-3.5">抓取语言与词</th>
                <th className="px-6 py-3.5">抓取来源</th>
                <th className="px-6 py-3.5 text-right">下一步</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {scrapedResults.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{lead.companyName}</p>
                    <p className="text-[10px] text-cyan-400 font-mono mt-0.5">{lead.website}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span>{lead.country} • {lead.city}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-medium">
                      {lead.industry}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-slate-300">
                      [{lead.searchLanguage.toUpperCase()}] 双语逻辑
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{lead.source}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-emerald-400 font-medium inline-flex items-center space-x-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>已就绪，可分级</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
