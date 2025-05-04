import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { Stack } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";

const ProductForm = lazy(() =>
    import("@/components/ui/form/product").then((mod) => ({
        default: mod.ProductForm,
    })),
);

export const Route = createFileRoute("/products/new")({
    component: RouteComponent,
});

function RouteComponent() {
    const { change } = useBreadCrumbs();
    useEffect(() => {
        change([
            { label: "Ürünler", to: "/products" },
            { label: "Yeni", to: "/products/new" },
        ]);
    }, []);

    return (
        <Stack m="md">
            <Suspense fallback="Yükleniyor...">
                <ProductForm
                    initialValues={{
                        name: "",
                        description: "",
                        currency: "TRY",
                        images: [],
                        inStock: true,
                        innerCategoryId: "",
                        isActive: true,
                        price: 0,
                        quantity: 0,
                        tags: [],
                    }}
                    isPending={false}
                    onSubmit={console.log}
                />
            </Suspense>
        </Stack>
    );
}
