import { inngest } from "@/lib/inngest/client";                // inngest(from client.ts) - application's connection/configuration for talking to Inngest.
import { sendSignUpEmail, cleanupDemoUsers } from "@/lib/inngest/functions";
import { serve } from "inngest/next";                          //serve() essentially creates the HTTP handlers that Inngest needs to communicate with the application.



// Create the Inngest HTTP endpoint using this configuration.
// We give `serve()` the Inngest client and the functions we want it to handle.
// `{ GET, POST, PUT }` are HTTP request handlers that `serve()` returns. Each one handles a different type of HTTP request:
// We export these handlers so Next.js knows how to handle GET, POST, and PUT requests sent to this `/api/inngest` route.
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendSignUpEmail, cleanupDemoUsers],
});
