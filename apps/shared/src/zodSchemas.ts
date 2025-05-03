import { z } from "zod";

export const zodLoginSchema = z.object({
    email: z.string().email("Lütfen geçerli bir email girin"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

export const currencyEnum = z.enum(["USD", "TRY", "EUR"]);

export const productSchema = z.object({
    name: z.string(),
    description: z
        .string()
        .max(400, "Açıklama en fazla 400 karakter olabilir")
        .optional(),
    price: z.number(),
    currency: currencyEnum.default("TRY"),
    inStock: z.boolean().default(true),
    isActive: z.boolean().default(true),
    quantity: z.number().int().default(0),
    images: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    innerCategoryId: z.string(),
});
