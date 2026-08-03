'use client';

import React, { useState, useEffect } from 'react';
import WorkflowStepper from '@/components/workflow-stepper';
import {
  Settings,
  Key,
  Globe,
  Mail,
  MessageSquare,
  Sparkles,
  Save,
  CheckCircle2,
  Cpu,
  Layers,
  Terminal,
  Sliders
} from 'lucide-react';

const SETTINGS_STORAGE_KEY = 'queeny_ai_settings_v1';

export default function SettingsPage() {
  const [model, setModel] = useState('custom-openai');
  const [apiKey, setApiKey] = useState('sk-proj-queeny-ai-mechanical-seals-xxxxxx');
  const [customModelName, setCustomModelName] = useState('gpt-4o-mini');
  const [customBaseUrl, setCustomBaseUrl] = useState('https://api.openai.com/v1');
  const [smtpServer, setSmtpServer] = useState('smtp.queeny-seals.com');
  const [smtpUser, setSmtpUser] = useState('export@queeny-seals.com');
  const [gmapkdevUrl, setGmapkdevUrl] = useState('http://localhost:3001/api/leads/search');
  const [customPrompt, setCustomPrompt] = useState(
    `角色：你是一名专精“机械密封件 (Mechanical Seals)”海外 B2B 市场营销的高级 AI 专家。\n使命：针对 Burgmann、John Crane、AESSEAL 等原厂品牌提供 1:1 无缝替代（ Drop-in Replacement），突出 40-50% 成本降低与 7-14 天快速交期痛点。`
  );
  const [saved, setSaved] = useState(false);

  // Load configuration from SQLite DB & localStorage on client mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.model) setModel(data.model);
          if (data.apiKey) setApiKey(data.apiKey);
          if (data.customModelName) setCustomModelName(data.customModelName);
          if (data.customBaseUrl) setCustomBaseUrl(data.customBaseUrl);
          if (data.gmapkdevUrl) setGmapkdevUrl(data.gmapkdevUrl);
          if (data.smtpServer) setSmtpServer(data.smtpServer);
          if (data.smtpUser) setSmtpUser(data.smtpUser);
          if (data.customPrompt) setCustomPrompt(data.customPrompt);
          return;
        }
      } catch (e) {
        console.warn('Fallback to localStorage if SQLite API unavailable');
      }

      try {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.model) setModel(parsed.model);
          if (parsed.apiKey) setApiKey(parsed.apiKey);
          if (parsed.customModelName) setCustomModelName(parsed.customModelName);
          if (parsed.customBaseUrl) setCustomBaseUrl(parsed.customBaseUrl);
          if (parsed.gmapkdevUrl) setGmapkdevUrl(parsed.gmapkdevUrl);
          if (parsed.smtpServer) setSmtpServer(parsed.smtpServer);
          if (parsed.smtpUser) setSmtpUser(parsed.smtpUser);
          if (parsed.customPrompt) setCustomPrompt(parsed.customPrompt);
        }
      } catch (e) {
        console.error('Failed to parse settings from localStorage', e);
      }
    }

    loadSettings();
  }, []);

  const handleSave = async () => {
    const configToSave = {
      model,
      apiKey,
      customModelName,
      customBaseUrl,
      gmapkdevUrl,
      smtpServer,
      smtpUser,
      customPrompt,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(configToSave));

    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configToSave),
      });
    } catch (e) {
      console.warn('Saved to localStorage, SQLite sync skipped');
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <WorkflowStepper />

      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-white">系统配置中心 (API Keys & Engine Settings)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            支持标准及自定义 OpenAI 兼容 API、自定义模型名称 (Model ID)、Base URL、多语言提示词及发送端参数。
          </p>
        </div>

        <button
          onClick={handleSave}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-lg ${
            saved
              ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
          }`}
        >
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{saved ? '配置已持久化保存！' : '保存系统设置'}</span>
        </button>
      </div>

      {/* Settings Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: AI Model & Custom OpenAI Settings */}
        <div className="md:col-span-2 rounded-2xl bg-slate-900/80 p-6 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>AI 大模型与自定义 OpenAI 协议接口配置</span>
            </h3>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
              OpenAI API Compatible
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">选择 AI 服务提供商 / 模式</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="custom-openai">⚙️ 自定义 OpenAI 兼容 API (Custom OpenAI Protocol)</option>
                <option value="gpt-4o">OpenAI GPT-4o (官方标准接口)</option>
                <option value="gpt-4o-mini">OpenAI GPT-4o Mini (高效极速模式)</option>
                <option value="deepseek-v3">DeepSeek-V3 (推荐 B2B 精准开发信)</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (长文案专业模式)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">OpenAI API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Custom OpenAI Parameters (Model Name & Base URL) */}
            {model === 'custom-openai' && (
              <>
                <div>
                  <label className="block text-cyan-400 font-semibold mb-1 flex items-center space-x-1">
                    <Sliders className="h-3.5 w-3.5" />
                    <span>自定义 OpenAI 模型名称 (Custom Model ID)</span>
                  </label>
                  <input
                    type="text"
                    value={customModelName}
                    onChange={(e) => setCustomModelName(e.target.value)}
                    placeholder="例: gpt-4o-mini, qwen-max, deepseek-chat, llama-3.3-70b"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">支持填入任何基于 OpenAI 协议的模型标识符</p>
                </div>

                <div>
                  <label className="block text-cyan-400 font-semibold mb-1 flex items-center space-x-1">
                    <Globe className="h-3.5 w-3.5" />
                    <span>自定义 API Base URL Endpoint</span>
                  </label>
                  <input
                    type="text"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    placeholder="例: https://api.openai.com/v1 或中继地址"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">兼容 OneAPI、NewAPI、转发中继站或私有化部署接口</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Card 2.5: gmapkdev Search Engine API Configuration */}
        <div className="md:col-span-2 rounded-2xl bg-slate-900/80 p-6 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>gmapkdev 谷歌地图与 AI 拓客 API 引擎配置</span>
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
              Live Scraper API Active
            </span>
          </div>

          <div className="text-xs space-y-2">
            <label className="block text-slate-300 font-semibold mb-1">gmapkdev API 服务 Endpoint 地址</label>
            <input
              type="text"
              value={gmapkdevUrl}
              onChange={(e) => setGmapkdevUrl(e.target.value)}
              placeholder="http://localhost:3001/api/leads/search"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
            />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              系统抓取模块 (<code className="text-cyan-300">/scraper</code>) 将通过此 HTTP REST API 网络接口（如 <code className="text-cyan-300">http://localhost:3001/api/leads/search</code> 或线上域名 <code className="text-cyan-300">https://your-domain.com/api/leads/search</code>）远程调用 Google Maps & Gemini AI 拓客引擎。
            </p>
          </div>
        </div>

        {/* Card 2: Mechanical Seals Customized System Prompt */}
        <div className="md:col-span-2 rounded-2xl bg-slate-900/80 p-6 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span>自定义外贸 AI System Prompt (机械密封件行业 System 提示词)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Bilingual RU/EN Prompt</span>
          </div>

          <textarea
            rows={4}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-500"
          />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            此 System Prompt 将在背景调查、分类评级、开发信撰写及 WhatsApp 破冰消息生成时自动应用，确保生成文本精准符合产品参数与行业规范。
          </p>
        </div>

        {/* Card 3: Email SMTP Configuration */}
        <div className="md:col-span-2 rounded-2xl bg-slate-900/80 p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Mail className="h-4 w-4 text-cyan-400" />
            <span>发件箱 SMTP 服务器配置</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">SMTP Host</label>
              <input
                type="text"
                value={smtpServer}
                onChange={(e) => setSmtpServer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">发件箱账号 (Sender Email)</label>
              <input
                type="text"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
