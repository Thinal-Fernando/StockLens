import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";   // cn is usually a utility function for combining CSS/Tailwind classes conditionally.

const InputField = ({   // this creates a reusable component called InputField
  // Bellow are the props it receives from where the component is called
 // these are the individual values for the InputField
  name,           // ex/- email 
  label,          // Email
  placeholder,    // Enter your Email
  type = "text",  // text is default type 
  register,       
  error,
  validation,
  disabled,
  value,
}: FormInputProps) => {    // FormInputProps means the props must follow the Typescript Interface created in global.d.ts  (validation)
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Input
      // Passing props to the actual inputs
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={cn("form-input", {                       //cause of cn this means always apply 'from-input'
          "opacity-50 cursor-not-allowed": disabled,         //  but only apply 'opacity-50 cursor-not-allowed' if disabled is true.
        })}
        {...register(name, validation)} // this is from React Hook Form(RHF) | ... -> spread operator | register() gives RHF the info to track this input
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}   {/*If error exist show error.message else nothing*/}
    </div>
  );
};

export default InputField;
