import {z} from 'zod';


export const messageSchema = z.object({
    content: z
    .string()
    .min(5, {message:'Content must be at least of 10 char'})
    .max(300, {message:'Content must be no longer of 300 char'})
}); 