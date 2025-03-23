import { Text, Button, Group, Stack } from "@mantine/core";
import { IconHome, IconReload } from "@tabler/icons-react";
import { Link, NotFoundRouteComponent } from "@tanstack/react-router";

export const NotFoundComponent: NotFoundRouteComponent = ({}) => (
    <Stack mih="100vh" align="center" justify="center">
        <Text fw="bold" fz="h2" c="yellow">
            404
        </Text>
        <Text fz="h4" c="red">
            You're in a wrong place
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
    </Stack>
);
