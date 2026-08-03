import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'Queeny 外贸 AI 工作流 | 机械密封件 B2B 智能化拓客系统',
  description: '专为机械密封件 (Mechanical Seals) 行业定制的海外拓客、数据清洗分级、补全信息、AI开发信、WhatsApp验证群发与社媒自动化系统。'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-slate-950"
        suppressHydrationWarning
      >
        <Navbar />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
