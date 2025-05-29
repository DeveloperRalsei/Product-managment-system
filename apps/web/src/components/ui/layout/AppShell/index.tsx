import { AppShell } from "@mantine/core";
import { PropsWithChildren } from "react";
import { Header } from "./Header";
import { Navbar } from "./Navbar";
import { useDisclosure } from "@mantine/hooks";

export const Layout = ({ children }: PropsWithChildren) => {
    const [navbarOpened, { toggle, close }] = useDisclosure();
    return (
        <AppShell
            header={{
                height: 60,
            }}
            navbar={{
                breakpoint: "sm",
                width: 240,
                collapsed: {
                    desktop: false,
                    mobile: !navbarOpened,
                },
            }}
        >
            <Header
                navbar={{
                    opened: navbarOpened,
                    toggle,
                }}
            />
            <Navbar close={close} />
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
};

export * from "./Header";
export * from "./Navbar";
