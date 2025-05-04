import { Product, productSchema } from "#";
import {
    Button,
    Divider,
    FileInput,
    Group,
    Image,
    NumberInput,
    Select,
    SimpleGrid,
    Stack,
    Tabs,
    TagsInput,
    TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
    IconCurrencyDollar,
    IconCurrencyEuro,
    IconCurrencyLira,
} from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { memo, useEffect, useMemo } from "react";
import { Editor } from "./text-editor";

export type ProductFormValues = Omit<
    Product,
    "id" | "category" | "createdAt" | "updatedAt" | "images"
> & { images: File[] };

const currencyValues: Record<Product["currency"], React.ReactNode> = {
    TRY: <IconCurrencyLira />,
    EUR: <IconCurrencyEuro />,
    USD: <IconCurrencyDollar />,
};

const MemoizedEditor = memo(Editor);

export const ProductForm = ({
    initialValues,
    onSubmit,
    isPending,
}: {
    initialValues: ProductFormValues;
    isPending: boolean;
    onSubmit: (values: ProductFormValues) => void;
}) => {
    const form = useForm<ProductFormValues>({
        mode: "controlled",
        initialValues,
        validate: zodResolver(productSchema),
        validateInputOnChange: true,
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
        <form onSubmit={form.onSubmit((v) => onSubmit(v))}>
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
                    </Stack>
                </SimpleGrid>
                <Divider label="Açıklama" />
                <MemoizedEditor
                    onChange={(content) =>
                        form.setFieldValue("description", content)
                    }
                />
                <Divider label="Kategori ve Resimler" />
                <Tabs></Tabs>
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
                    {form.values.images.length > 0 && (
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
