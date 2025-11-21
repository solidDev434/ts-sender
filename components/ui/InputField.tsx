import React from "react";
import { Input } from "./input";
import { Textarea } from "./textarea";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder: string;
  type?: string;
  large?: boolean;
}

const InputField = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  large = false,
}: InputFieldProps) => {
  const inputId = label
    ? label.toLowerCase().replace(/\s+/g, "-")
    : "input-field";

  return (
    <div className="w-full space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-gray-700"
        >
          {label}
        </label>
      )}

      {large ? (
        <Textarea
          id={inputId}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={4}
        />
      ) : (
        <Input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default InputField;
