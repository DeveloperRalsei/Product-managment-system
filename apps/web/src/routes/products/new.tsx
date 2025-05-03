import { Product } from "#";
import { ProductForm } from "@/components/ui/form/product";
import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { FileInput, SimpleGrid, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect } from "react";

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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <Stack m="md">
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
        </Stack>
    );
}
