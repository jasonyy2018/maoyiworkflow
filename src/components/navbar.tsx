'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, ShieldCheck, Sparkles, Settings, Globe, Search, Bell } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="h-full w-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Cpu className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  Queeny
                </span>
                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-400 border border-cyan-500/20">
                  外贸 AI 工作流
                </span>
              </div>
              <p className="text-[11px] text-slate-400">机械密封件 (Mechanical Seals) B2B 智能化拓客系统</p>
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
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-slate-300">AI 引擎: 在线</span>
          </div>

          <Link
            href="/settings"
            className="flex items-center space-x-1 rounded-lg bg-slate-900 p-2 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800 transition-colors"
            title="API & 系统设置"
          >
            <Settings className="h-4 w-4" />
          </Link>

          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Globe className="h-4 w-4 text-cyan-400" />
            <span className="font-medium">中 / EN / RU</span>
          </div>
        </div>
      </div>
    </header>
  );
}
