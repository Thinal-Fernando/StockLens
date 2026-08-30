"use client";

import { CountrySelectField } from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import DemoButton from "@/components/forms/DemoButton";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const SignUp = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      country: "SL",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const result = await signUpWithEmail(data);
      if (result.success) {
        router.push("/");
        return;
      }
      // "Email already exists" belongs under the email input; anything else
      // sits above the submit.
      if (result.field === "email") {
        setError("email", { message: result.error });
      } else {
        setError("root", { message: result.error });
      }
    } catch (e) {
      console.error(e);
      setError("root", { message: "Something went wrong. Please try again." });
    }
  };

  return (
    <>
      <h1 className="chart-title mb-3 text-[clamp(2.25rem,5vw,3.25rem)]">
        Create your account
      </h1>
      <p className="mb-10 max-w-[48ch] font-text text-[1.0625rem] leading-relaxed text-ink-2">
        The four answers below are not a survey. They set what your emailed
        digest covers and which industries surface first, and you can follow
        any company regardless of what you pick here.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <InputField
          name="fullName"
          label="Full name"
          placeholder="Jordan Ellis"
          register={register}
          error={errors.fullName}
          validation={{ required: "Enter your name", minLength: 2 }}
        />

        <InputField
          name="email"
          label="Email"
          placeholder="you@example.com"
          register={register}
          error={errors.email}
          validation={{ required: "Enter an email address" }}
        />

        <InputField
          name="password"
          label="Password"
          placeholder="At least 8 characters"
          type="password"
          register={register}
          error={errors.password}
          validation={{
            required: "Choose a password",
            minLength: {
              value: 8,
              message: "Use at least 8 characters",
            },
          }}
        />

        {/* The intake. Ruled off, because this is where the product starts
            working for you rather than the other way round. */}
        <fieldset className="space-y-7 border-t border-rule-strong pt-7">
          <legend className="apparatus mb-1 text-ink">
            What your digest should cover
          </legend>

          <CountrySelectField
            name="country"
            label="Country"
            control={control}
            error={errors.country}
            required
          />

          <SelectField
            name="investmentGoals"
            label="What you are investing for"
            placeholder="Select a goal"
            options={INVESTMENT_GOALS}
            control={control}
            error={errors.investmentGoals}
            required
          />

          <SelectField
            name="riskTolerance"
            label="How much movement you are comfortable with"
            placeholder="Select a level"
            options={RISK_TOLERANCE_OPTIONS}
            control={control}
            error={errors.riskTolerance}
            required
          />

          <SelectField
            name="preferredIndustry"
            label="Industry you follow most"
            placeholder="Select an industry"
            options={PREFERRED_INDUSTRIES}
            control={control}
            error={errors.preferredIndustry}
            required
          />
        </fieldset>

        {errors.root?.message ? (
          <p
            role="alert"
            className="overprint px-3 py-2.5 font-text text-[0.875rem] italic leading-snug"
          >
            {errors.root.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="detent detent-filled w-full"
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>

        <FooterLink
          text="Already have an account?"
          linkText="Sign in"
          href="/sign-in"
        />
      </form>

      <DemoButton />
    </>
  );
};

export default SignUp;
