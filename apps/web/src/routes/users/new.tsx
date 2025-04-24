import { MakeOptional, User } from "#";
import {
    Alert,
    Anchor,
    Button,
    Divider,
    Group,
    PasswordInput,
    SimpleGrid,
    Stack,
    TextInput,
    Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconExclamationCircle } from "@tabler/icons-react";
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
});

function RouteComponent() {
    const [warningActive, setWarningActive] = useState(true);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        validate: zodResolver(schema),
    });

    const handleSubmit = async (
        values: MakeOptional<Omit<User, "id" | "verified">, "name">,
    ) => {
        setLoading(true);

        try {
            const response = await fetch("/api/v1/user/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
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
                message: "Kullanıcı başarı ile oluşturuldu.",
            });
            form.reset();
        } catch (error) {
            console.error(error);
            showNotification({
                message: "Birşey ters gitti. Lütfen tekrar deneyin",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

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

            <form onSubmit={form.onSubmit((v) => handleSubmit(v))}>
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
                    </SimpleGrid>
                    <Group>
                        <Button variant="default" onClick={form.reset}>
                            Sıfırla
                        </Button>
                        <Button type="submit" loading={loading}>
                            Kaydet
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Stack>
    );
}
