import z from 'zod';

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email')
      .max(100)
      .trim(),
    username: z.string().min(1, 'Username is required').max(100).trim(),
    password: z
      .string()
      .min(8, { message: 'Password should be at least 8 characters' })
      .max(20, { message: 'Password should be maximum 20 characters' })
      .refine((password) => /[A-Z]/.test(password), {
        message: 'Password should contain at least 1 uppercase character',
      })
      .refine((password) => /[a-z]/.test(password), {
        message: 'Password should contain at least 1 lowercase character',
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'Password should contain at least 1 number',
      })
      .refine((password) => /[!@#$%^&*]/.test(password), {
        message: 'Password should contain at least 1 special character',
      }),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterData = z.infer<typeof registerSchema>;
