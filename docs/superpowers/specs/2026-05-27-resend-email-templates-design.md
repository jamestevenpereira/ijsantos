# Resend Email Templates — IJ Santos Contact Form

**Date:** 2026-05-27
**Status:** Approved

---

## Context

The contact form (`/contacto`) submits to `functions/api/contacto.ts` (Cloudflare Pages Function). Currently it sends a single plain-HTML email to the admin with no branding and no client confirmation. The goal is to add branded templates that match the IJ Santos visual identity, and add a client confirmation email.

---

## Scope

Single file change: `functions/api/contacto.ts`.
No new dependencies. No changes to the form component or routing.

---

## Email Flow

Every valid form submission triggers **two Resend API calls**:

1. **Admin notification** → `CONTACT_TO_EMAIL` env var (currently `jamestevenpereira@gmail.com` for testing; switch to `jpsantos@ijsantos.com` when ready — env var only, no code change)
2. **Client confirmation** → email address submitted in the form

Both sent from `IJ Santos <onboarding@resend.dev>` until domain `ijsantos.com` is verified in Resend. When verified, update `CONTACT_FROM_EMAIL` env var.

---

## Visual Style

Both emails use the same visual structure (established during brainstorming, Option A):

```
┌────────────────────────────────┐
│  [IJ] IJ Santos    (charcoal)  │  ← bg #1a1a1a, white text
├════════════════════════════════╡  ← 3px solid #DC2626
│                                │
│  LABEL (red, small caps)       │  ← white body bg
│  Heading                       │
│                                │
│  Content                       │
│                                │
├────────────────────────────────┤
│  footer text       (gray bg)   │  ← #f5f5f5
└────────────────────────────────┘
```

Logo: during testing, a CSS-rendered "IJ" box (red square, white text) + "IJ Santos" text. Swap to `<img src="https://ijsantos.com/logo-light.png">` when domain is live.

Brand colors (inline, as email clients don't support CSS variables):
- Background dark: `#1a1a1a`
- Brand red: `#DC2626`
- Body white: `#ffffff`
- Footer gray: `#f5f5f5`
- Body text: `#111111`
- Muted text: `#666666`

---

## Admin Notification Email

**Subject:** `Pedido de orçamento — {serviceLabel} — {name}`
**To:** `CONTACT_TO_EMAIL`
**Reply-To:** client's submitted email (so admin can reply directly)

**Body:**
- Label: `PEDIDO DE ORÇAMENTO`
- Heading: `Novo pedido de orçamento`
- Date/time of submission
- Table rows: Serviço, Nome, Telefone, Email (linked `mailto:`), Mensagem (if present)
- Footer: `ijsantos.com · Zona Industrial de Nelas Lote 13`

---

## Client Confirmation Email

**Subject:** `Recebemos o seu pedido — IJ Santos`
**To:** email submitted in form
**Reply-To:** `CONTACT_TO_EMAIL` (so client can reply to the admin directly)

**Body:**
- Label: `PEDIDO RECEBIDO`
- Heading: `Obrigado, {firstName}!` (first word of name only, friendlier)
- Text: "Recebemos o seu pedido de orçamento. Entraremos em contacto consigo em menos de 24 horas."
- Summary box (border, rounded): Serviço / Nome / Telefone
- Business hours: `Seg–Sex · 08h00 — 17h00`
- Direct contact: `+351 926 051 178`
- Footer: `ijsantos.com · Zona Industrial de Nelas Lote 13`

---

## Error Handling

- If the admin email fails → return 502 to the form (existing behavior, preserved)
- If the client confirmation email fails → log the error but still return `{ ok: true }` to the form. The admin already received the lead; a failed confirmation is not critical enough to show an error to the user.

---

## Testing Checklist

- [ ] Submit form locally or on Cloudflare Pages preview
- [ ] Confirm admin email arrives at `jamestevenpereira@gmail.com`
- [ ] Confirm client email arrives at the submitted address
- [ ] Check layout renders correctly in Gmail
- [ ] Check layout renders correctly in mobile Gmail
- [ ] Verify `reply-to` works: replying to admin email addresses the client, replying to client email addresses the admin
- [ ] Test with message field filled and empty
- [ ] Test with all 7 service types

---

## Future Changes (out of scope now)

- Swap `onboarding@resend.dev` → `noreply@ijsantos.com` (env var, no code change)
- Swap CSS "IJ" box → `<img src="https://ijsantos.com/logo-light.png">` (one line change)
- Switch admin recipient from `jamestevenpereira@gmail.com` → `jpsantos@ijsantos.com` (env var)
