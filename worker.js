/**
 * Cloudflare Worker — High Sierra Handymen
 *
 * Routes:
 *   POST /api/email       → forwards quote submissions to Resend
 *   OPTIONS /api/email    → CORS preflight
 *   GET  *                → serves static assets (env.ASSETS)
 *
 * Env vars (set in Cloudflare dashboard → Workers & Pages → highsierrahandy → Settings → Variables):
 *   RESEND_API_KEY  — required. Get from https://resend.com/api-keys
 *   MAIL_TO         — optional override, defaults to "info@highsierrahandymen.com"
 *   MAIL_FROM       — optional override, defaults to "HSHandymen <quotes@highsierrahandymen.com>"
 *
 * Deploy: `wrangler deploy` (from this repo root)
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });

// Simple HTML escape — we build the email HTML from user input, never trust it
function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SERVICE_NAMES = {
  'drywall': 'Drywall & Patching',
  'plumbing': 'Plumbing Repairs',
  'electrical': 'Electrical',
  'doors-windows': 'Doors & Windows',
  'flooring': 'Flooring Repairs',
  'painting': 'Painting',
  'network-install': 'Network Installation',
  'wifi-optimize': 'WiFi Optimization',
  'smart-home': 'Smart Home Setup',
  'security': 'Security Systems',
  'server-backup': 'Server & Backup',
  'av-entertainment': 'AV & Entertainment',
};

const HANDYMAN_SERVICES = new Set([
  'drywall', 'plumbing', 'electrical', 'doors-windows', 'flooring', 'painting',
]);

async function handleEmail(request, env) {
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

  const { name, phone, email, service, message } = body || {};
  if (!name || !phone || !email || !service || !message) {
    return json({ error: 'Missing required fields: name, phone, email, service, message' }, 400);
  }
  // Basic email shape check — Resend does the strict validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Invalid email address' }, 400);
  }
  // Basic honeypot-style abuse guard
  if (String(message).length > 5000) {
    return json({ error: 'Message too long (max 5000 chars)' }, 400);
  }

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[email] RESEND_API_KEY is not set in Worker env');
    return json({ error: 'Email service is not configured' }, 500);
  }

  const serviceDisplay = SERVICE_NAMES[service] || service;
  const category = HANDYMAN_SERVICES.has(service) ? 'Handyman Services' : 'Network & IoT';
  const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

  const emailHtml = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#1f2937;max-width:600px;">
      <h1 style="color:#FF6B35;margin:0 0 16px;">New Quote Request</h1>
      <p style="color:#6b7280;margin:0 0 20px;">Submitted via highsierrahandymen.com contact form</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 12px;color:#6b7280;width:140px;">Customer</td><td style="padding:6px 12px;font-weight:600;">${esc(name)}</td></tr>
        <tr><td style="padding:6px 12px;color:#6b7280;">Phone</td><td style="padding:6px 12px;"><a href="tel:${esc(phone)}">${esc(phone)}</a></td></tr>
        <tr><td style="padding:6px 12px;color:#6b7280;">Email</td><td style="padding:6px 12px;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:6px 12px;color:#6b7280;">Category</td><td style="padding:6px 12px;">${esc(category)}</td></tr>
        <tr><td style="padding:6px 12px;color:#6b7280;">Service</td><td style="padding:6px 12px;font-weight:600;">${esc(serviceDisplay)}</td></tr>
      </table>
      <hr style="border:0;border-top:1px solid #e5e7eb;margin:20px 0;">
      <h3 style="margin:0 0 8px;">Project Details</h3>
      <p style="margin:0;white-space:pre-wrap;">${esc(message).replace(/\n/g, '<br>')}</p>
      <hr style="border:0;border-top:1px solid #e5e7eb;margin:20px 0;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        Submitted ${esc(submittedAt)} PT<br>
        Source: highsierrahandymen.com contact form
      </p>
    </div>`.trim();

  const subject = `New Quote: ${name} — ${serviceDisplay}`;

  let resendRes;
  try {
    resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.MAIL_FROM || 'HSHandymen <quotes@highsierrahandymen.com>',
        to: [env.MAIL_TO || 'info@highsierrahandymen.com'],
        reply_to: email,
        subject,
        html: emailHtml,
      }),
    });
  } catch (err) {
    console.error('[email] Resend fetch failed:', err);
    return json({ error: 'Failed to reach email service' }, 502);
  }

  let result;
  try {
    result = await resendRes.json();
  } catch {
    result = { message: resendRes.statusText };
  }

  if (!resendRes.ok) {
    console.error('[email] Resend returned', resendRes.status, JSON.stringify(result));
    return json(
      { error: 'Email service rejected the request', detail: result.message || result.error },
      resendRes.status,
    );
  }

  return json({ ok: true, id: result.id });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/email') {
      return handleEmail(request, env);
    }

    // Everything else → static assets (HTML, CSS, JS, images, etc.)
    return env.ASSETS.fetch(request);
  },
};
