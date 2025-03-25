import { userAuthentication, wait } from "#";
import { isAuthenticated } from "@/utils/user";
import {
    Button,
    Divider,
    Flex,
    Paper,
    Stack,
    TextInput,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
    createFileRoute,
    redirect as redirectToUrl,
} from "@tanstack/react-router";
import { useState } from "react";
import { ZodError } from "zod";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
    validateSearch: ({ redirect }) => ({
        redirect: (redirect as string) || "/",
    }),
    beforeLoad: async ({ search: { redirect } }) => {
        const auth = await isAuthenticated();
        if (auth) {
            throw redirectToUrl({ to: redirect, reloadDocument: true });
        }
    },
});

function RouteComponent() {
    const search = Route.useSearch();
    const [loading, setIsLoading] = useState(false);
    const form = useForm({
        mode: "controlled",
        initialValues: {
            email: "",
            password: "",
        },
    });

    const handleSubmit = async (v: { email: string; password: string }) => {
        try {
            userAuthentication.parse(v);
        } catch (error) {
            const zodError = error as ZodError;

            for (const err of zodError.errors) {
                if (err.path[0] === "email") {
                    form.setFieldError("email", err.message);
                } else if (err.path[0] === "password") {
                    form.setFieldError("password", err.message);
                }
            }
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form.getValues()),
            });

            if (!response.ok) {
                showNotification({
                    color: "red",
                    message: "Wrong password or email",
                });
                return;
            }

            const { token } = await response.json();
            localStorage.setItem("session-token", token);

            showNotification({
                color: "green",
                message: "Logged in successfuly",
            });

            await wait(1000);
            throw redirectToUrl({ to: search?.redirect });
        } catch (error) {
            showNotification({
                message: "Something went wrong",
                color: "red",
            });
            window.location.reload();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Stack align="center" justify="center" mih="100vh">
            <Paper p="sm" withBorder>
                <form onSubmit={form.onSubmit((v) => handleSubmit(v))}>
                    <Stack>
                        <Title order={2} ta="center">
                            Login
                        </Title>
                        <Divider />

                        <TextInput
                            label="Email"
                            placeholder="email@example.com"
                            {...form.getInputProps("email")}
                        />

                        <TextInput
                            label="password"
                            type="password"
                            placeholder="******"
                            {...form.getInputProps("password")}
                        />

                        <Flex gap={4}>
                            <Button
                                flex={1}
                                onClick={form.reset}
                                variant="default"
                            >
                                Reset
                            </Button>
                            <Button flex={1} type="submit" loading={loading}>
                                Submit
                            </Button>
                        </Flex>
                    </Stack>
                </form>
            </Paper>
        </Stack>
    );
}
