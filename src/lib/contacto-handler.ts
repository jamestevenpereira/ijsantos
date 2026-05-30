import { Resend } from "resend";

const SERVICE_LABELS: Record<string, string> = {
  "construcao-civil": "Construção civil",
  "remodelacoes-reabilitacao": "Remodelações e reabilitação",
  "pinturas-interiores-exteriores": "Pinturas interiores e exteriores",
  "limpeza-fachadas": "Limpeza de fachadas",
  "limpeza-telhados": "Limpeza de telhados",
  "limpeza-pavimentos-exteriores": "Limpeza de pavimentos exteriores",
  outro: "Outro",
};

const COMPANY = {
  name: "IJ Santos",
  legalName: "Irmãos J. Santos, Lda.",
  tagline: "Construção e Limpezas Exteriores",
  siteUrl: "https://ijsantos-site.pages.dev",
  logoUrl: "https://ijsantos-site.pages.dev/logo-light.png",
  phone: "+351 926 051 178",
  phoneHref: "tel:+351926051178",
  email: "jpsantos@ijsantos.com",
  emailHref: "mailto:jpsantos@ijsantos.com",
  whatsappUrl: "https://wa.me/351926051178",
  address: "Zona Industrial de Nelas Lote 13, 3520-095 Nelas",
  hours: "Segunda a sexta, 08h00 - 17h00",
};

type ContactEnv = {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function esc(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char] ?? char,
  );
}

function nl2br(value: string): string {
  return esc(value).replace(/\n/g, "<br>");
}

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function emailShell(params: { title: string; preview: string; body: string }): string {
  const { title, preview, body } = params;

  return `<!doctype html>
<html lang="pt">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f1ed;color:#171717;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preview)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#f4f1ed;">
      <tr>
        <td align="center" style="padding:28px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-collapse:collapse;background:#ffffff;border:1px solid #e8e0d8;">
            <tr>
              <td style="background:#171717;padding:26px 30px 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${COMPANY.logoUrl}" width="148" alt="${COMPANY.name}" style="display:block;width:148px;max-width:148px;height:auto;border:0;">
                    </td>
                    <td align="right" style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#d6d3d1;">
                      ${COMPANY.tagline}<br>
                      <span style="color:#dc3b20;">Nelas · Região Centro</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            ${body}
            <tr>
              <td style="background:#171717;padding:24px 30px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#f5f5f4;">
                      <strong>${COMPANY.legalName}</strong><br>
                      ${COMPANY.address}<br>
                      ${COMPANY.hours}
                    </td>
                    <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#f5f5f4;">
                      <a href="${COMPANY.phoneHref}" style="color:#ffffff;text-decoration:none;">${COMPANY.phone}</a><br>
                      <a href="${COMPANY.emailHref}" style="color:#ffffff;text-decoration:none;">${COMPANY.email}</a><br>
                      <a href="${COMPANY.siteUrl}" style="color:#dc3b20;text-decoration:none;">ijsantos.com</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function adminEmailHtml(data: {
  serviceLabel: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  submittedAt: string;
}): string {
  const { serviceLabel, name, phone, email, message, submittedAt } = data;
  const safeName = esc(name.trim());
  const safePhone = esc(phone.trim());
  const safeEmail = esc(email.trim());
  const safeService = esc(serviceLabel);
  const safeSubmittedAt = esc(submittedAt);

  return emailShell({
    title: "Novo pedido de orçamento - IJ Santos",
    preview: `Novo contacto de ${name.trim()} sobre ${serviceLabel}.`,
    body: `
      <tr>
        <td style="padding:30px 30px 20px;font-family:Arial,Helvetica,sans-serif;">
          <div style="font-size:12px;line-height:16px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#c7351c;">Pedido de orçamento</div>
          <h1 style="margin:8px 0 8px;font-size:26px;line-height:32px;color:#171717;font-weight:800;">Novo contacto recebido</h1>
          <p style="margin:0;color:#57534e;font-size:15px;line-height:24px;">Recebido em ${safeSubmittedAt}. O cliente pediu contacto sobre <strong style="color:#171717;">${safeService}</strong>.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 30px 26px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #e7e1dc;background:#fffaf5;">
            <tr>
              <td style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;border-bottom:1px solid #e7e1dc;">
                <div style="font-size:12px;line-height:16px;color:#78716c;text-transform:uppercase;letter-spacing:.06em;">Nome</div>
                <div style="margin-top:4px;font-size:18px;line-height:24px;font-weight:700;color:#171717;">${safeName}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td width="50%" style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;border-right:1px solid #e7e1dc;">
                      <div style="font-size:12px;line-height:16px;color:#78716c;text-transform:uppercase;letter-spacing:.06em;">Telefone</div>
                      <a href="${phoneHref(phone)}" style="display:block;margin-top:4px;font-size:16px;line-height:22px;color:#171717;text-decoration:none;font-weight:700;">${safePhone}</a>
                    </td>
                    <td width="50%" style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;">
                      <div style="font-size:12px;line-height:16px;color:#78716c;text-transform:uppercase;letter-spacing:.06em;">Email</div>
                      <a href="mailto:${safeEmail}" style="display:block;margin-top:4px;font-size:16px;line-height:22px;color:#c7351c;text-decoration:none;font-weight:700;">${safeEmail}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            ${
              message?.trim()
                ? `<tr><td style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;border-top:1px solid #e7e1dc;"><div style="font-size:12px;line-height:16px;color:#78716c;text-transform:uppercase;letter-spacing:.06em;">Mensagem</div><div style="margin-top:8px;font-size:15px;line-height:24px;color:#292524;">${nl2br(message.trim())}</div></td></tr>`
                : ""
            }
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 30px 32px;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            <tr>
              <td style="background:#c7351c;">
                <a href="${phoneHref(phone)}" style="display:inline-block;padding:13px 18px;font-size:14px;line-height:18px;color:#ffffff;text-decoration:none;font-weight:700;">Ligar ao cliente</a>
              </td>
              <td style="width:10px;"></td>
              <td style="background:#171717;">
                <a href="mailto:${safeEmail}" style="display:inline-block;padding:13px 18px;font-size:14px;line-height:18px;color:#ffffff;text-decoration:none;font-weight:700;">Responder por email</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`,
  });
}

function clientEmailHtml(data: { serviceLabel: string; name: string; phone: string }): string {
  const { serviceLabel, name, phone } = data;
  const firstName = name.split(" ")[0] || name;
  const safeFirstName = esc(firstName);
  const safeService = esc(serviceLabel);
  const safeName = esc(name.trim());
  const safePhone = esc(phone.trim());

  return emailShell({
    title: "Pedido recebido - IJ Santos",
    preview: "Recebemos o seu pedido. A equipa IJ Santos vai responder em menos de 24 horas.",
    body: `
      <tr>
        <td style="padding:32px 30px 18px;font-family:Arial,Helvetica,sans-serif;">
          <div style="font-size:12px;line-height:16px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#c7351c;">Pedido recebido</div>
          <h1 style="margin:8px 0 10px;font-size:28px;line-height:34px;color:#171717;font-weight:800;">Obrigado, ${safeFirstName}.</h1>
          <p style="margin:0;color:#44403c;font-size:16px;line-height:25px;">Recebemos o seu pedido de orçamento. A nossa equipa vai analisar a informação enviada e entrar em contacto consigo em menos de 24 horas úteis.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 30px 26px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#fffaf5;border:1px solid #e7e1dc;">
            <tr>
              <td colspan="2" style="padding:16px 20px 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;color:#78716c;text-transform:uppercase;letter-spacing:.06em;">Resumo do pedido</td>
            </tr>
            <tr>
              <td style="padding:8px 20px 14px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#78716c;width:120px;">Serviço</td>
              <td style="padding:8px 20px 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#171717;font-weight:700;">${safeService}</td>
            </tr>
            <tr>
              <td style="padding:0 20px 14px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#78716c;">Nome</td>
              <td style="padding:0 20px 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#171717;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:0 20px 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#78716c;">Telefone</td>
              <td style="padding:0 20px 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#171717;">${safePhone}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 30px 30px;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#171717;">
            <tr>
              <td style="padding:20px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
                <div style="font-size:16px;line-height:22px;font-weight:700;margin-bottom:6px;">Precisa de falar connosco mais cedo?</div>
                <div style="font-size:14px;line-height:22px;color:#d6d3d1;">Pode ligar ou enviar mensagem por WhatsApp. Estamos disponíveis em horário laboral.</div>
                <div style="margin-top:14px;">
                  <a href="${COMPANY.phoneHref}" style="display:inline-block;background:#c7351c;color:#ffffff;text-decoration:none;font-size:14px;line-height:18px;font-weight:700;padding:12px 16px;">Ligar agora</a>
                  <a href="${COMPANY.whatsappUrl}" style="display:inline-block;color:#ffffff;text-decoration:none;font-size:14px;line-height:18px;font-weight:700;padding:12px 0 12px 14px;">WhatsApp</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`,
  });
}

function adminEmailText(data: {
  serviceLabel: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  submittedAt: string;
}): string {
  return [
    "Novo pedido de orçamento - IJ Santos",
    "",
    `Recebido em: ${data.submittedAt}`,
    `Serviço: ${data.serviceLabel}`,
    `Nome: ${data.name}`,
    `Telefone: ${data.phone}`,
    `Email: ${data.email}`,
    data.message?.trim() ? `Mensagem: ${data.message.trim()}` : "",
    "",
    `${COMPANY.name} - ${COMPANY.phone} - ${COMPANY.siteUrl}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function clientEmailText(data: { serviceLabel: string; name: string; phone: string }): string {
  const firstName = data.name.split(" ")[0] || data.name;
  return [
    `Obrigado, ${firstName}.`,
    "",
    "Recebemos o seu pedido de orçamento. A equipa IJ Santos vai analisar a informação enviada e entrar em contacto consigo em menos de 24 horas úteis.",
    "",
    `Serviço: ${data.serviceLabel}`,
    `Nome: ${data.name}`,
    `Telefone: ${data.phone}`,
    "",
    `Contacto direto: ${COMPANY.phone}`,
    `Site: ${COMPANY.siteUrl}`,
  ].join("\n");
}

export async function handleContacto(request: Request, env?: ContactEnv): Promise<Response> {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const RESEND_API_KEY = env?.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  const CONTACT_TO_EMAIL = env?.CONTACT_TO_EMAIL ?? process.env.CONTACT_TO_EMAIL;
  const CONTACT_FROM_EMAIL = env?.CONTACT_FROM_EMAIL ?? process.env.CONTACT_FROM_EMAIL;

  if (!RESEND_API_KEY) {
    return json({ error: "Email service not configured." }, 503);
  }
  if (!CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return json({ error: "Contact email settings are missing." }, 503);
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const name = String(body.name ?? "").trim().slice(0, 100);
  const phone = String(body.phone ?? "").trim().slice(0, 40);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const service = String(body.service ?? "").trim().slice(0, 80);
  const message = String(body.message ?? "").trim().slice(0, 2000);

  if (!name || !phone || !email) {
    return json({ error: "Nome, telefone e email são obrigatórios." }, 422);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Email inválido." }, 422);
  }

  const serviceLabel = (service && SERVICE_LABELS[service]) ?? service ?? "Outro";
  const submittedAt = new Date().toLocaleString("pt-PT", {
    timeZone: "Europe/Lisbon",
    dateStyle: "long",
    timeStyle: "short",
  });

  const resend = new Resend(RESEND_API_KEY);
  const adminData = { serviceLabel, name, phone, email, message, submittedAt };
  const clientData = { serviceLabel, name, phone };
  const [adminResult, clientResult] = await Promise.all([
    resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Novo pedido de orçamento - ${serviceLabel} - ${name}`,
      html: adminEmailHtml(adminData),
      text: adminEmailText(adminData),
    }),
    resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: email,
      replyTo: CONTACT_TO_EMAIL,
      subject: "Recebemos o seu pedido - IJ Santos",
      html: clientEmailHtml(clientData),
      text: clientEmailText(clientData),
    }),
  ]);

  if (adminResult.error) {
    console.error("[contacto] Resend admin error:", adminResult.error);
    return json({ error: "Erro ao enviar email. Tente mais tarde." }, 502);
  }

  if (clientResult.error) {
    console.error("[contacto] Resend client confirmation error:", clientResult.error);
    return json({ error: "Erro ao enviar confirmação. Tente novamente." }, 502);
  }

  return json({ ok: true });
}
