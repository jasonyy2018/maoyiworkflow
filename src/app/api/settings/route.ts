import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rows: any[] = await prisma.$queryRaw`SELECT * FROM SystemSetting WHERE id = 'default'`;
    if (rows && rows.length > 0) {
      return NextResponse.json(rows[0]);
    }

    await prisma.$executeRaw`
      INSERT INTO SystemSetting (id, model, apiKey, customModelName, customBaseUrl, gmapkdevUrl, smtpServer, smtpUser, customPrompt, updatedAt)
      VALUES ('default', 'custom-openai', '', 'gpt-4o-mini', 'https://api.openai.com/v1', 'http://localhost:3001/api/leads/search', 'smtp.queeny-seals.com', 'export@queeny-seals.com', '角色：你是一名专精“机械密封件 (Mechanical Seals)”海外 B2B 市场营销的高级 AI 专家。', CURRENT_TIMESTAMP)
    `;

    const newRows: any[] = await prisma.$queryRaw`SELECT * FROM SystemSetting WHERE id = 'default'`;
    return NextResponse.json(newRows[0] || {});
  } catch (error) {
    console.error('Error reading settings from SQLite:', error);
    return NextResponse.json({
      id: 'default',
      model: 'custom-openai',
      customModelName: 'gpt-4o-mini',
      customBaseUrl: 'https://api.openai.com/v1',
      gmapkdevUrl: 'http://localhost:3001/api/leads/search',
    });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const model = body.model || 'custom-openai';
    const apiKey = body.apiKey || '';
    const customModelName = body.customModelName || 'gpt-4o-mini';
    const customBaseUrl = body.customBaseUrl || 'https://api.openai.com/v1';
    const gmapkdevUrl = body.gmapkdevUrl || 'http://localhost:3001/api/leads/search';
    const smtpServer = body.smtpServer || 'smtp.queeny-seals.com';
    const smtpUser = body.smtpUser || 'export@queeny-seals.com';
    const customPrompt = body.customPrompt || '';

    await prisma.$executeRaw`
      INSERT INTO SystemSetting (id, model, apiKey, customModelName, customBaseUrl, gmapkdevUrl, smtpServer, smtpUser, customPrompt, updatedAt)
      VALUES ('default', ${model}, ${apiKey}, ${customModelName}, ${customBaseUrl}, ${gmapkdevUrl}, ${smtpServer}, ${smtpUser}, ${customPrompt}, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        model = ${model},
        apiKey = ${apiKey},
        customModelName = ${customModelName},
        customBaseUrl = ${customBaseUrl},
        gmapkdevUrl = ${gmapkdevUrl},
        smtpServer = ${smtpServer},
        smtpUser = ${smtpUser},
        customPrompt = ${customPrompt},
        updatedAt = CURRENT_TIMESTAMP
    `;

    return NextResponse.json({
      success: true,
      id: 'default',
      model,
      apiKey,
      customModelName,
      customBaseUrl,
      gmapkdevUrl,
      smtpServer,
      smtpUser,
      customPrompt,
    });
  } catch (error) {
    console.error('Error saving settings to SQLite:', error);
    return NextResponse.json({ error: 'Failed to save settings to SQLite' }, { status: 500 });
  }
}
