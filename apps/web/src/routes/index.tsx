import { Stack } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useMarkdown } from "@/utils/hooks/useMarkdown";
import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { renderer: Document, metadata } = useMarkdown("/docs/index.md");
    const { change } = useBreadCrumbs();

    useEffect(() => {
        change([{ label: "Ana sayfa", to: "/" }]);
    }, []);

    return (
        <Stack p="xl">
            <Document />
        </Stack>
    );
}
