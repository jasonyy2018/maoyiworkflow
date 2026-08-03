'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, ShieldCheck, Settings, Globe, Menu, X, LayoutDashboard, Search, Filter, UserCheck, Mail, MessageSquare, Share2 } from 'lucide-react';

const NAV_ITEMS = [
  { label: '工作流概览', href: '/', icon: LayoutDashboard },
  { label: 'P1. 智能数据抓取', href: '/scraper', icon: Search },
  { label: 'P2. 数据清洗分级', href: '/cleaning', icon: Filter },
  { label: 'P3. 补全信息', href: '/enrichment', icon: UserCheck },
  { label: 'P4. 发送开发信', href: '/email-marketing', icon: Mail },
  { label: 'P5. WhatsApp验证群发', href: '/whatsapp', icon: MessageSquare },
  { label: 'P6. 矩阵社媒营销', href: '/social-media', icon: Share2 },
  { label: '系统配置中心', href: '/settings', icon: Settings },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-cyan-400" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="h-full w-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Cpu className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  Queeny
                </span>
                <span className="rounded-full bg-cyan-500/10 px-1.5 py-0.5 text-[10px] sm:text-xs font-medium text-cyan-400 border border-cyan-500/20">
                  外贸 AI 工作流
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">机械密封件 (Mechanical Seals) B2B 智能化拓客系统</p>
            </div>
          </Link>
        </div>

        {/* Global Search & Target Industry Badge */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 rounded-lg bg-slate-900 px-3 py-1.5 border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>俄/英双语专区 (Burgmann / John Crane / Flowserve 对标库)</span>
          </div>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1.5 rounded-full bg-slate-900 border border-slate-800 px-2.5 py-1 text-[11px] sm:text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-slate-300 hidden sm:inline">AI 引擎: 在线</span>
            <span className="font-mono text-slate-300 sm:hidden">在线</span>
          </div>

          <Link
            href="/settings"
            className="flex items-center space-x-1 rounded-lg bg-slate-900 p-2 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800 transition-colors"
            title="API & 系统设置"
          >
            <Settings className="h-4 w-4" />
          </Link>

          <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>

          <div className="hidden xs:flex items-center space-x-1 text-xs text-slate-400">
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-medium">中/EN/RU</span>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-3 space-y-1 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <p className="px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            6大 AI 拓客营销模块导航
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950 to-blue-950 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
