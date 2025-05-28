import { PropsWithChildren, useState } from "react";
import {
    IconCalendarStats,
    IconDeviceDesktopAnalytics,
    IconFingerprint,
    IconGauge,
    IconHome2,
    IconLogout,
    IconSettings,
    IconSwitchHorizontal,
    IconUser,
} from "@tabler/icons-react";
import {
    Box,
    Center,
    Flex,
    Group,
    Menu,
    Stack,
    Tooltip,
    UnstyledButton,
} from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./layout.module.css";
import { routes } from "@/data/routing";
import { useNavigate } from "@tanstack/react-router";
import { navLink } from "@/types";

interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    return (
        <Tooltip
            label={label}
            position="right"
            transitionProps={{ duration: 0 }}
        >
            <UnstyledButton
                onClick={onClick}
                className={classes.link}
                data-active={active || undefined}
            >
                <Icon size={20} stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

export function NavbarLayout({ children }: PropsWithChildren) {
    const [active, setActive] = useState(0);
    const navigate = useNavigate();

    const links = routes.map((link, index) =>
        "childs" in link ? (
            <Menu withArrow withinPortal>
                <Menu.Target>
                    <NavbarLink
                        {...link}
                        active={active === index}
                        onClick={() => setActive(index)}
                    />
                </Menu.Target>
                <Menu.Dropdown>
                    {link.childs.map((child) => (
                        <Menu.Item
                            key={child.label}
                            onClick={() => navigate({ to: child.path })}
                        >
                            {child.label}
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>
        ) : (
            <NavbarLink
                {...link}
                active={active === index}
                onClick={() => {
                    setActive(index);
                    navigate({
                        to: link.path,
                    });
                }}
            />
        ),
    );

    return (
        <Flex>
            <nav className={classes.navbar}>
                <Center>
                    <MantineLogo type="mark" size={30} />
                </Center>

                <div className={classes.navbarMain}>
                    <Stack justify="center" gap={0}>
                        {links}
                    </Stack>
                </div>

                <Stack justify="center" gap={0}>
                    <NavbarLink
                        icon={IconSwitchHorizontal}
                        label="Change account"
                    />
                    <NavbarLink icon={IconLogout} label="Logout" />
                </Stack>
            </nav>
            <Box ps={90}>{children}</Box>
        </Flex>
    );
}
