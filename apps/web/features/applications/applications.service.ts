import {
  applicationsApi,
  type CreateApplicationBody,
  type SavedApplication,
} from '@repo/api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type SubmitApplicationResult =
  | { ok: true; data: SavedApplication }
  | { ok: false; error: 'invalid' | 'invalid_code' | 'db' };

function parseErrorCode(body: unknown): string | undefined {
  if (!body || typeof body !== 'object') return undefined;
  const o = body as Record<string, unknown>;

  const message = o.message;
  if (message && typeof message === 'object') {
    const inner = (message as Record<string, unknown>).error;
    if (typeof inner === 'string') return inner;
  }

  if (typeof o.error === 'string') return o.error;
  return undefined;
}

/** Client-side POST /applications; maps HTTP errors to {@link SubmitApplicationResult}. */
export async function createApplication(
  body: CreateApplicationBody,
): Promise<SubmitApplicationResult> {
  const endpoint = applicationsApi.create(body);

  const res = await fetch(`${API_BASE_URL}${endpoint.url}`, {
    method: endpoint.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.status === 201) {
    let raw: unknown;
    try {
      raw = await res.json();
    } catch {
      return { ok: false, error: 'db' };
    }
    const data = raw as SavedApplication;
    if (
      typeof data?.id !== 'number' ||
      typeof data.firstName !== 'string' ||
      typeof data.lastName !== 'string'
    ) {
      return { ok: false, error: 'db' };
    }
    return { ok: true, data };
  }

  if (res.status === 400) {
    let data: unknown;
    try {
      data = await res.json();
    } catch {
      return { ok: false, error: 'invalid' };
    }
    const code = parseErrorCode(data);
    if (code === 'INVALID_CODE') return { ok: false, error: 'invalid_code' };
    return { ok: false, error: 'invalid' };
  }

  return { ok: false, error: 'db' };
}
