'use client';

import React, { useState } from 'react';
import WorkflowStepper from '@/components/workflow-stepper';
import { INITIAL_SOCIAL_POSTS } from '@/lib/data';
import { generateAISocialPost } from '@/lib/ai-services';
import { SocialPost } from '@/types/workflow';
import {
  Share2,
  Globe,
  Video,
  MessageSquare,
  Camera,
  Sparkles,
  Calendar,
  Clock,
  Plus,
  Send,
  Download,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function SocialMediaPage() {
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [selectedPlatform, setSelectedPlatform] = useState<'LinkedIn' | 'YouTube' | 'Facebook' | 'Instagram'>('LinkedIn');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTopicInput, setNewTopicInput] = useState('');

  const handleGeneratePost = (engineSource: 'Coze Engine' | 'Feishu Plugin' | 'Auto Marketing Engine') => {
    setIsGenerating(true);
    setTimeout(() => {
      const topic = newTopicInput.trim() || 'Burgmann & John Crane 1:1 Replacement Cartridge Seals for Petrochemical Pumps';
      const newPost = generateAISocialPost(selectedPlatform, topic);
      newPost.aiSource = engineSource;
      setPosts([newPost, ...posts]);
      setIsGenerating(false);
      setNewTopicInput('');
    }, 1200);
  };

  const handleExportSchedule = () => {
    const jsonStr = JSON.stringify(posts, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `queeny-social-schedule-buffer-hootsuite.json`;
    a.click();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'LinkedIn':
        return <Globe className="h-5 w-5 text-blue-400" />;
      case 'YouTube':
        return <Video className="h-5 w-5 text-rose-500" />;
      case 'Facebook':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'Instagram':
        return <Camera className="h-5 w-5 text-pink-400" />;
      default:
        return <Share2 className="h-5 w-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <WorkflowStepper />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Share2 className="h-6 w-6 text-purple-400" />
            <h1 className="text-xl font-extrabold text-white">模块六：矩阵社媒自动营销 (Social Media Automation)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            支持 LinkedIn, YouTube, Facebook, Instagram 自动营销计划生成。对接 Coze / 飞书文案插件，导出 Buffer / Later / Hootsuite 格式排期。
          </p>
        </div>

        <button
          onClick={handleExportSchedule}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-2 transition-colors shadow-lg shadow-purple-900/30"
        >
          <Download className="h-4 w-4" />
          <span>导出 Buffer / Hootsuite 自动化排期包</span>
        </button>
      </div>

      {/* AI Content Generator Panel */}
      <div className="rounded-2xl bg-slate-900/80 p-6 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>AI 文案与营销计划生成器 (Coze / 飞书插件模式)</span>
          </h3>

          {/* Platform Selector */}
          <div className="flex items-center space-x-2">
            {(['LinkedIn', 'YouTube', 'Facebook', 'Instagram'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
                  selectedPlatform === p
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {getPlatformIcon(p)}
                <span>{p}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newTopicInput}
            onChange={(e) => setNewTopicInput(e.target.value)}
            placeholder="输入营销主题，如: 针对泵厂 OEM 替换 Burgmann H7N 密封件降本45%..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />

          <button
            onClick={() => handleGeneratePost('Coze Engine')}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>Coze AI 生成</span>
          </button>

          <button
            onClick={() => handleGeneratePost('Feishu Plugin')}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>飞书插件生成</span>
          </button>
        </div>
      </div>

      {/* Editorial Calendar Posts Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(post.platform)}
                  <span className="font-bold text-white text-xs">{post.platform}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {post.aiSource}
                </span>
              </div>

              <h4 className="font-bold text-sm text-cyan-300 line-clamp-2">{post.title}</h4>

              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-sans text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-6">
                {post.content}
              </pre>

              <div className="flex flex-wrap gap-1">
                {post.hashtags.map((tag) => (
                  <span key={tag} className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                <span className="font-mono text-[10px]">
                  排期: {new Date(post.scheduledTime).toLocaleDateString()}
                </span>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Ready for Buffer / Hootsuite
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
