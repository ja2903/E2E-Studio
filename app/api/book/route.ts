/**
 * "Book a free call" form handler. Emails each booking to CONTACT_EMAIL via Resend
 * (plain fetch, no SDK). Secrets live in .env.local only: RESEND_API_KEY, CONTACT_EMAIL,
 * optional MAIL_FROM (defaults to Resend's test sender until a domain is verified).
 */

const NEEDS = ["Brand", "Website", "Bookings", "Care"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Light per-instance rate limit: 5 sends per 10 minutes per IP.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field. Pretend it worked.
  if (str(body.website, 200)) return Response.json({ ok: true });

  const name = str(body.name, 100);
  const business = str(body.business, 120);
  const email = str(body.email, 200);
  const phone = str(body.phone, 40);
  const message = str(body.message, 3000);
  const needs = Array.isArray(body.needs) ? body.needs.filter((n): n is string => NEEDS.includes(n as string)) : [];

  if (!name || !business || !EMAIL_RE.test(email)) {
    return Response.json({ error: "invalid" }, { status: 422 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (limited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!key || !to) {
    console.error("[book] RESEND_API_KEY or CONTACT_EMAIL is not set in .env.local");
    return Response.json({ error: "not_configured" }, { status: 500 });
  }

  const text = [
    `Name: ${name}`,
    `Business: ${business}`,
    `Email: ${email}`,
    `Phone: ${phone || "-"}`,
    `Needs: ${needs.join(", ") || "-"}`,
    "",
    message || "(no message)",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || "E2E Studio <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Free call request: ${business}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error("[book] Resend error", res.status, await res.text());
    return Response.json({ error: "send_failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
