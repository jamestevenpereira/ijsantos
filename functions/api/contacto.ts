// Cloudflare Pages Function — POST /api/contacto
// Receives quote-request form submissions and sends email via Resend.
// Required env (Pages > Settings > Environment variables):
//   RESEND_API_KEY       — Resend API key
//   CONTACT_TO_EMAIL     — Destination address (default: jpsantos@ijsantos.com)
//   CONTACT_FROM_EMAIL   — Verified sender (e.g. "IJ Santos <orcamento@ijsantos.pt>")

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] || c
  );

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const name = String(payload.name ?? "").trim().slice(0, 100);
  const email = String(payload.email ?? "").trim().slice(0, 200);
  const phone = String(payload.phone ?? "").trim().slice(0, 40);
  const service = String(payload.service ?? "").trim().slice(0, 80);
  const message = String(payload.message ?? "").trim().slice(0, 2000);
  const honeypot = String(payload.website ?? "");

  // Anti-spam: honeypot field
  if (honeypot) return json({ ok: true });

  if (!name || !email || !phone || !service) {
    return json({ error: "Campos obrigatórios em falta." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Email inválido." }, 400);
  }

  if (!env.RESEND_API_KEY) {
    return json({ error: "Servidor não configurado." }, 500);
  }

  const to = env.CONTACT_TO_EMAIL ?? "jpsantos@ijsantos.com";
  const from = env.CONTACT_FROM_EMAIL ?? "IJ Santos <onboarding@resend.dev>";

  const html = `
    <h2>Novo pedido de orçamento</h2>
    <p><strong>Nome:</strong> ${escape(name)}</p>
    <p><strong>Email:</strong> ${escape(email)}</p>
    <p><strong>Telefone:</strong> ${escape(phone)}</p>
    <p><strong>Serviço:</strong> ${escape(service)}</p>
    ${message ? `<p><strong>Mensagem:</strong><br>${escape(message).replace(/\n/g, "<br>")}</p>` : ""}
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Pedido de orçamento — ${service} — ${name}`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Resend error", res.status, text);
    return json({ error: "Falha no envio. Tente por telefone ou WhatsApp." }, 502);
  }

  return json({ ok: true });
};
