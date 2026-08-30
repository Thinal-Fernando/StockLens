"use client";

import { useFormStatus } from "react-dom";
import { startDemoSession } from "@/lib/actions/auth.actions";

const DemoSubmit = () => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="detent w-full">
      {pending ? "Preparing your session…" : "Look around without an account"}
    </button>
  );
};

const DemoButton = () => {
  return (
    <div className="mt-8">
      <div
        aria-hidden="true"
        className="mb-6 flex items-center gap-3 text-ink-3"
      >
        <span className="h-px flex-1 bg-rule" />
        <span className="apparatus">or</span>
        <span className="h-px flex-1 bg-rule" />
      </div>

      <form action={startDemoSession}>
        <DemoSubmit />
      </form>

      <p className="mt-3 text-center font-text text-[0.8125rem] italic leading-snug text-ink-2">
        A sandboxed guest account, cleared automatically.
      </p>
    </div>
  );
};

export default DemoButton;
