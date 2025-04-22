import { z } from "zod";

export const zodLoginSchema = z.object({
    email: z.string().email("Lütfen geçerli bir email girin"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});
