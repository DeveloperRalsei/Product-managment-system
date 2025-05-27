import { Product } from "#";
import { deleteProductById } from "@/utils/api/product";
import { Carousel } from "@mantine/carousel";
import { ActionIcon, Group, Image, Stack, Table, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";
import {
    IconCheck,
    IconEdit,
    IconSquareCheck,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

const currencyIcon: Record<Product["currency"], string> = {
    EUR: "€",
    USD: "$",
    TRY: "₺",
};

const ProductImageViewer = ({ imgUrls }: { imgUrls: Product["images"] }) => (
    <Carousel w={90} withControls={false}>
        {imgUrls.map((imgUrl, i) => (
            <Carousel.Slide w="100%" key={i + imgUrl}>
                <Image src={imgUrl} alt={imgUrl} radius="sm" />
            </Carousel.Slide>
        ))}
    </Carousel>
);

export const ProductTable = ({
    products,
    refetchFunc,
}: {
    products: Product[];
    refetchFunc: () => void;
}) => {
    const handleDelete = async (p: Product) => {
        modals.openConfirmModal({
            title: (
                <Text fw="bold">
                    Bu ürünü silmek istediğinize emin misiniz?
                </Text>
            ),
            children: (
                <Stack>
                    <Group>
                        <ProductImageViewer imgUrls={p.images} />
                        <Stack gap={5}>
                            <Text fw="bold">{p.name}</Text>#{p.barcode}
                        </Stack>
                    </Group>
                </Stack>
            ),
            onConfirm: () => {
                deleteProduct(p.id);
            },
            confirmProps: { color: "red" },
        });
    };

    const deleteProduct = async (id: Product["id"]) => {
        nprogress.start();
        const res = await deleteProductById(id);
        if (res.status === 401)
            showNotification({
                message: "Buna yetkiniz yok",
                color: "red",
            });
        if (!res.ok)
            showNotification({
                message: "Birşey ters gitti",
                color: "red",
            });
        nprogress.complete();
        refetchFunc();
    };

    return (
        <Table.ScrollContainer minWidth="100%">
            <Table striped highlightOnHover withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>#</Table.Th>
                        <Table.Th>Resim</Table.Th>
                        <Table.Th>Ürün Adı</Table.Th>
                        <Table.Th>Marka</Table.Th>
                        <Table.Th style={{ textAlign: "right" }}>
                            Fiyat
                        </Table.Th>
                        <Table.Th style={{ textAlign: "center" }}>
                            Stok
                        </Table.Th>
                        <Table.Th style={{ textAlign: "center" }}>
                            Aktif mi?
                        </Table.Th>
                        <Table.Th>Aksiyon</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {products.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={999}>
                                <Text ta="center" c="dimmed">
                                    Ürün bulunamadı
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        products.map((p, i) => (
                            <Table.Tr key={p.id}>
                                <Table.Th>{i + 1}</Table.Th>
                                <Table.Td p="sm">
                                    <ProductImageViewer imgUrls={p.images} />
                                </Table.Td>
                                <Table.Td style={{ maxWidth: 200 }}>
                                    <Text truncate="end" fz="md" fw="bold">
                                        {p.name}
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text
                                        fw="bold"
                                        c={p.brand ? "black" : "dimmed"}
                                    >
                                        {p.brand?.name ?? "Tanımsız"}
                                    </Text>
                                </Table.Td>
                                <Table.Td style={{ textAlign: "right" }}>
                                    {p.price} {currencyIcon[p.currency]}
                                </Table.Td>
                                <Table.Td style={{ textAlign: "center" }}>
                                    {p.quantity}
                                </Table.Td>
                                <Table.Td style={{ textAlign: "center" }}>
                                    {p.isActive ? (
                                        <IconCheck color="green" />
                                    ) : (
                                        <IconX color="red" />
                                    )}
                                </Table.Td>
                                <Table.Td>
                                    <ActionIcon.Group>
                                        <ActionIcon
                                            size="lg"
                                            component={Link}
                                            to={`/products/edit/${p.id}`}
                                            variant="light"
                                        >
                                            <IconEdit />
                                        </ActionIcon>
                                        <ActionIcon
                                            size="lg"
                                            color="green"
                                            variant="light"
                                        >
                                            <IconSquareCheck />
                                        </ActionIcon>
                                        <ActionIcon
                                            size="lg"
                                            color="red"
                                            variant="light"
                                            onClick={() => handleDelete(p)}
                                        >
                                            <IconTrash />
                                        </ActionIcon>
                                    </ActionIcon.Group>
                                </Table.Td>
                            </Table.Tr>
                        ))
                    )}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
};
