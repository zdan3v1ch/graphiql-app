import z from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const graphqlSchema = z.object({
  endpoint: z.string().min(1, 'Endpoint is required'),
});

export type SignInData = z.infer<typeof signInSchema>;
