'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  Filter,
  UserCheck,
  Mail,
  MessageSquare,
  Share2,
  Settings,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const NAV_ITEMS = [
  {
    label: '工作流概览',
    href: '/',
    icon: LayoutDashboard,
    badge: 'Hub'
  },
  {
    step: '1',
    label: '智能数据抓取',
    subLabel: '俄/英双语关键词拓客',
    href: '/scraper',
    icon: Search
  },
  {
    step: '2',
    label: '数据清洗与分级',
    subLabel: 'AI背景调查 & ABCD级池',
    href: '/cleaning',
    icon: Filter
  },
  {
    step: '3',
    label: '补全信息',
    subLabel: '决策人、邮箱、WA智能补齐',
    href: '/enrichment',
    icon: UserCheck
  },
  {
    step: '4',
    label: '发送开发信',
    subLabel: '1对1痛点匹配 AI 开发信',
    href: '/email-marketing',
    icon: Mail
  },
  {
    step: '5',
    label: 'WhatsApp 验证群发',
    subLabel: '号码校验 & 破冰营销',
    href: '/whatsapp',
    icon: MessageSquare
  },
  {
    step: '6',
    label: '矩阵社媒营销',
    subLabel: 'LinkedIn / FB / Ins / YT 排期',
    href: '/social-media',
    icon: Share2
  },
  {
    label: '系统配置',
    href: '/settings',
    icon: Settings
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 border-r border-slate-800 bg-slate-950/60 flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            6大 AI 营销工作流模块
          </p>
          <nav className="mt-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/40 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-950/50'
                      : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          : 'bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-1.5">
                        {item.step && (
                          <span className="text-[10px] font-mono font-bold text-cyan-500">
                            P{item.step}
                          </span>
                        )}
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.subLabel && (
                        <p className="text-[10px] text-slate-500 truncate">{item.subLabel}</p>
                      )}
                    </div>
                  </div>

                  {item.badge && (
                    <span className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-medium text-cyan-400 border border-cyan-500/20">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-4 w-4 text-cyan-400 shrink-0" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mechanical Seals Industry Special Info Box */}
        <div className="rounded-xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/30 p-3.5 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-300">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>机械密封件 B2B 智库</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            内置 Burgmann, John Crane, AESSEAL 替代型号对标逻辑，针对泵厂 OEM 与石化采购商精准拓客。
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
        <p>Queeny AI System v2.5</p>
        <p className="text-slate-600 mt-0.5">Ready for Docker Deployment</p>
      </div>
    </aside>
  );
}
