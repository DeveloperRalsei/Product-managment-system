import { Stack, Text, Title, Group, Button, Code } from "@mantine/core";
import { IconHome, IconReload } from "@tabler/icons-react";
import { ErrorRouteComponent, Link } from "@tanstack/react-router";

export const ErrorComponent: ErrorRouteComponent = ({ error, reset, info }) => {
    return (
        <Stack align="center" justify="center" h="100%">
            <Title order={3} c="red">
                Bir şey ters gitti
            </Title>
            <Text c="dimmed">Lütfen bunu geliştiricilere bildirin</Text>
            <Group>
                <Button component={Link} to="/" leftSection={<IconHome />}>
                    Ana Sayfaya Dön
                </Button>
                <Button
                    onClick={() => location.reload()}
                    leftSection={<IconReload />}
                >
                    Sayfayı Yenile
                </Button>
                <Button onClick={reset}>Reset</Button>
            </Group>
            <Stack>
                <Text>ErrorName: {error.name}</Text>
                <Code block>{error.message}</Code>
                {info && <Text>Info: {info.componentStack}</Text>}
            </Stack>
        </Stack>
    );
};
