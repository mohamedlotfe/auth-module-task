import React from 'react'

interface FormProps {
  label: string
  type: 'text' | 'email' | 'password'
  placeholder?: string
  error?: string
  register: any
  name: string
  required?: boolean
}

export const FormInput: React.FC<FormProps> = (props) => {
  const { label, type, placeholder, error, register, name, required = false } = props
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...register(name)}
        type={type}
        id={name}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
