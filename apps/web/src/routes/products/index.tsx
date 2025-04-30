import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { Divider, Stack, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/products/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { change } = useBreadCrumbs();
    useEffect(() => {
        change([{ label: "Kullanıcılar", to: "/users" }]);
    }, []);
    return (
        <Stack>
            <Title order={2}>Ürünler</Title>
            <Divider />
        </Stack>
    );
}
