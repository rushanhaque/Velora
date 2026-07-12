"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { SILK } from "@/lib/motion";
import { BRAND } from "@/lib/data";

export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea";
  placeholder?: string;
  required?: boolean;
  half?: boolean;
}
export interface ChoiceDef {
  name: string;
  label: string;
  options: string[];
}

export function EnquiryForm({
  fields,
  choices = [],
  submitLabel = "Send enquiry",
  success = "Thank you — our trade desk will be in touch within two working days.",
  dark = false,
  compact = false,
  className,
  onSubmitted,
}: {
  fields: FieldDef[];
  choices?: ChoiceDef[];
  submitLabel?: string;
  success?: string;
  dark?: boolean;
  /** Tighter row gaps + shorter textarea, for fit-to-screen layouts. */
  compact?: boolean;
  className?: string;
  onSubmitted?: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [links, setLinks] = useState<{ wa: string; mail: string } | null>(null);
  const [picked, setPicked] = useState<Record<string, string>>(
    () => Object.fromEntries(choices.map((c) => [c.name, c.options[0]])),
  );
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="thanks"
            ref={successRef}
            role="status"
            aria-live="polite"
            tabIndex={-1}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: SILK }}
            className={cn(
              "flex flex-col items-start justify-center rounded-card border p-8 outline-none",
              compact ? "min-h-[12rem]" : "min-h-[16rem]",
              dark ? "border-brass-leaf/20 bg-white/[0.02]" : "border-line bg-parchment-pale",
            )}
          >
            <span
              aria-hidden="true"
              className="grid h-14 w-14 place-items-center rounded-full border-2 border-brass bg-brass/10 text-xl text-brass-deep shadow-glow-brass"
            >
              ✓
            </span>
            <p
              className={cn(
                "mt-5 max-w-md font-display text-2xl leading-snug",
                dark ? "text-parchment-pale" : "text-bitumen",
              )}
            >
              {success}
            </p>
            {links && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={links.wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[0.68rem] uppercase tracking-wide3 text-white transition-opacity hover:opacity-90"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.115 1.523 5.845L.057 23.273a.75.75 0 0 0 .937.938l5.488-1.461A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.882 0-3.64-.518-5.143-1.418l-.368-.22-3.806 1.013 1.018-3.727-.237-.383A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  Send on WhatsApp
                </a>
                <a
                  href={links.mail}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[0.68rem] uppercase tracking-wide3 transition-colors",
                    dark
                      ? "border-brass-leaf/30 text-parchment-pale hover:border-brass-leaf"
                      : "border-line text-bitumen hover:border-brass",
                  )}
                >
                  Email instead
                </a>
              </div>
            )}
            <button
              onClick={() => {
                setSubmitted(false);
                setLinks(null);
              }}
              className={cn(
                "mt-6 link-draw text-[0.72rem] uppercase tracking-wide3",
                dark ? "text-haze" : "text-stone",
              )}
            >
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              // Compose the enquiry from the form values and route it to the
              // trade desk. WhatsApp opens straight away (the owner's primary
              // channel); the success screen also offers email with the same
              // pre-filled message.
              const fd = new FormData(e.currentTarget);
              const parts: string[] = [];
              choices.forEach((c) => parts.push(`${c.label}: ${picked[c.name] ?? ""}`));
              fields.forEach((f) => {
                const v = String(fd.get(f.name) ?? "").trim();
                if (v) parts.push(`${f.label}: ${v}`);
              });
              const message = `New enquiry — ${BRAND.name}\n\n${parts.join("\n")}`;
              const wa = `https://wa.me/${BRAND.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
              const mail = `mailto:${BRAND.email}?subject=${encodeURIComponent(
                `Enquiry — ${BRAND.name}`,
              )}&body=${encodeURIComponent(message)}`;
              setLinks({ wa, mail });
              if (typeof window !== "undefined") {
                window.open(wa, "_blank", "noopener,noreferrer");
              }
              setSubmitted(true);
              onSubmitted?.();
            }}
            className={cn(
              "grid gap-x-8 sm:grid-cols-2",
              compact ? "gap-y-4" : "gap-y-6",
            )}
          >
            {choices.map((c) => (
              <div
                key={c.name}
                className="sm:col-span-2"
                role="radiogroup"
                aria-labelledby={`choice-${c.name}`}
              >
                <input type="hidden" name={c.name} value={picked[c.name] ?? ""} />
                <p
                  id={`choice-${c.name}`}
                  className={cn(
                    "mb-3 text-[0.6rem] uppercase tracking-wider2",
                    dark ? "text-haze" : "text-stone",
                  )}
                >
                  {c.label}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {c.options.map((o) => {
                    const active = picked[c.name] === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setPicked((p) => ({ ...p, [c.name]: o }))}
                        className={cn(
                          "rounded-full border px-4 py-2 text-[0.72rem] tracking-wide transition-all duration-500 ease-silk inline-flex items-center gap-1.5",
                          active
                            ? dark
                              ? "border-brass bg-brass/15 text-parchment-pale shadow-[0_0_16px_rgba(176,145,92,0.14)]"
                              : "border-brass bg-brass/10 text-bitumen shadow-[0_0_16px_rgba(176,145,92,0.10)]"
                            : dark
                              ? "border-brass-leaf/20 text-haze hover:border-brass-leaf/50"
                              : "border-line text-stone hover:border-brass/50",
                        )}
                      >
                        {active && <span className="text-[0.6rem] text-brass-deep">✓</span>}
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {fields.map((f) => (
              <div key={f.name} className={f.half ? "sm:col-span-1" : "sm:col-span-2"}>
                <label
                  htmlFor={f.name}
                  className={cn(
                    "mb-2 block text-[0.6rem] uppercase tracking-wider2",
                    dark ? "text-haze" : "text-stone",
                  )}
                >
                  {f.label}
                  {f.required && <span className="text-brass-deep"> *</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    id={f.name}
                    name={f.name}
                    required={f.required}
                    rows={compact ? 2 : 3}
                    placeholder={f.placeholder}
                    className={cn("field resize-none", dark && "field--dark")}
                  />
                ) : (
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type ?? "text"}
                    required={f.required}
                    placeholder={f.placeholder}
                    className={cn("field", dark && "field--dark")}
                  />
                )}
              </div>
            ))}

            <div className="sm:col-span-2">
              <Button type="submit" variant={dark ? "brass" : "solid"} arrow>
                {submitLabel}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
