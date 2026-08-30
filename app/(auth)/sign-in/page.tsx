"use client";

import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import DemoButton from "@/components/forms/DemoButton";
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const SignIn = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signInWithEmail(data);
      if (result.success) {
        router.push("/");
        return;
      }
      setError("root", { message: result.error });
    } catch (e) {
      console.error(e);
      setError("root", { message: "Something went wrong. Please try again." });
    }
  };

  return (
    <>
      <h1 className="chart-title mb-3 text-[clamp(2.25rem,5vw,3.25rem)]">
        Sign in to StockLens
      </h1>
      <p className="mb-10 max-w-[46ch] font-text text-[1.0625rem] leading-relaxed text-ink-2">
        See how far the companies you follow have moved today, and why.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <InputField
          name="email"
          label="Email"
          placeholder="you@example.com"
          register={register}
          error={errors.email}
          validation={{ required: "Enter the email you signed up with" }}
        />

        <InputField
          name="password"
          label="Password"
          placeholder="Your password"
          type="password"
          register={register}
          error={errors.password}
          validation={{ required: "Enter your password", minLength: 8 }}
        />

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
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>

        <FooterLink
          text="No account yet?"
          linkText="Create one"
          href="/sign-up"
        />
      </form>

      <DemoButton />
    </>
  );
};

export default SignIn;
