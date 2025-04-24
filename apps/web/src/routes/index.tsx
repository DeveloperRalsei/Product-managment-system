import { Stack } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useMarkdown } from "../utils/hooks/useMarkdown";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { renderer: Document, metadata } = useMarkdown("/docs/index.md");

    return (
        <Stack p="xl">
            <Document />
        </Stack>
    );
}
