import { userAuthentication, wait } from "#";
import { isAuthenticated } from "@/utils/user";
import {
    Button,
    Divider,
    Flex,
    Paper,
    PasswordInput,
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

export const Route = createFileRoute("/login")({
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
        const { success, error } = userAuthentication.safeParse(v);

        if (!success) {
            const errors = error.flatten().fieldErrors;
            if (errors.email) form.setFieldError("email", errors.email[0]);
            if (errors.password)
                form.setFieldError("password", errors.password[0]);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch("/api/auth/login", {
                credentials: "include",
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

            showNotification({
                color: "green",
                message: "Logged in successfuly",
            });

            await wait(1000);
            throw redirectToUrl({ to: search?.redirect || "/" });
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

                        <PasswordInput
                            label="Password"
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
