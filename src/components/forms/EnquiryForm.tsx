"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { SILK } from "@/lib/motion";

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
  className,
  onSubmitted,
}: {
  fields: FieldDef[];
  choices?: ChoiceDef[];
  submitLabel?: string;
  success?: string;
  dark?: boolean;
  className?: string;
  onSubmitted?: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
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
              "flex min-h-[16rem] flex-col items-start justify-center rounded-card border p-8 outline-none",
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
            <button
              onClick={() => setSubmitted(false)}
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
              setSubmitted(true);
              onSubmitted?.();
            }}
            className="grid gap-x-8 gap-y-6 sm:grid-cols-2"
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
                              ? "border-brass bg-brass/15 text-parchment-pale shadow-[0_0_16px_rgba(176,145,92,0.12)]"
                              : "border-brass bg-brass/10 text-bitumen shadow-[0_0_16px_rgba(176,145,92,0.08)]"
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
                    rows={3}
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
              <Button type="submit" variant={dark ? "brass" : "solid"} arrow magnetic>
                {submitLabel}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
