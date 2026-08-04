import { NextResponse } from 'next/server';
import { getAIConfig } from '@/lib/llm';
import { normalizeWhatsAppNumber } from '@/lib/ai-services';

// Real WhatsApp registration verification against a provider configured in Settings
// (waVerifyUrl + waVerifyToken). When no provider is configured it returns
// { configured:false } so the client falls back to the built-in simulation.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const number = String(body.number || '');
    const country = body.country ? String(body.country) : undefined;
    const formattedNumber = normalizeWhatsAppNumber(number, country);

    const cfg = await getAIConfig();
    const url = cfg?.waVerifyUrl || '';
    if (!url) {
      return NextResponse.json({ configured: false, formattedNumber, status: 'unverified' });
    }
    const token = cfg?.waVerifyToken || '';

    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          phone: formattedNumber,
          number: formattedNumber,
          ...(country ? { country } : {}),
        }),
        signal: AbortSignal.timeout(15000),
      });
    } catch (e) {
      console.error('WA verify request failed:', (e as any)?.message || e);
      return NextResponse.json({ configured: true, formattedNumber, status: 'unverified', providerError: 'request_failed' });
    }

    if (!res.ok) {
      return NextResponse.json({ configured: true, formattedNumber, status: 'unverified', providerError: `HTTP ${res.status}` });
    }

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      /* provider may return non-JSON; leave data as {} */
    }

    const isReg = isRegistered(data);
    const status = isReg === true ? 'verified' : isReg === false ? 'not_registered' : 'unverified';
    return NextResponse.json({ configured: true, formattedNumber, status, raw: data });
  } catch (err) {
    console.error('WA verify error:', (err as any)?.message || err);
    return NextResponse.json({ configured: false, status: 'unverified' });
  }
}

// Tolerant parse: accept boolean, or common key names / wrapped objects across providers.
function isRegistered(data: any): boolean | null {
  if (typeof data === 'boolean') return data;
  if (!data || typeof data !== 'object') return null;

  for (const key of ['registered', 'exists', 'valid', 'wa', 'available', 'whatsapp', 'is_whatsapp', 'ok']) {
    if (typeof data[key] === 'boolean') return data[key];
  }

  for (const wrap of ['data', 'result', 'response']) {
    if (data[wrap] && typeof data[wrap] === 'object') {
      const sub = isRegistered(data[wrap]);
      if (sub !== null) return sub;
    }
  }
  return null;
}
