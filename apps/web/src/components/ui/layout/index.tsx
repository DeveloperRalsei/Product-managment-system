import { AppShell, Box } from "@mantine/core";
import { PropsWithChildren } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { HeaderLayout } from "./header";
import { MobileNavbarLayout, NavbarLayout } from "./navbar";

export const Layout = ({ children }: PropsWithChildren) => {
    const [collapsed, { toggle, close }] = useDisclosure();
    const matches = useMediaQuery("(min-width: 48em)");

    return (
        <AppShell
            navbar={{
                width: 80,
                breakpoint: "sm",
                collapsed: { mobile: !collapsed, desktop: false },
            }}
            header={{
                height: 60,
                offset: !matches,
            }}
        >
            {matches ? <NavbarLayout /> : <MobileNavbarLayout close={close} />}
            <HeaderLayout navbarOpened={collapsed} navbarToggle={toggle} />
            <AppShell.Main mt={matches ? 59 : 0}>
                <Box p="md">{children}</Box>
            </AppShell.Main>
        </AppShell>
    );
};
