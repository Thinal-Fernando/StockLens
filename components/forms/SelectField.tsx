import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

// A detented choice. The trigger is ruled like every other blank on the form,
// and the open list is a plate, not a floating rounded panel
const SelectField = ({
  name,
  label,
  placeholder,
  options,
  control,
  error,
  required = false,
}: SelectFieldProps) => {
  return (
    <div>
      <label htmlFor={name} className="apparatus mb-1.5 block text-ink">
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              id={name}
              aria-invalid={error ? "true" : undefined}
              className="h-auto w-full border-0 border-b border-rule-strong bg-transparent px-0.5 py-2.5 font-sans text-[0.9375rem] text-ink transition-colors focus:border-caution focus:ring-0 data-placeholder:text-ink-3"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent className="border border-rule-strong bg-paper-raised p-0">
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer border-b border-rule px-3 py-2.5 font-sans text-[0.9375rem] text-ink last:border-b-0 focus:bg-shoal-1 focus:text-ink"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />

      {error ? (
        <p className="mt-1.5 font-text text-[0.8125rem] italic leading-snug text-caution">
          {error.message}
        </p>
      ) : null}
    </div>
  );
};

export default SelectField;
