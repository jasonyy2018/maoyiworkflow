import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let setting = await prisma.systemSetting.findUnique({
      where: { id: 'default' },
    });

    if (!setting) {
      setting = await prisma.systemSetting.create({
        data: {
          id: 'default',
          model: 'custom-openai',
          customModelName: 'gpt-4o-mini',
          customBaseUrl: 'https://api.openai.com/v1',
          smtpServer: 'smtp.queeny-seals.com',
          smtpUser: 'export@queeny-seals.com',
          customPrompt: `角色：你是一名专精“机械密封件 (Mechanical Seals)”海外 B2B 市场营销的高级 AI 专家。\n使命：针对 Burgmann、John Crane、AESSEAL 等原厂品牌提供 1:1 无缝替代（ Drop-in Replacement），突出 40-50% 成本降低与 7-14 天快速交期痛点。`,
        },
      });
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error('Error reading settings from SQLite:', error);
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = await prisma.systemSetting.upsert({
      where: { id: 'default' },
      update: {
        model: body.model,
        apiKey: body.apiKey,
        customModelName: body.customModelName,
        customBaseUrl: body.customBaseUrl,
        smtpServer: body.smtpServer,
        smtpUser: body.smtpUser,
        customPrompt: body.customPrompt,
      },
      create: {
        id: 'default',
        model: body.model || 'custom-openai',
        apiKey: body.apiKey,
        customModelName: body.customModelName || 'gpt-4o-mini',
        customBaseUrl: body.customBaseUrl || 'https://api.openai.com/v1',
        smtpServer: body.smtpServer,
        smtpUser: body.smtpUser,
        customPrompt: body.customPrompt,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error saving settings to SQLite:', error);
    return NextResponse.json({ error: 'Failed to save settings to SQLite' }, { status: 500 });
  }
}
