export async function onRequestPost(context) {
  const { request } = context;

  try {
    const data = await request.json();

    // Build a branded HTML email from form data
    const serviceLabels = {
      drywall: 'Drywall & Patching', plumbing: 'Plumbing Repairs',
      electrical: 'Electrical', 'doors-windows': 'Doors & Windows',
      flooring: 'Flooring Repairs', painting: 'Painting',
      'network-install': 'Network Installation', 'wifi-optimize': 'WiFi Optimization',
      'smart-home': 'Smart Home Setup', security: 'Security Systems',
      'server-backup': 'Server & Backup', 'av-entertainment': 'AV & Entertainment',
    };
    const svcLabel = serviceLabels[data.service] || data.service || 'Unknown';
    const catLabel = ['drywall','plumbing','electrical','doors-windows','flooring','painting'].includes(data.service)
      ? 'Handyman Services' : 'Network & IoT';

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #0D1117; color: #F0F6FC; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { background: linear-gradient(135deg, #FF6B35, #FF8F65); border-radius: 16px 16px 0 0; padding: 32px; text-align: center; }
    .header h1 { color: white; font-size: 24px; margin: 0; }
    .header p { color: rgba(255,255,255,0.85); font-size: 14px; margin: 8px 0 0; }
    .body { background: #161B22; border: 1px solid rgba(255,255,255,0.1); border-top: none; border-radius: 0 0 16px 16px; padding: 32px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #FF6B35; margin-bottom: 4px; font-weight: 600; }
    .value { font-size: 16px; color: #F0F6FC; }
    .value a { color: #00D9FF; text-decoration: none; }
    .divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0; }
    .message-box { background: rgba(13,17,23,0.6); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; font-size: 15px; line-height: 1.7; color: #F0F6FC; white-space: pre-wrap; }
    .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #8B949E; }
    .tag { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-top: 4px; }
    .tag-orange { background: rgba(255,107,53,0.2); color: #FF6B35; }
    .tag-cyan { background: rgba(0,217,255,0.15); color: #00D9FF; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Quote Request</h1>
      <p>High Sierra Handymen — highsierrahandymen.com</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Customer Name</div>
        <div class="value">${data.name || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">Phone</div>
        <div class="value"><a href="tel:${data.phone}">${data.phone || 'N/A'}</a></div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${data.email}">${data.email || 'N/A'}</a></div>
      </div>
      <div class="field">
        <div class="label">Service Category</div>
        <div class="value"><span class="tag ${catLabel === 'Handyman Services' ? 'tag-orange' : 'tag-cyan'}">${svcLabel}</span></div>
      </div>
      <hr class="divider">
      <div class="field">
        <div class="label">Project Details</div>
        <div class="message-box">${(data.message || 'No details provided').replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      Submitted via highsierrahandymen.com — ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send via Resend from a verified address
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_W8A9vNei_MmXAXdqqCKrCDUQruP7dBEtb',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'HSHandymen <quotes@highsierrahandymen.com>',
        to: ['luis.anaya@highsierrahandymen.com'],
        subject: `New Quote: ${data.name} — ${svcLabel}`,
        html: emailHtml,
        reply_to: data.email || '',
      }),
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://highsierrahandymen.com',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://highsierrahandymen.com',
      },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://highsierrahandymen.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
