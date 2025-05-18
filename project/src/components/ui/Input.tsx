import React, { InputHTMLAttributes, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  icon,
  disabled,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  
  const width = fullWidth ? 'w-full' : '';
  const iconPadding = icon ? 'pl-10' : '';
  
  const inputClasses = `px-3 py-2 bg-white border ${
    error ? 'border-red-500' : focused ? 'border-blue-500' : 'border-gray-300'
  } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${width} ${iconPadding} ${className} ${
    disabled ? 'bg-gray-100' : ''
  }`;

  return (
    <div className={`mb-4 ${width}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input 
          className={inputClasses} 
          disabled={disabled} 
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest} 
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;