import { wait } from "#";
import { sendEmailVerificationCode, verifyEmailCode } from "@/utils/auth";
import {
    Button,
    LoadingOverlay,
    PinInput,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login/verify")({
    validateSearch: ({ redirect }) => ({
        redirect: (redirect as string) ?? "/",
    }),
    component: VerifyComponent,
    loader: async () => {
        const email = sessionStorage.getItem("pending_email");
        if (!email) {
            throw new Error("Email is not defined");
        }
        await sendEmailVerificationCode(email);
    },
    pendingComponent: () => <LoadingOverlay visible />,
});

function VerifyComponent() {
    const { redirect } = Route.useSearch();
    const navigate = useNavigate();
    const form = useForm({
        initialValues: {
            code: "",
        },
        validate: {
            code: (v) => (v.length < 6 ? "Kod en az 6 karakter olmalı" : null),
        },
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async ({ code }: { code: string }) => {
        setLoading(true);
        const email = sessionStorage.getItem("pending_email");
        const res = await verifyEmailCode(email!, code);
        if (res.status === 401) {
            showNotification({
                message: "Geçersiz bir kod girdiniz",
                color: "red",
            });
            setLoading(false);
            return;
        }
        if (!res.ok) {
            showNotification({
                message: "Birşey ters gitti",
                color: "red",
            });
            setLoading(false);
            return;
        }

        setLoading(false);
        showNotification({
            message: "Giriş başarılı",
            color: "green",
        });
        await wait(500);
        sessionStorage.removeItem("pending_email");
        navigate({
            to: redirect || "/",
        });
    };

    return (
        <Stack h="100vh" align="center" justify="center">
            <LoadingOverlay visible={loading} />
            <Title order={2} ta="center">
                Emaili Doğrula
            </Title>
            <Text span>E-Mail posta kutunu kontrol et</Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <PinInput length={6} {...form.getInputProps("code")} />
                <Button type="submit" loading={loading} mt="sm" fullWidth>
                    Gönder
                </Button>
            </form>
        </Stack>
    );
}
