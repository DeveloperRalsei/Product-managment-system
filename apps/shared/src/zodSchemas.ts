import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from "#";
import { z } from "zod";

export const zodLoginSchema = z.object({
    email: z.string().email("Lütfen geçerli bir email girin"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

export const currencyEnum = z.enum(["USD", "TRY", "EUR"]);

export const productSchema = z.object({
    name: z.string().nonempty("Ürün ismi zorunludur"),
    description: z
        .string()
        .max(400, "Açıklama en fazla 400 karakter olabilir")
        .optional(),
    price: z.number().nonnegative("Zarar etmek istiyorsun herhalde :)"),
    currency: currencyEnum.default("TRY"),
    inStock: z.boolean().default(true),
    isActive: z.boolean().default(true),
    quantity: z
        .number()
        .int("Geçersiz değer")
        .nonnegative("En az 0 olmalı")
        .default(0),
    images: z.array(
        z.instanceof(File).refine((file) => {
            if (file.size > MAX_UPLOAD_SIZE)
                return "Dosya fazla büyük (max 50MB)";
            if (!ACCEPTED_FILE_TYPES.includes(file.type))
                return "Geçersiz Dosya türü";
            return file;
        }),
    ),
    tags: z.array(z.string()).default([]),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    innerCategoryId: z.string(),
});
