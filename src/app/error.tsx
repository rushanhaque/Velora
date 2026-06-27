"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Atoms";
import { Mark } from "@/components/brand/Logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to your monitoring of choice in production.
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[80vh] place-items-center px-6 text-center">
      <div className="max-w-md">
        <span className="mx-auto inline-block animate-floaty">
          <Mark className="h-12 w-12" />
        </span>
        <Eyebrow className="mt-8 justify-center">Something slipped</Eyebrow>
        <h1 className="display mt-6 text-[clamp(2rem,5vw,3.4rem)] text-bitumen">
          A flaw in the finish.
        </h1>
        <p className="mt-5 leading-relaxed text-stone">
          An unexpected error interrupted this page. Try again, or head back to the
          collections while we set it right.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-5">
          <Button onClick={reset} variant="solid" arrow magnetic>
            Try again
          </Button>
          <Button href="/" variant="link" arrow>
            Return home
          </Button>
        </div>
      </div>
    </div>
  );
}
