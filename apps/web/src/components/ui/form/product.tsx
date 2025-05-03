import { Product, productSchema } from "#";
import {
    Button,
    Divider,
    Group,
    NumberInput,
    Select,
    SimpleGrid,
    Stack,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
    IconCurrencyDollar,
    IconCurrencyEuro,
    IconCurrencyLira,
} from "@tabler/icons-react";

export type ProductFormValues = Omit<
    Product,
    "id" | "category" | "createdAt" | "updatedAt"
>;

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
    onSubmit: (values: ProductFormValues) => void;
}) => {
    const form = useForm<ProductFormValues>({
        mode: "controlled",
        initialValues,
        validate: zodResolver(productSchema),
    });

    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <Stack>
                <SimpleGrid cols={{ md: 2, sm: 1 }}>
                    <Stack>
                        <Divider label="İsimlendirme" />
                        <TextInput
                            label="Ürün Adı"
                            required
                            {...form.getInputProps("name")}
                        />
                        <Textarea
                            label="Açıklama"
                            {...form.getInputProps("description")}
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
                            required
                            label="Değer"
                            clearable={false}
                            leftSection={currencyValues[form.values.currency]}
                            data={["TRY", "USD", "EUR"]}
                            {...form.getInputProps("currency")}
                        />
                    </Stack>
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
