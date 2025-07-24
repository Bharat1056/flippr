import { z } from 'zod'

// Base user schema
export const userSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email('Invalid email address').toLowerCase(),
  age: z
    .number()
    .min(18, 'Must be at least 18 years old')
    .max(120, 'Age must be realistic'),
})

// Create user schema (for forms)
export const createUserSchema = userSchema

// Update user schema (all fields optional)
export const updateUserSchema = userSchema.partial()

// User filters schema
export const userFiltersSchema = z.object({
  search: z.string().optional(),
  minAge: z.number().min(0).optional(),
  maxAge: z.number().max(120).optional(),
  sortBy: z.enum(['name', 'email', 'age', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})

// Type exports
export type UserFormData = z.infer<typeof userSchema>
export type CreateUserData = z.infer<typeof createUserSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>
export type UserFiltersData = z.infer<typeof userFiltersSchema>

// Validation helpers
export const validateUser = (data: unknown) => userSchema.safeParse(data)
export const validateCreateUser = (data: unknown) =>
  createUserSchema.safeParse(data)
export const validateUpdateUser = (data: unknown) =>
  updateUserSchema.safeParse(data)
export const validateUserFilters = (data: unknown) =>
  userFiltersSchema.safeParse(data)
