import { email, z } from 'zod';

export const usernameValidation = z.string()
    .min(2, 'Username must be at least 2 char!!')
    .max(20, 'Username must be no more than 20 char!!')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain any special char!!');

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid Email !!'}),
    password: z.string().min(6, {message: 'password must be at least 6 char!'})
});