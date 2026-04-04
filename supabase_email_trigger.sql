-- ============================================================
-- HSHandymen Quote Email Trigger
-- Run this in: https://supabase.com/dashboard/project/jcrwflbntaolulrbnbeq/sql
-- ============================================================

-- 1. Enable pg_net extension (required for HTTP calls from PostgreSQL)
create extension if not exists pg_net;

-- 2. Create the trigger function
create or replace function public.send_quote_email()
returns trigger
language plpgsql
security definer
as $$
declare
  email_html text;
  payload    jsonb;
begin
  -- Build the email HTML
  email_html :=
    '<h1 style="color:#FF6B35;font-family:Arial,sans-serif;">New Quote Request</h1>'
    || '<div style="font-family:Arial,sans-serif;line-height:1.6;">'
    || '<p><strong>Customer:</strong> '  || coalesce(new.name,    '—') || '</p>'
    || '<p><strong>Phone:</strong> '     || coalesce(new.phone,   '—') || '</p>'
    || '<p><strong>Email:</strong> '     || coalesce(new.email,   '—') || '</p>'
    || '<p><strong>Service:</strong> '   || coalesce(new.service, '—') || '</p>'
    || '<hr style="border:1px solid #eee;margin:20px 0;">'
    || '<h3>Project Details:</h3>'
    || '<p>' || replace(coalesce(new.message, ''), chr(10), '<br>') || '</p>'
    || '<hr style="border:1px solid #eee;margin:20px 0;">'
    || '<p style="color:#666;font-size:12px;"><strong>Source:</strong> High Sierra Handy Website</p>'
    || '</div>';

  -- Build the Resend API JSON payload
  payload := jsonb_build_object(
    'from',    'HSHandymen <quotes@highsierrahandymen.com>',
    'to',      jsonb_build_array('luis.anaya@highsierrahandymen.com', 'vvasquez@highsierrahandymen.com'),
    'subject', 'New Quote: ' || coalesce(new.name, 'Unknown') || ' - ' || coalesce(new.service, 'Unknown'),
    'html',    email_html
  );

  -- Fire HTTP POST to Resend API (non-blocking)
  perform net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer re_W8A9vNei_MmXAXdqqCKrCDUQruP7dBEtb',
      'Content-Type',  'application/json'
    ),
    body    := payload
  );

  return new;
end;
$$;

-- 3. Drop old trigger if it exists, then create fresh
drop trigger if exists on_quote_inserted on public.quotes;

create trigger on_quote_inserted
  after insert on public.quotes
  for each row execute function public.send_quote_email();

-- 4. Quick sanity check
select 'Trigger created successfully ✓' as status;
