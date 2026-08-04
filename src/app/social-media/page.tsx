'use client';

import React, { useState, useEffect } from 'react';
import WorkflowStepper from '@/components/workflow-stepper';
import { generateAISocialPost } from '@/lib/ai-services';
import { fetchSocialPosts, createSocialPost, deleteSocialPost, updateSocialPost, aiRun, SocialPostRecord } from '@/lib/api';
import {
  Share2,
  Globe,
  Video,
  MessageSquare,
  Camera,
  Sparkles,
  Clock,
  Download,
  FileText,
  Trash2,
  Inbox
} from 'lucide-react';

export default function SocialMediaPage() {
  const [posts, setPosts] = useState<SocialPostRecord[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<'LinkedIn' | 'YouTube' | 'Facebook' | 'Instagram'>('LinkedIn');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTopicInput, setNewTopicInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchSocialPosts();
        if (mounted) setPosts(data);
      } catch (e) {
        console.warn('Could not load social posts from DB', e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleGeneratePost = async (engineSource: 'Coze Engine' | 'Feishu Plugin' | 'Auto Marketing Engine') => {
    setIsGenerating(true);
    const topic = newTopicInput.trim() || 'Burgmann & John Crane 1:1 Replacement Cartridge Seals for Petrochemical Pumps';
    const generated = generateAISocialPost(selectedPlatform, topic) as SocialPostRecord;
    generated.aiSource = engineSource;

    // Prefer real-AI copy when the OpenAI-compatible API is configured.
    try {
      const r = await aiRun({ task: 'social', lead: {}, platform: selectedPlatform, topic });
      setAiEnabled(r?.configured === true);
      if (r?.configured === true && r?.usedAi && r?.title && r?.content) {
        generated.title = r.title;
        generated.content = r.content;
      }
    } catch (e) {
      // keep the built-in template
    }

    try {
      const saved = await createSocialPost(generated);
      setPosts((prev) => [saved, ...prev]);
    } catch (e) {
      console.warn('Saving social post failed', e);
    }
    setIsGenerating(false);
    setNewTopicInput('');
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteSocialPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.warn('Deleting social post failed', e);
    }
  };

  const handleCycleStatus = async (post: SocialPostRecord) => {
    const next =
      post.status === 'draft' ? 'scheduled' : post.status === 'scheduled' ? 'published' : 'draft';
    try {
      const updated = await updateSocialPost(post.id, { status: next as SocialPostRecord['status'] });
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (e) {
      console.warn('Updating social post status failed', e);
    }
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
          disabled={posts.length === 0}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-2 transition-colors shadow-lg shadow-purple-900/30 disabled:opacity-50"
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
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                aiEnabled
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {aiEnabled ? 'AI 引擎已接入' : '内置模板'}
            </span>
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
            <span>{isGenerating ? '生成中...' : 'Coze AI 生成'}</span>
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
      {isLoading ? (
        <div className="text-center text-xs text-slate-500 py-10">加载已排期帖子...</div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl bg-slate-900/80 border border-dashed border-slate-700 p-12 text-center space-y-2">
          <Inbox className="h-8 w-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-500">
            暂无排期帖子。使用上方「Coze AI 生成」或「飞书插件生成」创建并保存到数据库。
          </p>
        </div>
      ) : (
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

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCycleStatus(post)}
                    title="切换状态 (草稿 → 已排期 → 已发布)"
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                      post.status === 'published'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : post.status === 'scheduled'
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {post.status === 'published' ? '已发布' : post.status === 'scheduled' ? '已排期' : '草稿'}
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="删除排期"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
