"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ── Field wrapper ──────────────────────────────────────────────────────── */
export function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[0.6rem] uppercase tracking-wider2 text-ash">
          {label}
          {required && <span className="text-brass-deep"> *</span>}
        </span>
        {hint && <span className="text-[0.58rem] text-ash/70">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const inputBase =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-bitumen placeholder:text-ash/55 outline-none transition-colors duration-300 focus:border-brass focus:ring-2 focus:ring-brass/15";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputBase, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputBase, "resize-none leading-relaxed", props.className)} />;
}

export function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputBase, "cursor-pointer appearance-none pr-9", className)}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ash"
      >
        ▾
      </span>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-bitumen transition-colors hover:border-brass/40"
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300",
          checked ? "bg-brass" : "bg-line",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300",
            checked ? "left-[1.15rem]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

/* ── Chips (tags / subcategories) ───────────────────────────────────────── */
export function Chips({
  values,
  onChange,
  placeholder = "Type and press Enter…",
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  };
  return (
    <div className="rounded-lg border border-line bg-white p-2">
      {values.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1.5 rounded-full border border-brass/25 bg-brass/[0.06] py-1 pl-3 pr-1.5 text-[0.72rem] text-bitumen"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                aria-label={`Remove ${v}`}
                className="grid h-4 w-4 place-items-center rounded-full text-ash transition-colors hover:bg-brass/15 hover:text-brass-deep"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            } else if (e.key === "Backspace" && !draft && values.length) {
              onChange(values.slice(0, -1));
            }
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-2 py-1 text-sm text-bitumen placeholder:text-ash/55 outline-none"
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 rounded-full border border-line px-3 py-1 text-[0.68rem] uppercase tracking-wider2 text-stone transition-colors hover:border-brass/50 hover:text-brass-deep"
        >
          Add
        </button>
      </div>
    </div>
  );
}

/* ── Image picker (drag & drop + click) ─────────────────────────────────── */
export function ImagePicker({
  url,
  onFile,
  onClear,
  aspect = "aspect-[4/5]",
}: {
  url: string;
  onFile: (file: File) => void;
  onClear?: () => void;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f && f.type.startsWith("image/")) onFile(f);
      }}
      className={cn(
        "relative w-full overflow-hidden rounded-xl border-2 border-dashed transition-colors",
        aspect,
        over ? "border-brass bg-brass/[0.06]" : "border-line bg-parchment-pale",
      )}
    >
      {url ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-bitumen/70 to-transparent p-2.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full bg-white/90 px-3 py-1 text-[0.62rem] uppercase tracking-wider2 text-bitumen transition-colors hover:bg-white"
            >
              Replace
            </button>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="rounded-full bg-bitumen/60 px-3 py-1 text-[0.62rem] uppercase tracking-wider2 text-parchment-pale transition-colors hover:bg-bitumen/80"
              >
                Remove
              </button>
            )}
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 grid place-items-center p-4 text-center"
        >
          <span>
            <span className="mx-auto mb-2 grid h-11 w-11 place-items-center rounded-full border border-brass/30 text-brass-deep">
              ↑
            </span>
            <span className="block text-[0.72rem] uppercase tracking-wider2 text-stone">
              Drop image or tap to upload
            </span>
            <span className="mt-1 block text-[0.6rem] text-ash/70">JPG · PNG · WebP</span>
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
