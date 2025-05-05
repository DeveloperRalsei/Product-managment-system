import { Product } from "#";
import { Carousel } from "@mantine/carousel";
import { Image, Table, Text } from "@mantine/core";

export const ProductTable = ({ products }: { products: Product[] }) => {
    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th w={1}>#</Table.Th>
                    <Table.Th>Ürün Adı</Table.Th>
                    <Table.Th w={200}>Resim</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {products.map((p, i) => (
                    <Table.Tr key={p.id}>
                        <Table.Th>{i + 1}</Table.Th>
                        <Table.Td>
                            <Text span fz="lg" ta="center">
                                {p.name}
                            </Text>
                        </Table.Td>
                        <Table.Td p="sm">
                            <Carousel>
                                {p.images.map((imgUrl, i) => (
                                    <Carousel.Slide key={i + imgUrl}>
                                        <Image
                                            src={imgUrl}
                                            alt={imgUrl}
                                            radius="sm"
                                        />
                                    </Carousel.Slide>
                                ))}
                            </Carousel>
                        </Table.Td>
                    </Table.Tr>
                ))}
                <Table.Tr></Table.Tr>
            </Table.Tbody>
        </Table>
    );
};
