import { Mark } from "@/components/brand/Logo";

export default function Loading() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <div className="flex flex-col items-center gap-5">
        <span className="animate-floaty">
          <Mark className="h-10 w-10" />
        </span>
        <span className="eyebrow text-ash">Raising the page…</span>
      </div>
    </div>
  );
}
