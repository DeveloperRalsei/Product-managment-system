import { wait, zodLoginSchema } from "#";
import { isAuthenticated, login } from "@/utils/auth";
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
            const { ok, status } = await login(v);

            if (status === 401 || status === 404) {
                showNotification({
                    color: "red",
                    message: "Kullanıcı adı veya şifre yanlış",
                });
                return;
            }

            if (status === 403) {
                sessionStorage.setItem("pending_email", form.getValues().email);
                navigate({
                    to: "/login/verify",
                    reloadDocument: true,
                    search: { redirect },
                });
                return;
            }

            if (!ok) {
                showNotification({
                    color: "red",
                    message: "Birşey ters gitti",
                });
                return;
            }

            showNotification({
                message: "Giriş başarılı",
                color: "green",
            });
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
