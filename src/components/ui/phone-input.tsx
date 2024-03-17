import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input, InputProps } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange: (value: RPNInput.Value) => void;
    value: RPNInput.Value;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, ...props }, ref) => (
      <RPNInput.default
        ref={ref}
        className={cn(
          "flex rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-slate-200 focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        /**
         * Handles the onChange event.
         *
         * react-phone-number-input might trigger the onChange event as undefined
         * when a valid phone number is not entered. To prevent this,
         * the value is coerced to an empty string.
         *
         * @param {E164Number | undefined} value - The entered value
         */
        onChange={(value) => onChange(value || "")}
        {...props}
      />
    )
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      className={cn(
        "focus-visible:ring-none rounded-e-lg rounded-s-none focus-visible:ring-transparent",
        className
      )}
      {...props}
      ref={ref}
    />
  )
);
InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange]
  );

  const [search, setSearch] = React.useState("");

  return (
    <Popover onOpenChange={(open) => !open && setSearch("")}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn(
            "flex gap-1 rounded-e-none rounded-s-lg border-r-0 pl-3 pr-1"
          )}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn(
              "h-4 w-4 text-slate-500 opacity-50",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-[300px] flex-col p-0">
        <div className="p-2 shadow-md shadow-slate-900/5">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none focus-visible:ring-transparent"
            placeholder="Search by country name..."
          />
        </div>
        <div className="scrollbar-none flex max-h-52 flex-col overflow-y-auto pt-2">
          {options
            .filter((x) => x.label.toLowerCase().includes(search.toLowerCase()))
            .map((option, index) => (
              <button
                type="button"
                className={cn(
                  "flex w-full items-center justify-start gap-3 rounded-md border-none px-3 py-2 text-left outline-none",
                  option.value === value ? "bg-sky-50" : "bg-none"
                )}
                key={option.value + index}
                onClick={() => handleSelect(option.value)}
              >
                <FlagComponent
                  country={option.value}
                  countryName={option.label}
                />
                <span className="text-sm">{option.label}</span>
                {option.value && (
                  <p className="ml-auto text-sm text-foreground/50">
                    {`+${RPNInput.getCountryCallingCode(option.value)}`}
                  </p>
                )}
                <CheckIcon
                  className={cn(
                    "h-4 w-4",
                    option.value === value ? "opacity-100" : "opacity-0"
                  )}
                />
              </button>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
