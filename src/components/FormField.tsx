import React from 'react';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'tel' | 'date' | 'time' | 'number' | 'email';
  placeholder?: string;
  required?: boolean;
  className?: string;
  focusColor?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  className = '',
  focusColor = 'blue',
}) => {
  const focusClasses = `focus:ring-${focusColor}-500 focus:border-${focusColor}-500`;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 ${focusClasses} outline-none transition`}
      />
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  className?: string;
  focusColor?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  className = '',
  focusColor = 'blue',
}) => {
  const focusClasses = `focus:ring-${focusColor}-500 focus:border-${focusColor}-500`;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 ${focusClasses} outline-none transition`}
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  focusColor?: string;
  minHeight?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  focusColor = 'blue',
  minHeight = '80px',
}) => {
  const focusClasses = `focus:ring-${focusColor}-500 focus:border-${focusColor}-500`;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        style={{ minHeight }}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 ${focusClasses} outline-none transition resize-y`}
      />
    </div>
  );
};
