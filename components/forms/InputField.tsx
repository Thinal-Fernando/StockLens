import { cn } from "@/lib/utils";

// A printed blank on a form: ruled underneath only, its label above it and
// its error stated in the accent ink
const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  validation,
  disabled,
  value,
}: FormInputProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="apparatus mb-1.5 block text-ink"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          "field",
          disabled && "cursor-not-allowed opacity-50",
        )}
        {...register(name, validation)}
      />

      {error ? (
        <p
          id={`${name}-error`}
          className="mt-1.5 font-text text-[0.8125rem] italic leading-snug text-caution"
        >
          {error.message}
        </p>
      ) : null}
    </div>
  );
};

export default InputField;
