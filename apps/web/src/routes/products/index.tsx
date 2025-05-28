import { Product } from "#";
import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { ProductTable } from "@/components/ui/tables/product-table";
import { getAllProducts } from "@/utils/api/product";
import { notifyWithResponse } from "@/utils/notifications";
import { Stack, TextInput } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/products/")({
    component: RouteComponent,
});

function RouteComponent() {
    const [search, setSearch] = useState<string>();
    const { change } = useBreadCrumbs();
    useEffect(() => {
        change([{ label: "Ürünler", to: "/products" }]);
    }, []);
    const {
        data: products,
        isPending,
        refetch,
    } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            nprogress.start();
            const res = await getAllProducts();
            if (!res.ok) notifyWithResponse(res);
            nprogress.complete();
            return (await res.json()) as Product[];
        },
    });

    const filteredProducts = search
        ? products?.filter((v, i) =>
              [v.name, v.description, v.price, v.quantity, i + 1]
                  .filter((x) => x)
                  .join(" ")
                  .toLowerCase()
                  .includes(search.toLowerCase()),
          )
        : products;

    return (
        <Stack>
            <TextInput
                label="Ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {isPending && "Yükleniyor..."}
            <ProductTable
                products={filteredProducts || []}
                refetchFunc={refetch}
            />
        </Stack>
    );
}
