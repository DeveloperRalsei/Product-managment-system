import { Paper, Stack, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Stack align="center" justify="center" mih="100vh">
            <Paper p="sm">
                <Title order={2}>Login</Title>
            </Paper>
        </Stack>
    );
}
