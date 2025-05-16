import { AppShellHeader, Burger, Group, Text } from "@mantine/core";
import { ColorSchemeToggle } from "..";
import { FullscreenToggle } from "../FullScreenToggle";
import { BreadCrumbs } from "../page/BreadCrumbs";

export const Header = ({
    navbar,
}: {
    navbar: { opened: boolean; toggle: () => void };
}) => (
    <AppShellHeader>
        <Group p="sm" w="100%" h="100%" justify="space-between" align="center">
            <Group>
                <Burger
                    opened={navbar.opened}
                    onClick={navbar.toggle}
                    hiddenFrom="sm"
                />
                <BreadCrumbs />
            </Group>
            <Group>
                <FullscreenToggle />
                <ColorSchemeToggle />
            </Group>
        </Group>
    </AppShellHeader>
);
