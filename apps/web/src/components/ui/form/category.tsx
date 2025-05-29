import { categorySchema } from "#";
import { Prisma } from "#/prisma";
import {
    Divider,
    Group,
    SimpleGrid,
    Stack,
    TextInput,
    Text,
    Button,
    Image,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { IconUpload } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export type CategoryFormValues = Omit<
    Prisma.ParentCategoryCreateInput,
    "bannerUrl" | "logoUrl" | "childCategories"
> & {
    bannerFile?: File;
    logoFile?: File;
};

export const CategoryForm = ({
    initialValues,
    onSubmit,
}: {
    initialValues: CategoryFormValues;
    onSubmit: (v: CategoryFormValues) => void;
}) => {
    const form = useForm<CategoryFormValues>({
        mode: "controlled",
        initialValues,
        validate: zodResolver(categorySchema),
    });
    const [bannerImgUrl, setBannerImgUrl] = useState<string>();
    const [logoImgUrl, setLogoImgUrl] = useState<string>();

    useEffect(() => {
        const bannerUrl = form.values.bannerFile
            ? URL.createObjectURL(form.values.bannerFile)
            : undefined;
        setBannerImgUrl(bannerUrl);

        const logoUrl = form.values.logoFile
            ? URL.createObjectURL(form.values.logoFile)
            : undefined;
        setLogoImgUrl(logoUrl);
    }, [form.values.bannerFile, form.values.logoFile]);

    return (
        <form onSubmit={form.onSubmit((v) => onSubmit(v))}>
            <Stack>
                <TextInput
                    label="Kategori Adı"
                    withAsterisk
                    {...form.getInputProps("name")}
                />

                <SimpleGrid cols={{ md: 2, sm: 1 }}>
                    <Stack>
                        <Divider label="Banner" />
                        <Dropzone
                            onDrop={(files) => {
                                form.setFieldValue("bannerFile", files[0]);
                            }}
                            h={150}
                            accept={[
                                MIME_TYPES.png,
                                MIME_TYPES.jpeg,
                                MIME_TYPES.gif,
                                MIME_TYPES.svg,
                            ]}
                        >
                            <Group
                                align="center"
                                justify="center"
                                h="100%"
                                w="100%"
                            >
                                <IconUpload size={35} />
                                <Text c="dimmed">Bir banner resmi seçin</Text>
                            </Group>
                        </Dropzone>
                        {bannerImgUrl && (
                            <Image
                                src={bannerImgUrl}
                                mah={150}
                                alt="banner Image"
                            />
                        )}
                    </Stack>
                    <Stack>
                        <Divider label="Logo" />
                        <Text c="dimmed">
                            Bir logo seçin (Kare çözünürlük tavsiye edilir)
                        </Text>
                        <Group>
                            <Dropzone
                                onDrop={(files) => {
                                    form.setFieldValue("logoFile", files[0]);
                                }}
                                h={150}
                                w={150}
                                accept={[
                                    MIME_TYPES.png,
                                    MIME_TYPES.jpeg,
                                    MIME_TYPES.gif,
                                    MIME_TYPES.svg,
                                ]}
                            >
                                <Group
                                    align="center"
                                    justify="center"
                                    h="100%"
                                    w="100%"
                                >
                                    <IconUpload size={35} />
                                </Group>
                            </Dropzone>
                            {logoImgUrl && (
                                <Image
                                    src={logoImgUrl}
                                    alt="Logo Image"
                                    w={150}
                                    h={150}
                                />
                            )}
                        </Group>
                    </Stack>
                </SimpleGrid>
                <Group>
                    <Button variant="default" onClick={form.reset}>
                        Sıfırla
                    </Button>
                    <Button type="submit">Kaydet</Button>
                </Group>
            </Stack>
        </form>
    );
};
