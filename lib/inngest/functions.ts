// this file contains the actual inngest background functions that gets triggered when a new user is created

import { model } from "mongoose";
import { inngest } from "./client";    
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";
import { success } from "better-auth";
import { sendWelcomeEmail } from "../nodemailer";

export const sendSignUpEmail = inngest.createFunction(                              // Creating a Inngest (background) function called sendSignUpEmail
  { id: "sign-up-email", triggers: [{ event: "app/user.created" }] },               // This object tells inngest how the function should behave (id-function identifier | triggers- this function runs when an app/user.created event occurs.)
  async ({ event, step }) => {                                                      // This is the actual code that runs when the event occurs (event-contains the information (an object) that was sent when app/user.created was triggered (in the singUpWithEmail function in auth.actions.ts)| step-Inngest object that lets you create individual steps inside your function, Instead of one huge untracked operation, your function is broken into manageable steps.)
    const userProfile = `                                                           
           - Country: ${event.data.country}
           - Investment goals: ${event.data.investmentGoals}
           - Risk tolerance: ${event.data.riskTolerance}
           - Preferred industry: ${event.data.preferredIndustry} 
        `;                                                                          // Creates a string with the users information taken from the event info

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(                       // taking the predefined prompt and personalizing it with the user's info
      "{{userProfile}}",
      userProfile,
    );

    const response = await step.ai.infer("generate-welcome-intro", {                // step.ai.infer() is Inngest's AI step (giving it the id - generate-welcome-intro) - tells ingest to generate the prompt and save it in a variable called response
      model: step.ai.models.anthropic({ model: "claude-haiku-4-5", defaultParameters: { max_tokens: 300 } }),               // Specify the model
      body: {
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
    });

    await step.run("send-welcome-email", async () => {                              // This creates another inngest step (with id send-welcome-email)  - this step is to actually send the email
      const block = response.content?.find((b) => b.type === "text");               // Claude's response has a content array of typed blocks; find the text block
      const introText =                                                             // fall back to the default message if Claude didn't return usable text
        block?.text ||
        "Thanks for Joining StockLens. You now have the tools to track markets and make smarter moves.";   // The fall back message if Claude fails to provide usable text

      const { data } = event;                                                       // get the object of data that was sent through the event
      return await sendWelcomeEmail({                                               // calls sendWelcomeEmail to actually send the Email, with the user data
        email: data.email,
        name: data.name,
        intro: introText,
      });
    });

    return {
      success: true,
      message: "welcome email send successfully",
    };
  },
);
