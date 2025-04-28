import { MakeOptional, User } from "#";
import { createUser } from "@/utils/user";
import {
    Alert,
    Anchor,
    Button,
    Divider,
    Group,
    PasswordInput,
    Select,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconExclamationCircle } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/users/new")({
    component: RouteComponent,
});

const schema = z.object({
    name: z.string().optional(),
    email: z.string().email("Lütfen geçerli bir email adresi girin"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
    passwordAgain: z.string(),
    role: z.literal<User["role"]>("USER"),
});

function RouteComponent() {
    const [warningActive, setWarningActive] = useState(true);
    const [roleWarning, setRoleWarning] = useState(false);

    const form = useForm<
        Omit<User, "id" | "verified"> & { passwordAgain: string }
    >({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            email: "",
            password: "",
            passwordAgain: "",
            role: "USER",
        },
        validate: {
            passwordAgain: (v, { password }) =>
                v !== password ? "Şifre ile aynı olmak zorunda!" : null,
            ...zodResolver(schema),
        },
        onValuesChange: ({ role }) => {
            if (role === "ADMIN") setRoleWarning(true);
            else setRoleWarning(false);
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (formValues: Omit<User, "id" | "verified">) =>
            createUser({
                name: formValues.name,
                email: formValues.email,
                password: formValues.password,
                role: formValues.role,
            }),
        onSuccess: (response) => {
            if (response.status === 401)
                return showNotification({
                    color: "red",
                    message: "Kullanıcı oluşturulamadı. Buna yetkiniz yok",
                });
            if (!response.ok)
                return showNotification({
                    color: "red",
                    message: "Birşey ters gitti.",
                });
            showNotification({
                message: "Kullanıcı oluşturuldu",
                color: "green",
            });
            form.reset();
        },
        onError: (error) => {
            console.error(error.message);
            showNotification({
                message: "Birşey ters gitti!",
                color: "red",
            });
        },
    });

    return (
        <Stack p="sm">
            <Title order={3}>Yeni Kullanıcı Ekle</Title>
            <Alert
                title="Uyarı"
                color="orange"
                withCloseButton
                onClose={() => setWarningActive(false)}
                hidden={!warningActive}
                icon={<IconExclamationCircle />}
            >
                Lütfen yeni bir kullanıcı eklediğinizde, kullanıcı kimlik
                bilgilerine erişe bilen herkesin sisteme girebildiğiniz
                unutmayın. Herhangi acil bir durumda{" "}
                <Anchor component={Link} to="/users">
                    listeleme
                </Anchor>{" "}
                ekranından silebilirsiniz.
            </Alert>
            <Divider />

            <form onSubmit={form.onSubmit((v) => mutate(v))}>
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
                            description={
                                roleWarning ? (
                                    <Text c="yellow">
                                        Uyarı! Bu kullanıcıya "admin" rolü
                                        vermek tüm sisteme erişebilmesine olanak
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
        </Stack>
    );
}
