"use server"; // to run on the server, not in the browser cause it handles sensitive info

import { success } from "better-auth";
import { error } from "console";
import { auth } from "@/lib/auth/auth";
import { inngest } from "../inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async (data: SignUpFormData) => {
  try {
    const response = await auth.api.signUpEmail({
      // calling Better Auth's signup API. and telling it to create a new user using email/password authentication
      body: { email: data.email, password: data.password, name: data.fullName },
    });

    if (response) {
      await inngest.send({
        // create the inngest event
        name: "app/user.created",
        data: {
          email: data.email,
          name: data.fullName,
          country: data.country,
          investmentGoals: data.investmentGoals,
          riskTolerance: data.riskTolerance,
          preferredIndustry: data.preferredIndustry,
        },
      });
    }
    return { success: true, data: response };
  } catch (e) {
    console.log("sign up failed", e);
    return { success: false, error: "Sign up failed" };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (e) {
    console.log("sign out failed", e);
    return { success: false, error: "Sign out failed" };
  }
};
