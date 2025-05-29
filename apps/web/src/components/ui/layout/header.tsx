import { AppShellHeader, Burger, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { BreadCrumbs } from "../page/BreadCrumbs";
import { ColorSchemeToggle, FullscreenToggle } from "../buttons";

export const HeaderLayout = ({
    navbarToggle,
    navbarOpened,
}: {
    navbarToggle: () => void;
    navbarOpened: boolean;
}) => {
    const matches = useMediaQuery("(min-width: 48em)");

    return (
        <AppShellHeader>
            <Group
                h="100%"
                w="100%"
                justify="space-between"
                align="center"
                p="md"
            >
                <Group ms={matches ? 85 : 0}>
                    <Burger
                        opened={navbarOpened}
                        onClick={navbarToggle}
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
};
