import { Button, Container, Group, Stack, Text } from "@mantine/core";
import {
    IconAlertTriangleFilled,
    IconHome,
    IconReload,
} from "@tabler/icons-react";
import { ErrorRouteComponent, Link } from "@tanstack/react-router";

export const ErrorComponent: ErrorRouteComponent = ({ error }) => {
    return (
        <Stack mih="100vh" align="center" justify="center">
            <IconAlertTriangleFilled />
            <Text fz="h4" c="red">
                Something went wrong
            </Text>
            <Group>
                <Button
                    component={Link}
                    to="/"
                    variant="default"
                    leftSection={<IconHome />}
                >
                    Return the Home Page
                </Button>
                <Button
                    onClick={() => window.location.reload()}
                    leftSection={<IconReload />}
                >
                    Refrest the Page
                </Button>
            </Group>
            <Container>
                <Text c="yellow">{error.name}</Text>
                {"Message: "}

                <Text c="dimmed" span>
                    {error.message}
                </Text>
                <Text ta="center" fz="h5" fw="bold">
                    Please report this to developers
                </Text>
            </Container>
        </Stack>
    );
};
