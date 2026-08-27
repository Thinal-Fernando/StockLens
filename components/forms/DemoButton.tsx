"use client";

import { useFormStatus } from "react-dom";
import { startDemoSession } from "@/lib/actions/auth.actions";

const DemoSubmit = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 w-full cursor-pointer rounded-lg border border-yellow-500/50 text-yellow-500 font-medium text-base transition-colors hover:bg-yellow-500/10 disabled:opacity-50"
    >
      {pending ? "Preparing your demo…" : "Explore the demo"}
    </button>
  );
};

const DemoButton = () => {
  return (
    <div className="mt-5 space-y-4">
      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-gray-500">
        <span className="h-px flex-1 bg-gray-700" />
        or
        <span className="h-px flex-1 bg-gray-700" />
      </div>

      <form action={startDemoSession}>
        <DemoSubmit />
      </form>

      <p className="text-center text-xs text-gray-500">
        Sandboxed guest account, cleared automatically.
      </p>
    </div>
  );
};

export default DemoButton;
