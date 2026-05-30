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

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function adminEmailHtml(data: {
  serviceLabel: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
}): string {
  const { serviceLabel, name, phone, email, message } = data;
  return `
    <table style="font-family:sans-serif;font-size:14px;color:#111;max-width:520px;margin:0 auto;border-collapse:collapse">
      <tr><td colspan="2" style="padding:24px 0 16px;font-size:18px;font-weight:700;border-bottom:2px solid #DC2626">Novo pedido de orçamento — IJ Santos</td></tr>
      <tr><td style="padding:10px 0 0;color:#666;width:120px">Serviço</td><td style="padding:10px 0 0;font-weight:600">${serviceLabel}</td></tr>
      <tr><td style="padding:6px 0 0;color:#666">Nome</td><td style="padding:6px 0 0">${name.trim()}</td></tr>
      <tr><td style="padding:6px 0 0;color:#666">Telefone</td><td style="padding:6px 0 0">${phone.trim()}</td></tr>
      <tr><td style="padding:6px 0 0;color:#666">Email</td><td style="padding:6px 0 0"><a href="mailto:${email.trim()}" style="color:#DC2626">${email.trim()}</a></td></tr>
      ${message?.trim() ? `<tr><td style="padding:12px 0 0;color:#666;vertical-align:top">Mensagem</td><td style="padding:12px 0 0">${message.trim().replace(/\n/g, "<br>")}</td></tr>` : ""}
      <tr><td colspan="2" style="padding:20px 0 0;font-size:12px;color:#999;border-top:1px solid #eee">Enviado a partir do formulário em ijsantos.com</td></tr>
    </table>
  `;
}

function clientEmailHtml(data: { serviceLabel: string; name: string; phone: string }): string {
  const { serviceLabel, name, phone } = data;
  const firstName = name.split(" ")[0] || name;
  return `
    <table style="font-family:sans-serif;font-size:14px;color:#111;max-width:520px;margin:0 auto;border-collapse:collapse">
      <tr><td style="padding:24px 0 12px;font-size:18px;font-weight:700;">Obrigado, ${firstName}!</td></tr>
      <tr><td style="padding:0 0 12px;color:#444;">Recebemos o seu pedido de orçamento. Entraremos em contacto consigo em menos de 24 horas.</td></tr>
      <tr><td style="padding:14px;border:1px solid #eee;border-radius:6px;background:#fafafa;">
        <div style="font-size:12px;color:#666;margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em;">Resumo do pedido</div>
        <div><strong>Serviço:</strong> ${serviceLabel}</div>
        <div><strong>Nome:</strong> ${name}</div>
        <div><strong>Telefone:</strong> ${phone}</div>
      </td></tr>
    </table>
  `;
}

type ContactEnv = {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
};

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

  const { service, name, phone, email, message } = body;
  if (!name?.trim() || !phone?.trim() || !email?.trim()) {
    return json({ error: "Nome, telefone e email são obrigatórios." }, 422);
  }

  const serviceLabel = (service && SERVICE_LABELS[service]) ?? service ?? "—";

  const resend = new Resend(RESEND_API_KEY);
  const [adminResult, clientResult] = await Promise.all([
    resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email.trim(),
      subject: `Pedido de orçamento · ${serviceLabel}`,
      html: adminEmailHtml({ serviceLabel, name, phone, email, message }),
    }),
    resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: email.trim(),
      replyTo: CONTACT_TO_EMAIL,
      subject: "Recebemos o seu pedido — IJ Santos",
      html: clientEmailHtml({ serviceLabel, name, phone }),
    }),
  ]);

  if (adminResult.error) {
    console.error("[contacto] Resend admin error:", adminResult.error);
    return json({ error: "Erro ao enviar email. Tente mais tarde." }, 502);
  }

  if (clientResult.error) {
    console.error("[contacto] Resend client confirmation error:", clientResult.error);
  }

  return json({ ok: true });
}
