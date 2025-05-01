import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { FileInput, Image, SimpleGrid, Stack } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/products/new")({
    component: RouteComponent,
});

function RouteComponent() {
    const { change } = useBreadCrumbs();
    const [fileURLs, setFileURLs] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        fileURLs.forEach((url) => URL.revokeObjectURL(url));
        const nextPreviews = files.map((file) => URL.createObjectURL(file));
        setFileURLs(nextPreviews);
    }, [files]);

    useEffect(() => {
        change([
            { label: "Ürünler", to: "/products" },
            { label: "Yeni", to: "/products/new" },
        ]);
    }, []);
    return (
        <Stack m="md">
            {fileURLs.map((src, i) => (
                <Image src={src} w={400} key={src + i} alt={files[i].name} />
            ))}
            <SimpleGrid cols={{ sm: 1, md: 2 }}>
                <FileInput
                    accept="image/png,image/jpeg,image/gif"
                    onChange={setFiles}
                    multiple
                />
            </SimpleGrid>
        </Stack>
    );
}
