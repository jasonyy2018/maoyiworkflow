import { NextResponse } from 'next/server';
import { getAIConfig, callLLM } from '@/lib/llm';
import { generateColdEmailText, generateWhatsAppMessage } from '@/lib/ai-services';

const SYSTEM_DEFAULT =
  '你是专精“机械密封件 (Mechanical Seals)”海外 B2B 市场营销的高级 AI 专家。' +
  '针对 Burgmann、John Crane、AESSEAL、Flowserve 等原厂品牌提供 1:1 无缝替代 (Drop-in Replacement)，' +
  '突出 40-50% 成本降低与 7-14 天快速交期。文案需专业、精准、有说服力。';

// Extract the first balanced JSON object from an LLM reply (tolerates markdown fences).
function extractJson(text: string): any {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

function buildPrompt(task: string, lead: any, language: string, body: any): string {
  const langLabel = language === 'ru' ? '俄语' : '英语';
  const painPoints = (lead.painPoints || []).join('；') || '高 OEM 采购成本、长交期';
  const baseline =
    `潜客信息：公司 ${lead.companyName}，国家 ${lead.country}，城市 ${lead.city}，` +
    `行业 ${lead.industry}，需求类型 ${lead.demandType}，原厂对标 ${lead.equivalentBrand || 'Burgmann/John Crane'}，` +
    `决策人 ${lead.contactPerson || '采购经理'}。痛点：${painPoints}。`;

  if (task === 'whatsapp') {
    return (
      `请为机械密封件潜客生成一条简洁、友好、专业的 WhatsApp 破冰消息（不超过 130 词）。\n` +
      `必须只输出 JSON，格式：{"content":"..."}。语言：${langLabel}。\n${baseline}\n` +
      `要点：Queeny Seals 提供 1:1 替代密封件、约 40% 降本、7 天快速交期，询问是否方便发送最新目录 / 报价。`
    );
  }

  if (task === 'social') {
    const platform = body.platform || 'LinkedIn';
    const topic = body.topic || 'Burgmann / John Crane 1:1 替代机械密封件';
    return (
      `请为 ${platform} 撰写一篇机械密封件 B2B 营销帖子。\n` +
      `必须只输出 JSON，格式：{"title":"...","content":"..."}。语言：英语。\n` +
      `主题：${topic}。要求 professional tone；在 content 末尾用换行附 3-5 个相关 hashtags（如 #MechanicalSeals #PumpMaintenance）。`
    );
  }

  // default: email
  return (
    `请为以下潜客生成一封专业、个性化的 1对1 机械密封件开发信。\n` +
    `必须只输出 JSON，格式：{"subject":"...","body":"..."}。语言：${langLabel}。\n${baseline}\n` +
    `正文要求：说明可提供原厂品牌的 1:1 无缝替代；突出 40-50% 降本、7-14 天快速交期、ISO 9001 / API 682 认证；` +
    `结尾礼貌邀请对方回复索取目录或测试样件；署名 Queeny Seals 外贸团队。`
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = body.task || 'email';
    const lead = body.lead || {};
    const language = body.language === 'en' ? 'en' : 'ru';

    const cfg = await getAIConfig();
    const apiKey = cfg?.apiKey || '';
    if (!apiKey) {
      return NextResponse.json({ configured: false });
    }

    const system = cfg?.customPrompt || SYSTEM_DEFAULT;
    const userPrompt = buildPrompt(task, lead, language, body);

    let raw: string | null = null;
    try {
      raw = await callLLM(
        [
          { role: 'system', content: system },
          { role: 'user', content: userPrompt },
        ],
        { json: true }
      );
    } catch (e) {
      console.error('LLM call failed, falling back to template:', (e as any)?.message || e);
      raw = null;
    }

    const parsed = raw ? extractJson(raw) : null;

    if (task === 'whatsapp') {
      if (parsed && parsed.content) {
        return NextResponse.json({ configured: true, usedAi: true, content: parsed.content });
      }
      return NextResponse.json({ configured: true, usedAi: false, content: generateWhatsAppMessage(lead) });
    }

    if (task === 'social') {
      if (parsed && parsed.title && parsed.content) {
        return NextResponse.json({ configured: true, usedAi: true, title: parsed.title, content: parsed.content });
      }
      return NextResponse.json({ configured: true, usedAi: false });
    }

    // email
    if (parsed && parsed.subject && parsed.body) {
      return NextResponse.json({ configured: true, usedAi: true, subject: parsed.subject, body: parsed.body });
    }
    const fb = generateColdEmailText(lead, language);
    return NextResponse.json({ configured: true, usedAi: false, subject: fb.subject, body: fb.body });
  } catch (err) {
    console.error('AI route error:', (err as any)?.message || err);
    return NextResponse.json({ configured: false });
  }
}
