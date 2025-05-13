import { Product } from "#";
import { deleteProductById } from "@/utils/api/product";
import { Carousel } from "@mantine/carousel";
import { ActionIcon, Image, Table, Text } from "@mantine/core";
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

export const ProductTable = ({
    products,
    refetchFunc,
}: {
    products: Product[];
    refetchFunc: () => void;
}) => {
    return (
        <Table.ScrollContainer minWidth="100%">
            <Table withRowBorders striped>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={1}>#</Table.Th>
                        <Table.Th w={30}>Resim</Table.Th>
                        <Table.Th miw={130}>Ürün Adı</Table.Th>
                        <Table.Th miw={70}>Fiyat</Table.Th>
                        <Table.Th miw={70}>Stok</Table.Th>
                        <Table.Th>Aktif mi?</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {products.length === 0 && (
                        <Table.Tr>
                            <Table.Td colSpan={999}>
                                <Text ta="center" c="dimmed">
                                    Ürün bulunamadı
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    )}
                    {products.map((p, i) => (
                        <Table.Tr key={p.id}>
                            <Table.Th>{i + 1}</Table.Th>
                            <Table.Td p="sm">
                                <Carousel w={90} withControls={false}>
                                    {p.images.map((imgUrl, i) => (
                                        <Carousel.Slide
                                            w="100%"
                                            key={i + imgUrl}
                                        >
                                            <Image
                                                src={imgUrl}
                                                alt={imgUrl}
                                                radius="sm"
                                            />
                                        </Carousel.Slide>
                                    ))}
                                </Carousel>
                            </Table.Td>
                            <Table.Td>
                                <Text span fz="lg" ta="center">
                                    {p.name}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                {p.price} {currencyIcon[p.currency]}
                            </Table.Td>
                            <Table.Td>{p.quantity}</Table.Td>
                            <Table.Td>
                                {p.isActive ? <IconCheck /> : <IconX />}
                            </Table.Td>
                            <Table.Td>
                                <ActionIcon.Group>
                                    <ActionIcon
                                        size="lg"
                                        component={Link}
                                        to={`/products/edit/${p.id}`}
                                    >
                                        <IconEdit />
                                    </ActionIcon>
                                    <ActionIcon size="lg" color="green">
                                        <IconSquareCheck />
                                    </ActionIcon>
                                    <ActionIcon
                                        size="lg"
                                        color="red"
                                        onClick={async () => {
                                            nprogress.start();
                                            const res = await deleteProductById(
                                                p.id,
                                            );
                                            if (res.status === 401)
                                                showNotification({
                                                    message:
                                                        "Buna yetkiniz yok",
                                                    color: "red",
                                                });
                                            if (!res.ok)
                                                showNotification({
                                                    message:
                                                        "Birşey ters gitti",
                                                    color: "red",
                                                });
                                            nprogress.complete();
                                            refetchFunc();
                                        }}
                                    >
                                        <IconTrash />
                                    </ActionIcon>
                                </ActionIcon.Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
};
