/**
 * Cloudflare Pages Function — POST /api/email
 * Forwards quote notification emails to Resend API.
 *
 * Expected request body:
 *   { from, to, subject, html }
 *
 * Set RESEND_API_KEY in Cloudflare Pages → Settings → Environment Variables
 * for production. The fallback below matches what's already in index.html.
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

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

// Handle the email send
export async function onRequestPost(context) {
  try {
    let body;
    try {
      body = await context.request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const { from, to, subject, html } = body;

    if (!from || !to || !subject || !html) {
      return json({ error: 'Missing required fields: from, to, subject, html' }, 400);
    }

    // Prefer env var (set in Cloudflare Pages dashboard) — fallback to inline key
    const apiKey =
      (context.env && context.env.RESEND_API_KEY) ||
      're_W8A9vNei_MmXAXdqqCKrCDUQruP7dBEtb';

    const resend = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    let result;
    try {
      result = await resend.json();
    } catch {
      result = { message: resend.statusText };
    }

    // Log for Cloudflare Functions logs
    console.log('[email] Resend status:', resend.status, JSON.stringify(result));

    return json(result, resend.status);

  } catch (err) {
    console.error('[email] Unexpected error:', err);
    return json({ error: err.message || 'Internal server error' }, 500);
  }
}
