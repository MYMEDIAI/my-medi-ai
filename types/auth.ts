export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "patient" | "doctor" | "admin"
  status: "active" | "inactive" | "suspended" | "pending_verification"
  emailVerified: boolean
  lastLogin?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  role: "patient" | "doctor"
  dateOfBirth?: string
  phone?: string
  licenseNumber?: string // For doctors
  specialization?: string // For doctors
}

export interface ResetPasswordData {
  email: string
}

export interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UpdateProfileData {
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  notificationPreferences: {
    email: boolean
    sms: boolean
    push: boolean
  }
}
