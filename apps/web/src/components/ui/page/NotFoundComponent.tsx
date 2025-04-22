import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconHome, IconReload } from "@tabler/icons-react";
import { Link, NotFoundRouteComponent } from "@tanstack/react-router";

export const NotFoundComponent: NotFoundRouteComponent = ({ data }) => {
    console.log(data);

    return (
        <Stack align="center" justify="center" h="100%">
            <Title order={3} c="red">
                404
            </Title>
            <Text c="dimmed">Aradığınız sayfa bulunamadı</Text>
            <Group>
                <Button component={Link} to="/" leftSection={<IconHome />}>
                    Ana Sayfaya Dön
                </Button>
            </Group>
        </Stack>
    );
};
