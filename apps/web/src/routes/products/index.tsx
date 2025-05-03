import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { getAllProducts } from "@/utils/product";
import { Divider, Stack, Title } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import { useQuery } from "@tanstack/react-query";
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
    const { data: products, isPending } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            nprogress.start();
            await getAllProducts();
            nprogress.complete();
        },
    });
    return (
        <Stack>
            <Title order={2}>Ürünler</Title>
            <Divider />
            <pre>{JSON.stringify(products, null, 2)}</pre>
        </Stack>
    );
}
