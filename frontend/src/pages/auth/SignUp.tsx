import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import { FormInput } from '../../components/FormInput'
import { Button } from '../../components/Button'
import type { SignUpData } from '../../types/auth'

const signUpSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    name: z.string().min(3, 'Name must be at least 3 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
        'Password must contain at least one letter, one number, and one special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const SignUp: React.FC = () => {
  const navigate = useNavigate()
  const { checkAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpData) => {
    setIsLoading(true)
    setServerError('')

    try {
      await authApi.signUp(data)
      await checkAuth() // Update auth context with user data
      navigate('/app')
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : 'An error occurred during sign up'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {serverError}
            </div>
          )}

          <FormInput
            label="Email address"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            register={register}
            name="email"
            required
          />

          <FormInput
            label="Name"
            type="text"
            placeholder="Enter your name"
            error={errors.name?.message}
            register={register}
            name="name"
            required
          />

          <FormInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            register={register}
            name="password"
            required
          />

          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            register={register}
            name="confirmPassword"
            required
          />

          <div>
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
