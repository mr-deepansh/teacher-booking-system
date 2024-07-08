import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(6)
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().nonempty()
});

export const bookAppointmentSchema = z.object({
    teacherId: z.string().nonempty(),
    date: z.string().nonempty(),
    time: z.string().nonempty(),
    purpose: z.string().nonempty()
});
