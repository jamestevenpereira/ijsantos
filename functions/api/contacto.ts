// Cloudflare Pages Function — POST /api/contacto
// Env vars (Pages > Settings > Environment variables):
//   RESEND_API_KEY       — Resend API key
//   CONTACT_TO_EMAIL     — Admin destination (default: jamestevenpereira@gmail.com)
//   CONTACT_FROM_EMAIL   — Sender (default: "IJ Santos <onboarding@resend.dev>")
//                          Swap to "IJ Santos <noreply@ijsantos.com>" once domain is verified.

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

const SERVICE_LABELS: Record<string, string> = {
  "construcao-civil": "Construção civil",
  "remodelacoes-reabilitacao": "Remodelações e reabilitação",
  "pinturas-interiores-exteriores": "Pinturas interiores e exteriores",
  "limpeza-fachadas": "Limpeza de fachadas",
  "limpeza-telhados": "Limpeza de telhados",
  "limpeza-pavimentos-exteriores": "Limpeza de pavimentos exteriores",
  outro: "Outro",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c),
  );

const HEADER = `
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#1a1a1a;padding:20px 28px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#DC2626;width:28px;height:28px;border-radius:4px;text-align:center;vertical-align:middle;">
              <span style="color:white;font-weight:900;font-size:13px;font-family:Arial,sans-serif;line-height:28px;">IJ</span>
            </td>
            <td style="padding-left:12px;">
              <span style="color:white;font-weight:700;font-size:15px;font-family:Arial,sans-serif;">IJ Santos</span>
            </td>
            <td style="padding-left:16px;">
              <span style="color:rgba(255,255,255,0.4);font-size:11px;font-family:Arial,sans-serif;">Construção e Limpezas Exteriores</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr><td style="height:3px;background:#DC2626;font-size:0;line-height:0;">&nbsp;</td></tr>
  </table>`;

const FOOTER = `
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#f5f5f5;padding:12px 28px;border-top:1px solid #eee;">
        <span style="font-size:11px;color:#999;font-family:Arial,sans-serif;">
          ijsantos.com · Zona Industrial de Nelas Lote 13, 3520-095 Nelas
        </span>
      </td>
    </tr>
  </table>`;

function wrap(body: string): string {
  return `<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:24px 0;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.1);">
        <tr><td>${HEADER}</td></tr>
        <tr><td style="background:white;padding:28px;">${body}</td></tr>
        <tr><td>${FOOTER}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function adminEmailHtml(data: {
  serviceLabel: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
}): string {
  const { serviceLabel, name, email, phone, message, submittedAt } = data;
  return wrap(`
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#DC2626;font-family:Arial,sans-serif;margin-bottom:6px;">PEDIDO DE ORÇAMENTO</div>
    <div style="font-size:20px;font-weight:700;color:#111;font-family:Arial,sans-serif;margin-bottom:4px;">Novo pedido recebido</div>
    <div style="font-size:12px;color:#999;font-family:Arial,sans-serif;margin-bottom:20px;">${esc(submittedAt)}</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;font-family:Arial,sans-serif;">
      <tr style="border-bottom:1px solid #f0f0f0;">
        <td style="padding:8px 0;color:#666;width:100px;">Serviço</td>
        <td style="padding:8px 0;font-weight:600;color:#111;">${esc(serviceLabel)}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0;">
        <td style="padding:8px 0;color:#666;">Nome</td>
        <td style="padding:8px 0;color:#111;">${esc(name)}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0;">
        <td style="padding:8px 0;color:#666;">Telefone</td>
        <td style="padding:8px 0;color:#111;">${esc(phone)}</td>
      </tr>
      <tr${message ? ' style="border-bottom:1px solid #f0f0f0;"' : ""}>
        <td style="padding:8px 0;color:#666;">Email</td>
        <td style="padding:8px 0;"><a href="mailto:${esc(email)}" style="color:#DC2626;text-decoration:none;">${esc(email)}</a></td>
      </tr>
      ${
        message
          ? `<tr>
        <td style="padding:8px 0;color:#666;vertical-align:top;">Mensagem</td>
        <td style="padding:8px 0;color:#111;line-height:1.5;">${esc(message).replace(/\n/g, "<br>")}</td>
      </tr>`
          : ""
      }
    </table>`);
}

function clientEmailHtml(data: {
  serviceLabel: string;
  name: string;
  phone: string;
}): string {
  const { serviceLabel, name, phone } = data;
  const firstName = esc(name.split(" ")[0]);
  return wrap(`
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#DC2626;font-family:Arial,sans-serif;margin-bottom:6px;">PEDIDO RECEBIDO</div>
    <div style="font-size:20px;font-weight:700;color:#111;font-family:Arial,sans-serif;margin-bottom:12px;">Obrigado, ${firstName}!</div>
    <div style="font-size:14px;color:#444;font-family:Arial,sans-serif;line-height:1.6;margin-bottom:20px;">
      Recebemos o seu pedido de orçamento. Entraremos em contacto consigo em menos de 24 horas.
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:6px;overflow:hidden;margin-bottom:20px;">
      <tr>
        <td colspan="2" style="background:#f9f9f9;padding:10px 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#666;font-family:Arial,sans-serif;border-bottom:1px solid #eee;">
          Resumo do pedido
        </td>
      </tr>
      <tr style="border-bottom:1px solid #f5f5f5;">
        <td style="padding:8px 16px;color:#666;font-family:Arial,sans-serif;font-size:13px;width:90px;">Serviço</td>
        <td style="padding:8px 16px;color:#111;font-weight:600;font-family:Arial,sans-serif;font-size:13px;">${esc(serviceLabel)}</td>
      </tr>
      <tr style="border-bottom:1px solid #f5f5f5;">
        <td style="padding:8px 16px;color:#666;font-family:Arial,sans-serif;font-size:13px;">Nome</td>
        <td style="padding:8px 16px;color:#111;font-family:Arial,sans-serif;font-size:13px;">${esc(name)}</td>
      </tr>
      <tr>
        <td style="padding:8px 16px;color:#666;font-family:Arial,sans-serif;font-size:13px;">Telefone</td>
        <td style="padding:8px 16px;color:#111;font-family:Arial,sans-serif;font-size:13px;">${esc(phone)}</td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-radius:6px;">
      <tr>
        <td style="padding:12px 16px;">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#999;font-family:Arial,sans-serif;margin-bottom:6px;">CONTACTO DIRETO</div>
          <div style="font-size:14px;font-family:Arial,sans-serif;color:#111;margin-bottom:4px;">
            📞 <a href="tel:+351926051178" style="color:#DC2626;text-decoration:none;font-weight:600;">+351 926 051 178</a>
          </div>
          <div style="font-size:12px;color:#666;font-family:Arial,sans-serif;">Seg–Sex · 08h00 — 17h00</div>
        </td>
      </tr>
    </table>`);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const name     = String(payload.name    ?? "").trim().slice(0, 100);
  const email    = String(payload.email   ?? "").trim().slice(0, 200);
  const phone    = String(payload.phone   ?? "").trim().slice(0, 40);
  const service  = String(payload.service ?? "").trim().slice(0, 80);
  const message  = String(payload.message ?? "").trim().slice(0, 2000);
  const honeypot = String(payload.website ?? "");

  if (honeypot) return json({ ok: true });

  if (!name || !email || !phone || !service)
    return json({ error: "Campos obrigatórios em falta." }, 400);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return json({ error: "Email inválido." }, 400);

  if (!env.RESEND_API_KEY)
    return json({ error: "Servidor não configurado." }, 500);

  const serviceLabel = SERVICE_LABELS[service];
  if (!serviceLabel) return json({ error: "Serviço inválido." }, 400);
  const to   = env.CONTACT_TO_EMAIL   ?? "jamestevenpereira@gmail.com";
  const from = env.CONTACT_FROM_EMAIL ?? "IJ Santos <onboarding@resend.dev>";
  const submittedAt = new Date().toLocaleString("pt-PT", {
    timeZone: "Europe/Lisbon",
    dateStyle: "long",
    timeStyle: "short",
  });

  const [adminRes, clientRes] = await Promise.all([
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Pedido de orçamento — ${serviceLabel} — ${name}`,
        html: adminEmailHtml({ serviceLabel, name, email, phone, message, submittedAt }),
      }),
    }),
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from,
        to: [email],
        reply_to: to,
        subject: "Recebemos o seu pedido — IJ Santos",
        html: clientEmailHtml({ serviceLabel, name, phone }),
      }),
    }),
  ]);

  if (!adminRes.ok) {
    const text = await adminRes.text();
    console.error("Resend admin error", adminRes.status, text);
    return json({ error: "Falha no envio. Tente por telefone ou WhatsApp." }, 502);
  }

  if (!clientRes.ok) {
    const text = await clientRes.text();
    console.error("Resend client error", clientRes.status, text);
    // Non-critical: admin received the lead, client confirmation failure is logged only
  }

  return json({ ok: true });
};
