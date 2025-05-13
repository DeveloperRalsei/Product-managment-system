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
        .max(5000, "Açıklama en fazla 5000 karakter olabilir")
        .optional(),
    price: z.coerce.number().nonnegative("Zarar etmek istiyorsun herhalde :)"),
    currency: currencyEnum.default("TRY"),
    inStock: z.coerce.boolean().default(true),
    isActive: z.coerce.boolean().default(true),
    categoryIDs: z.array(z.string()),
    quantity: z.coerce
        .number()
        .int("Geçersiz değer")
        .nonnegative("En az 0 olmalı")
        .default(0),
    images: z
        .union([z.instanceof(File), z.array(z.instanceof(File))])
        .transform((val) => (Array.isArray(val) ? val : [val]))
        .optional()
        .superRefine((files, ctx) => {
            if (!files) return;
            files.forEach((file, index) => {
                if (file.size > MAX_UPLOAD_SIZE) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Dosya fazla büyük (max 50MB)",
                        path: [index],
                    });
                }
                if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Geçersiz dosya türü",
                        path: [index],
                    });
                }
            });
        }),
    tags: z
        .union([z.array(z.string()), z.string()])
        .transform((val) => (Array.isArray(val) ? val : [val]))
        .default([]),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

export const categorySchema = z.object({
    name: z.string().nonempty("Kategori ismi zorunludur"),
    bannerUrl: z.string().optional(),
    logoUrl: z.string().optional(),
    productIDs: z.array(z.string()),
    parentCategoryId: z.string().optional(),
});
