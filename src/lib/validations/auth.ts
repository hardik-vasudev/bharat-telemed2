import { z } from 'zod'

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
})

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters long')
    .regex(/^[a-zA-Z\s.]+$/, 'Full name can only contain letters, spaces, and periods'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  medicalLicenseNumber: z
    .string()
    .min(1, 'Medical license number is required')
    .min(3, 'Medical license number must be at least 3 characters long'),
  specialization: z
    .array(z.string())
    .min(1, 'Please select at least one specialization'),
  qualification: z
    .array(z.string())
    .min(1, 'Please select at least one qualification'),
  termsAccepted: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const quickSignUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters long')
    .regex(/^[a-zA-Z\s.]+$/, 'Full name can only contain letters, spaces, and periods'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  medicalLicenseNumber: z
    .string()
    .min(1, 'Medical license number is required')
    .min(3, 'Medical license number must be at least 3 characters long'),
  termsAccepted: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type QuickSignUpInput = z.infer<typeof quickSignUpSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>