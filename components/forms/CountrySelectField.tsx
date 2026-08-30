"use client";

import { useState } from "react";
import {
  Control,
  Controller,
  FieldError,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import countryList from "react-select-country-list";

type CountrySelectProps<T extends FieldValues = FieldValues> = {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  error?: FieldError;
  required?: boolean;
};

function CodePlate({ code }: { code: string }) {
  return (
    <span
      data-figure=""
      aria-hidden="true"
      className="flex size-6 shrink-0 items-center justify-center border border-rule-strong text-[0.6875rem] leading-none text-water"
    >
      {code}
    </span>
  );
}

const CountrySelect = ({
  value,
  onChange,
  invalid,
  listId,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  listId: string;
}) => {
  const [open, setOpen] = useState(false);
  const countries = countryList().getData();
  const selected = countries.find((c) => c.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-invalid={invalid ? "true" : undefined}
            className={cn(
              "flex w-full items-center justify-between gap-3 border-0 border-b bg-transparent px-0.5 py-2 text-left transition-colors focus:outline-none focus-visible:border-caution",
              invalid ? "border-caution" : "border-rule-strong",
            )}
          />
        }
      >
        {selected ? (
          <span className="flex min-w-0 items-center gap-2.5">
            <CodePlate code={selected.value} />
            <span className="truncate font-sans text-[0.9375rem] text-ink">
              {selected.label}
            </span>
          </span>
        ) : (
          <span className="font-sans text-[0.9375rem] text-ink-3">
            Select your country
          </span>
        )}
        <Caret />
      </PopoverTrigger>

      <PopoverContent
        id={listId}
        align="start"
        className="w-(--anchor-width) min-w-64 border border-rule-strong bg-paper-raised p-0"
      >
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search countries…"
            className="h-12 border-0 border-b border-rule bg-transparent px-3 font-sans text-[0.9375rem] text-ink placeholder:text-ink-3 focus:ring-0"
          />
          <CommandEmpty className="px-3 py-8 text-center font-text text-[0.875rem] italic text-ink-2">
            No country under that name.
          </CommandEmpty>
          <CommandList className="max-h-64 scrollbar-hide">
            <CommandGroup className="p-0">
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={`${country.label} ${country.value}`}
                  onSelect={() => {
                    onChange(country.value);
                    setOpen(false);
                  }}
                  className="flex cursor-pointer items-center gap-2.5 border-b border-rule px-3 py-2.5 last:border-b-0 data-[selected=true]:bg-shoal-1"
                >
                  <CodePlate code={country.value} />
                  <span className="min-w-0 flex-1 truncate font-sans text-[0.9375rem] text-ink">
                    {country.label}
                  </span>
                  {value === country.value ? <SetMark /> : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

function Caret() {
  return (
    <svg
      viewBox="0 0 12 12"
      width="11"
      height="11"
      aria-hidden="true"
      className="shrink-0 text-ink-3"
    >
      <path
        d="M2.5 4.5 L6 8 L9.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SetMark() {
  return (
    <svg
      viewBox="0 0 12 12"
      width="12"
      height="12"
      aria-hidden="true"
      className="shrink-0 text-caution"
    >
      <path
        d="M1.5 6.5 L4.5 9.5 L10.5 2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const CountrySelectField = <T extends FieldValues>({
  name,
  label,
  control,
  error,
  required = false,
}: CountrySelectProps<T>) => {
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
          <CountrySelect
            value={field.value}
            onChange={field.onChange}
            invalid={Boolean(error)}
            listId={`${name}-country-list`}
          />
        )}
      />

      {error ? (
        <p className="mt-1.5 font-text text-[0.8125rem] italic leading-snug text-caution">
          {error.message}
        </p>
      ) : null}

      <p className="mt-1.5 font-text text-[0.8125rem] italic leading-snug text-ink-2">
        Sets which market data and news you are sent.
      </p>
    </div>
  );
};
