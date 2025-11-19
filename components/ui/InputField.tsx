import React from "react";

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
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {large ? (
        <textarea
          id={inputId}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={4}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      )}
    </div>
  );
};

export default InputField;
