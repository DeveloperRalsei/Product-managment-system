import { CategoriesReturnType, Product, productSchema } from "#";
import {
    Button,
    Text,
    Center,
    Chip,
    Divider,
    FileInput,
    Group,
    Image,
    InputLabel,
    NumberInput,
    Select,
    SimpleGrid,
    Stack,
    TagsInput,
    TextInput,
    ScrollArea,
} from "@mantine/core";
import { useForm, UseFormReturnType, zodResolver } from "@mantine/form";
import {
    IconCurrencyDollar,
    IconCurrencyEuro,
    IconCurrencyLira,
    IconHash,
} from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { useEffect, useMemo, useState } from "react";
import { Editor } from "./text-editor";
import { getAllCategories } from "@/utils/api/category";
import { useQuery } from "@tanstack/react-query";
import { notifyWithResponse } from "@/utils/notifications";

export type ProductFormValues = Omit<
    Product,
    "id" | "createdAt" | "updatedAt" | "images"
> & { images: File[] };

const currencyValues: Record<Product["currency"], React.ReactNode> = {
    TRY: <IconCurrencyLira />,
    EUR: <IconCurrencyEuro />,
    USD: <IconCurrencyDollar />,
};

export const ProductForm = ({
    initialValues,
    onSubmit,
    isPending,
}: {
    initialValues: ProductFormValues;
    isPending: boolean;
    onSubmit: (
        values: ProductFormValues,
        form: UseFormReturnType<
            ProductFormValues,
            (values: ProductFormValues) => ProductFormValues
        >,
    ) => void;
}) => {
    const [activeParentCategoryIndex, setActiveParentCategoryIndex] =
        useState<number>();
    const form = useForm<ProductFormValues>({
        mode: "controlled",
        initialValues,
        validate: zodResolver(productSchema),
        validateInputOnChange: true,
    });

    const { data: categories, isPending: isCategoriesLoading } = useQuery({
        queryFn: async () => {
            const res = await getAllCategories();
            if (!res.ok) notifyWithResponse(res);
            return (await res.json()) as CategoriesReturnType;
        },
        queryKey: ["categories"],
    });

    const imgURLs = useMemo(
        () => form.values.images.map((img) => URL.createObjectURL(img)),
        [form.values.images],
    );
    useEffect(() => {
        return () => {
            imgURLs.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imgURLs]);

    return (
        <form onSubmit={form.onSubmit((v) => onSubmit(v, form))}>
            <Stack>
                <SimpleGrid cols={{ md: 2, sm: 1 }}>
                    <Stack>
                        <Divider label="İsimlendirme" />
                        <TextInput
                            label="Ürün Adı"
                            withAsterisk
                            {...form.getInputProps("name")}
                        />
                        <NumberInput
                            label="Miktar"
                            min={0}
                            withAsterisk
                            {...form.getInputProps("quantity")}
                        />
                    </Stack>
                    <Stack>
                        <Divider label="Fiyatlama" />
                        <NumberInput
                            required
                            label="Fiyat"
                            decimalScale={2}
                            fixedDecimalScale
                            decimalSeparator=","
                            thousandSeparator=" "
                            {...form.getInputProps("price")}
                        />
                        <Select
                            label="Değer"
                            leftSection={currencyValues[form.values.currency]}
                            withAsterisk
                            data={[
                                {
                                    label: "Türk Lirası",
                                    value: "TRY",
                                },
                                {
                                    label: "Avrupa Eurosu",
                                    value: "EUR",
                                },
                                {
                                    label: "Amerikan Doları",
                                    value: "USD",
                                },
                            ]}
                            allowDeselect={false}
                            {...form.getInputProps("currency")}
                        />
                        <NumberInput
                            label="Barkod"
                            withAsterisk
                            leftSection={<IconHash />}
                            thousandSeparator=" "
                            {...form.getInputProps("barcode")}
                        />
                    </Stack>
                </SimpleGrid>
                <Divider label="Açıklama" />
                <Editor
                    content={form.values.description}
                    onChange={(content) =>
                        form.setFieldValue("description", content)
                    }
                />
                <Divider label="Kategori ve Resimler" />
                <InputLabel>
                    Kategoriler{" "}
                    <Text span c="#dd1111">
                        *
                    </Text>
                </InputLabel>
                {isCategoriesLoading ? (
                    "Kategoriler Yükleniyor"
                ) : categories ? (
                    <>
                        <ScrollArea w="100%">
                            <Chip.Group>
                                {categories[0].map((parentCat, i) => (
                                    <Chip
                                        key={String(parentCat.id)}
                                        radius="sm"
                                        checked={
                                            i === activeParentCategoryIndex
                                        }
                                        onClick={() =>
                                            setActiveParentCategoryIndex(i)
                                        }
                                    >
                                        {parentCat.name}
                                    </Chip>
                                ))}
                            </Chip.Group>
                        </ScrollArea>
                        <InputLabel>Alt Kategoriler</InputLabel>
                        <Chip.Group
                            value={String(form.values.categoryID)}
                            onChange={(v) =>
                                form.setFieldValue(
                                    "categoryID",
                                    Array.isArray(v)
                                        ? parseInt(v[0])
                                        : parseInt(v),
                                )
                            }
                        >
                            {activeParentCategoryIndex !== undefined ? (
                                categories[0][
                                    activeParentCategoryIndex
                                ].childCategories.map((cat) => (
                                    <Chip
                                        key={cat.id}
                                        value={cat.id}
                                        radius="sm"
                                        checked={
                                            form.values.categoryID === cat.id
                                        }
                                    >
                                        {cat.name}
                                    </Chip>
                                ))
                            ) : (
                                <>Lütfen ilk önce bir kategori seçin</>
                            )}
                        </Chip.Group>
                    </>
                ) : (
                    <Text c="red" fw="bold">
                        "Kategori bulunamadı. Lütfen ürün eklemek için ilk önce
                        bir tane kategori ekleyin"
                    </Text>
                )}
                {form.errors.categoryIDs && (
                    <Text c="red">{form.errors.categoryIDs}</Text>
                )}
                <TagsInput
                    label="Etiketler"
                    value={form.values.tags}
                    onChange={(v) => form.setFieldValue("tags", v)}
                />
                <SimpleGrid cols={{ md: 2, sm: 1 }}>
                    <Stack>
                        <FileInput
                            accept="image/png,image/jpeg,image/gif"
                            label="Resimler"
                            description="Sadece (jpg,png,gif) tipinde dosyalar kabul edilir"
                            clearable
                            multiple
                            {...form.getInputProps("images")}
                        />
                    </Stack>
                    {form.values.images.length > 0 ? (
                        <Carousel>
                            {imgURLs.map((url, i) => (
                                <Carousel.Slide key={url + i}>
                                    <Image
                                        src={url}
                                        alt={i.toString()}
                                        key={i}
                                        radius="sm"
                                        mah={300}
                                    />
                                </Carousel.Slide>
                            ))}
                        </Carousel>
                    ) : (
                        <Center
                            w="100%"
                            h={200}
                            style={{
                                border: "1px solid var(--mantine-color-default-border)",
                            }}
                        >
                            Resim Yok
                        </Center>
                    )}
                    {import.meta.env.DEV && (
                        <>
                            {form.values && (
                                <pre>
                                    {JSON.stringify(form.errors, null, 2)}
                                </pre>
                            )}
                            <pre>{JSON.stringify(form.values, null, 2)}</pre>
                        </>
                    )}
                </SimpleGrid>
            </Stack>
            <Group mt="sm">
                <Button onClick={form.reset} variant="default">
                    Sıfırla
                </Button>
                <Button loading={isPending} type="submit">
                    Kaydet
                </Button>
            </Group>
        </form>
    );
};
