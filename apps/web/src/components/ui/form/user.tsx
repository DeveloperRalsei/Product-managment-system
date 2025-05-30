import { MakeOptional, User } from "#";
import {
    Text,
    Stack,
    SimpleGrid,
    TextInput,
    PasswordInput,
    Select,
    Group,
    Button,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useState } from "react";
import { z } from "zod";

export type UserFormValues = MakeOptional<
    Omit<
        User,
        | "id"
        | "verified"
        | "deleted"
        | "emailVerificationExpires"
        | "emailVerificationCode"
    >,
    "name"
>;

const schema = z
    .object({
        name: z.string().optional(),
        email: z.string().email("Lütfen geçerli bir email adresi girin"),
        password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
        passwordAgain: z.string(),
        role: z.string().default("USER"),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.passwordAgain) {
            ctx.addIssue({
                path: ["passwordAgain"],
                code: z.ZodIssueCode.custom,
                message: "Şifreler eşleşmiyor",
            });
        }
    });

export const UserForm = ({
    isPending,
    initialValues: { name, email, password, role },
    onSubmit,
}: {
    onSubmit: (params: UserFormValues) => void;
    isPending: boolean;
    initialValues: UserFormValues;
}) => {
    const [roleWarning, setRoleWarning] = useState(false);
    const form = useForm<UserFormValues & { passwordAgain: string }>({
        mode: "controlled",
        initialValues: {
            name,
            email,
            password,
            passwordAgain: "",
            role,
        },
        validate: zodResolver(schema),
        onValuesChange: ({ role }) => {
            if (role === "ADMIN") setRoleWarning(true);
            else setRoleWarning(false);
        },
    });

    return (
        <form
            onSubmit={form.onSubmit(({ passwordAgain: _, ...rest }) =>
                onSubmit(rest),
            )}
        >
            <Stack>
                <SimpleGrid cols={{ md: 2, xs: 1 }}>
                    <TextInput
                        label="Kullanıcı İsmi"
                        {...form.getInputProps("name")}
                    />
                    <TextInput
                        required
                        label="E-Mail"
                        placeholder="ornek@email.com"
                        {...form.getInputProps("email")}
                    />
                    <PasswordInput
                        required
                        placeholder="******"
                        label="Şifre"
                        {...form.getInputProps("password")}
                    />
                    <PasswordInput
                        required
                        placeholder="******"
                        label="Şifre tekrar"
                        {...form.getInputProps("passwordAgain")}
                    />
                    <Select
                        label="Rol"
                        allowDeselect={false}
                        description={
                            roleWarning ? (
                                <Text c="yellow">
                                    Uyarı! Bu kullanıcıya "admin" rolü vermek
                                    tüm sisteme erişebilmesine olanak
                                    sağlıyacaktır
                                </Text>
                            ) : undefined
                        }
                        data={[
                            {
                                label: "Kullanıcı",
                                value: "USER",
                            },
                            {
                                label: "Admin",
                                value: "ADMIN",
                            },
                        ]}
                        {...form.getInputProps("role")}
                    />
                </SimpleGrid>
                <Group>
                    <Button variant="default" onClick={form.reset}>
                        Sıfırla
                    </Button>
                    <Button type="submit" loading={isPending}>
                        Kaydet
                    </Button>
                </Group>
            </Stack>
        </form>
    );
};
