import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">
        Welcome to your app
      </h1>
      <p className="max-w-md text-muted-foreground">
        Edit{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
          app/page.tsx
        </code>{" "}
        to get started.
      </p>
      <div className="flex gap-3">
        <Button>Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </div>
  );
}
