/**
 * Cloudflare Worker entry point — High Sierra Handymen
 *
 * Handles:
 *   POST /api/email  → forwards to Resend API
 *   OPTIONS /api/email → CORS preflight
 *   Everything else  → served from static assets (env.ASSETS)
 *
 * Set RESEND_API_KEY in Cloudflare dashboard → Workers & Pages →
 * highsierrahandy → Settings → Variables & Secrets
 */

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS });
}

async function handleEmail(request, env) {
  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { from, to, subject, html } = body;

  if (!from || !to || !subject || !html) {
    return json({ error: 'Missing required fields: from, to, subject, html' }, 400);
  }

  // Prefer env var set in Cloudflare dashboard, fall back to inline key
  const apiKey = (env && env.RESEND_API_KEY) || 're_W8A9vNei_MmXAXdqqCKrCDUQruP7dBEtb';

  let resendRes;
  try {
    resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
  } catch (err) {
    console.error('[email] Fetch to Resend failed:', err);
    return json({ error: 'Failed to reach Resend API' }, 502);
  }

  let result;
  try {
    result = await resendRes.json();
  } catch {
    result = { message: resendRes.statusText };
  }

  console.log('[email] Resend status:', resendRes.status, JSON.stringify(result));

  return json(result, resendRes.status);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Route /api/email to our handler
    if (url.pathname === '/api/email') {
      return handleEmail(request, env);
    }

    // Everything else → static assets
    return env.ASSETS.fetch(request);
  },
};
