export async function onRequestPost(context) {
  const { request } = context;

  try {
    const data = await request.json();

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_W8A9vNei_MmXAXdqqCKrCDUQruP7dBEtb',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: data.from || 'HSHandymen <onboarding@resend.dev>',
        to: data.to || ['luis.anaya@highsierrahandymen.com'],
        subject: data.subject || 'New Quote Request',
        html: data.html || '',
        reply_to: data.reply_to || data.email || '',
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
        'Access-Control-Max-Age': '86400',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://highsierrahandymen.com',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
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
