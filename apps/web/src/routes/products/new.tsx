import { ProductFormValues } from "@/components/ui/form/product";
import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { createNewProduct } from "@/utils/api/product";
import { notifyWithResponse } from "@/utils/notifications";
import { Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
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

    const { mutate, isPending } = useMutation({
        mutationFn: async (p: ProductFormValues) => await createNewProduct(p),
        onError: (error) => {
            console.error(error);
            showNotification({
                color: "red",
                message: "Birşey ters gitti",
            });
        },
        onSuccess: (res) => notifyWithResponse(res),
    });

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
                        categoryIDs: [],
                        isActive: true,
                        price: 0,
                        quantity: 0,
                        tags: [],
                        barcode: 0,
                    }}
                    isPending={isPending}
                    onSubmit={(v) => mutate(v)}
                />
            </Suspense>
        </Stack>
    );
}
