import { ProductForm, ProductFormValues } from "@/components/ui/form/product";
import { getProductById, updateProductById } from "@/utils/api/product";
import { notifyWithResponse } from "@/utils/notifications";
import { Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/products/edit/$id")({
    component: RouteComponent,
});

async function fetchImages(imgUrls: string[]) {
    const responses = await Promise.all(imgUrls.map((url) => fetch(url)));
    return await Promise.all(responses.map((res) => res.blob()));
}

function RouteComponent() {
    const { id } = Route.useParams();
    const { data: productData, isPending } = useQuery({
        queryFn: () => getProductById(id),
        queryKey: ["product", id],
    });

    const { mutate, isPending: isProductPending } = useMutation({
        mutationFn: async (values: ProductFormValues) =>
            updateProductById(id, values),
        onError: (error) => {
            console.error(error);
            showNotification({
                message: "Birşey ters gitti",
                color: "red",
            });
        },
        onSuccess: ({ ok, status, ...rest }) => {
            if (status === 403)
                return showNotification({
                    message: "Farklı bir barkod girin",
                    color: "red",
                });

            notifyWithResponse({ ...rest, status, ok });
        },
    });
    const [images, setImages] = useState<File[]>([]);
    const [imgLoading, setImgLoading] = useState(false);

    useEffect(() => {
        if (!productData) return;
        let isCancelled = false;

        const loadImages = async () => {
            setImgLoading(true);
            const blobs = await fetchImages(productData.images);
            if (isCancelled) return;

            const files = blobs.map(
                (blob, index) =>
                    new File([blob], `image-${index}.jpg`, { type: blob.type }),
            );
            setImages(files);
            setImgLoading(false);
        };

        loadImages();

        return () => {
            isCancelled = true;
        };
    }, [productData]);

    if (isPending || imgLoading) return <div>Yükleniyor...</div>;
    if (!productData) return <div>Ürün bulunamadı</div>;

    return (
        <Stack m="md">
            <ProductForm
                initialValues={{
                    ...productData,
                    images,
                    videoUrl: "",
                }}
                isPending={isProductPending || isPending}
                onSubmit={(v) => mutate(v)}
            />
        </Stack>
    );
}
