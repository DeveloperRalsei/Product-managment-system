import { Category, categorySchema } from "#";
import { SimpleGrid, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

export type CategoryFormValues = Omit<Category, "id">;

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

    return (
        <form onSubmit={form.onSubmit((v) => onSubmit(v))}>
            <SimpleGrid
                cols={{
                    md: 2,
                    sm: 1,
                }}
            >
                <TextInput
                    label="Kategori Adı"
                    {...form.getInputProps("name")}
                />
            </SimpleGrid>
        </form>
    );
};
