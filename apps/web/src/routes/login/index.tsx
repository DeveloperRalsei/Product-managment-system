import { User, wait, zodLoginSchema } from "#";
import { isAuthenticated, login } from "@/utils/api/auth";
import { notifyWithResponse } from "@/utils/notifications";
import {
    Button,
    Paper,
    PasswordInput,
    Stack,
    TextInput,
    Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconKey, IconMail } from "@tabler/icons-react";
import {
    createFileRoute,
    useNavigate,
    redirect as redirectToUrl,
    useSearch,
} from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login/")({
    component: RouteComponent,
    validateSearch: ({ redirect }) => ({
        redirect: (redirect as string) ?? "/",
    }),
    beforeLoad: async ({ search: { redirect } }) => {
        const auth = await isAuthenticated();
        if (auth) {
            throw redirectToUrl({ to: redirect || "/", reloadDocument: true });
        }
    },
});

function RouteComponent() {
    const { redirect } = useSearch({
        from: "/login/",
    });

    const navigate = useNavigate();

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            password: "",
        },
        validate: zodResolver(zodLoginSchema),
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (v: { email: string; password: string }) => {
        setLoading(true);
        try {
            const res = await login(v);

            if (res.status === 403) {
                sessionStorage.setItem("pending_email", form.getValues().email);
                navigate({
                    to: "/login/verify",
                    reloadDocument: true,
                    search: { redirect },
                });
                return;
            }

            if (!res.ok) {
                notifyWithResponse(res);
                return;
            }

            await wait(500);
            navigate({
                to: redirect || "/",
                reloadDocument: true,
            });
        } catch (error) {
            showNotification({
                message: "Birşey ters gitti",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack align="center" justify="center" h="100vh">
            <form onSubmit={form.onSubmit((v) => handleSubmit(v))}>
                <Title order={2} ta="center" mb="md">
                    Giriş Yap
                </Title>
                <Paper withBorder p="sm">
                    <Stack>
                        <TextInput
                            leftSection={<IconMail />}
                            label="E-Mail"
                            placeholder="ornek@mail.com"
                            {...form.getInputProps("email")}
                        />
                        <PasswordInput
                            leftSection={<IconKey />}
                            label="Şifre"
                            placeholder="******"
                            {...form.getInputProps("password")}
                        />
                        <Button fullWidth type="submit" loading={loading}>
                            Giriş Yap
                        </Button>
                    </Stack>
                </Paper>
            </form>
        </Stack>
    );
}
