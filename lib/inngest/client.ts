import { Inngest } from "inngest";

export const inngest = new Inngest({                          // create and export a new instance of the Ingest Class
  id: "StockLens",
  ai: { gemini: { apikey: process.env.GEMINI_API_KEY } },     // configuration for Inngest's AI capabilities
});
