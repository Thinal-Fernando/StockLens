"use server"; // to run on the server, not in the browser cause it handles sensitive info

import { success } from "better-auth";
import { error } from "console";
import { auth } from "@/lib/auth/auth";
import { inngest } from "../inngest/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

export const signInWithEmail = async (data: SignInFormData) => {
  try {
    const response = await auth.api.signInEmail({
      body: { email: data.email, password: data.password },
    });

    return { success: true, data: response };
  } catch (e) {
    console.log("sign in failed", e);
    return { success: false, error: "Sign in failed" };
  }
};

// Starts a throwaway, sandboxed demo session (Better Auth anonymous plugin) and
// drops the visitor straight into the dashboard. No sign-up, no shared password.
export const startDemoSession = async () => {
  let destination = "/";
  try {
    await auth.api.signInAnonymous({ headers: await headers() });
  } catch (e) {
    console.error("demo session failed", e);
    destination = "/sign-in?demo=unavailable";
  }
  // `redirect` throws, so it must run outside the try/catch.
  redirect(destination);
};

// Guard for write actions that a demo user shouldn't be able to run
// (sending email, mutating shared data, etc.). Returns the session otherwise.
export const requireRealUser = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const isDemo = (session?.user as { isAnonymous?: boolean } | undefined)
    ?.isAnonymous;
  if (isDemo) {
    throw new Error(
      "This action isn't available in demo mode. Create a free account to continue.",
    );
  }
  return session;
};
