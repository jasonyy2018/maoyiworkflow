'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Filter, UserCheck, Mail, MessageSquare, Share2, ArrowRight, CheckCircle2 } from 'lucide-react';

const STAGES = [
  { id: 1, name: '数据抓取', path: '/scraper', icon: Search, desc: '俄/英关键词' },
  { id: 2, name: '数据清洗分级', path: '/cleaning', icon: Filter, desc: 'A/B/C/D级池' },
  { id: 3, name: '补全信息', path: '/enrichment', icon: UserCheck, desc: '补齐决策人/WA' },
  { id: 4, name: '发送开发信', path: '/email-marketing', icon: Mail, desc: '1对1痛点邮件' },
  { id: 5, name: 'WhatsApp验证群发', path: '/whatsapp', icon: MessageSquare, desc: '号码校验破冰' },
  { id: 6, name: '社媒营销', path: '/social-media', icon: Share2, desc: 'LinkedIn/FB/Ins' }
];

export default function WorkflowStepper() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 sm:p-4 mb-6 shadow-lg shadow-black/20 backdrop-blur-sm">
      <div className="flex items-center justify-between overflow-x-auto gap-2 pb-1 scrollbar-none">
        {STAGES.map((stage, index) => {
          const isActive = pathname === stage.path;
          const isCompleted = STAGES.findIndex((s) => s.path === pathname) > index;
          const Icon = stage.icon;

          return (
            <React.Fragment key={stage.id}>
              <Link
                href={stage.path}
                className={`flex items-center space-x-2.5 rounded-xl px-3 py-2 text-xs transition-all shrink-0 border ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950 to-blue-950 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-950/60'
                    : isCompleted
                    ? 'bg-slate-950/80 text-emerald-400 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 text-slate-400 border-slate-900 hover:bg-slate-900 hover:text-slate-300'
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                </div>

                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-mono text-[10px] opacity-70">P{stage.id}.</span>
                    <span className="font-semibold">{stage.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 hidden md:block">{stage.desc}</p>
                </div>
              </Link>

              {index < STAGES.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-slate-700 shrink-0 hidden lg:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
