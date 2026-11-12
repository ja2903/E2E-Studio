"use client";

import { useRef, useState } from "react";
import { needs } from "@/lib/content";

const field =
  "mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-cloud placeholder:text-cloud-muted/60 focus:border-electric focus:outline-none";
const label = "block font-heading text-sm font-semibold";

type Status = "idle" | "sending" | "sent" | "error";

/** The booking form. Posts JSON to /api/book, which emails it to CONTACT_EMAIL. */
export default function BookForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const doneRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          business: data.get("business"),
          email: data.get("email"),
          phone: data.get("phone"),
          needs: data.getAll("needs"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      if (!res.ok) {
        const { error: code } = await res.json().catch(() => ({ error: "" }));
        throw new Error(
          code === "invalid"
            ? "Please check your name, business name and email."
            : code === "rate_limited"
              ? "That's a few in a row. Please wait a few minutes and try again."
              : "Sorry, that didn't send. Please try again in a moment.",
        );
      }
      form.reset();
      setStatus("sent");
      requestAnimationFrame(() => doneRef.current?.focus());
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Sorry, that didn't send. Please try again in a moment.");
    }
  }

  if (status === "sent") {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className="card grid content-center gap-4 p-6 text-center outline-none sm:p-8"
      >
        <span aria-hidden="true" className="mx-auto grid size-14 place-items-center rounded-full bg-electric text-2xl text-midnight">
          ✓
        </span>
        <h3 className="text-2xl font-semibold">{"Thanks, we've got it."}</h3>
        <p className="text-cloud-muted">{"We'll be in touch soon to find a time that suits you."}</p>
        <button type="button" onClick={() => setStatus("idle")} className="link-quiet mx-auto">
          Send another
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form method="post" action="/api/book" onSubmit={onSubmit} className="card relative grid gap-5 p-6 sm:p-8" aria-label="Book a free call" aria-busy={sending}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Your name
          <input className={field} name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label className={label}>
          Business name
          <input className={field} name="business" autoComplete="organization" required maxLength={120} />
        </label>
        <label className={label}>
          Email
          <input className={field} type="email" name="email" autoComplete="email" required maxLength={200} />
        </label>
        <label className={label}>
          Phone <span className="font-normal text-cloud-muted">(optional)</span>
          <input className={field} type="tel" name="phone" autoComplete="tel" maxLength={40} />
        </label>
      </div>

      {/* Spam trap: hidden from people and screen readers; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset>
        <legend className={label}>What do you need?</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {needs.map((n) => (
            <label
              key={n}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-4 py-2 has-[:checked]:border-electric has-[:checked]:bg-electric/15 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-electric"
            >
              <input type="checkbox" name="needs" value={n} className="size-4 accent-[var(--electric)]" />
              {n}
            </label>
          ))}
        </div>
      </fieldset>

      <label className={label}>
        Message
        <textarea className={`${field} min-h-32`} name="message" maxLength={3000} />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60 sm:w-fit">
          {sending ? "Sending…" : "Book my free call"}
        </button>
        <p role="alert" className="text-sm text-cantaloupe">
          {status === "error" ? error : ""}
        </p>
      </div>
    </form>
  );
}
