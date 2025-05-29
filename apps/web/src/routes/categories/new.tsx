import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { Stack } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";

const CategoryForm = lazy(() =>
    import("@/components/ui/form/category").then((mod) => ({
        default: mod.CategoryForm,
    })),
);

export const Route = createFileRoute("/categories/new")({
    component: RouteComponent,
});

function RouteComponent() {
    const { change } = useBreadCrumbs();

    useEffect(() => {
        change([
            { label: "Kategoriler", to: "/categories" },
            { label: "Yeni", to: "/categories/new" },
        ]);
    }, []);
    return (
        <Stack m="md">
            <Suspense fallback={"Yükleniyor"}>
                <CategoryForm
                    initialValues={{
                        name: "",
                    }}
                    onSubmit={console.log}
                />
            </Suspense>
        </Stack>
    );
}
