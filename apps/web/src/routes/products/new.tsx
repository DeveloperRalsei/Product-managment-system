import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { Carousel } from "@mantine/carousel";
import { Button, FileInput, Image, SimpleGrid, Stack } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";

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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = new FormData();
        for (const f of files) {
            form.append("images", f);
        }

        const res = await fetch("/api/v1/upload", {
            method: "POST",
            body: form,
        });
        console.log(await res.json());
    };

    return (
        <Stack m="md">
            <form onSubmit={handleSubmit}>
                <SimpleGrid cols={{ sm: 1, md: 2 }}>
                    {fileURLs.length > 0 && (
                        <Carousel>
                            {fileURLs.map((src, i) => (
                                <Carousel.Slide key={src + i}>
                                    <Image
                                        src={src}
                                        w={400}
                                        alt={files[i].name}
                                    />
                                </Carousel.Slide>
                            ))}
                        </Carousel>
                    )}
                    <FileInput
                        accept="image/png,image/jpeg,image/gif"
                        onChange={setFiles}
                        multiple
                    />
                </SimpleGrid>
                <Button type="submit">kaydet</Button>
            </form>
        </Stack>
    );
}
