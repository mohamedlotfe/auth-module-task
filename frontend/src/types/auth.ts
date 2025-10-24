export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}

export interface SignUpData {
  email: string
  password: string
  confirmPassword: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken?: string
  message?: string
}

export interface ApiError {
  message: string
  field?: string
  code?: string
}
