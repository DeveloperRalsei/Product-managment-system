import { Divider, Stack, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Stack>
            <Title order={2}>Ürünler</Title>
            <Divider />
        </Stack>
    );
}
