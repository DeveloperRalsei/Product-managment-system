import { PropsWithChildren, useState } from "react";
import {
    IconHome2,
    IconLogout,
    IconSwitchHorizontal,
} from "@tabler/icons-react";
import {
    AppShellNavbar,
    AppShellSection,
    Box,
    Center,
    Divider,
    Menu,
    Stack,
    Tooltip,
    UnstyledButton,
} from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./navbar.module.css";
import { routes } from "@/data/routing";
import { useNavigate } from "@tanstack/react-router";
import { logout } from "@/utils/api/auth";
import { openConfirmModal } from "@mantine/modals";

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

export function NavbarLayout() {
    const [active, setActive] = useState(0);
    const navigate = useNavigate();

    const handleLogout = () => {
        openConfirmModal({
            title: "Uyarı",
            children: "Çıkış yapmak istediğinize emin misiniz?",
            confirmProps: {
                color: "red",
            },
            onConfirm: async () => {
                await logout();
                navigate({
                    to: "/login",
                    search: {
                        redirect: "/",
                    },
                    reloadDocument: true,
                });
            },
        });
    };

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
        <AppShellNavbar className={classes.navbar}>
            <Center>
                <MantineLogo type="mark" size={30} />
            </Center>
            <Divider my="md" />

            <AppShellSection component={Stack} flex={1}>
                <Stack justify="center" gap={4}>
                    {links}
                </Stack>
            </AppShellSection>

            <Stack justify="center" gap={0} mb="xl">
                <NavbarLink
                    icon={IconLogout}
                    label="Logout"
                    onClick={handleLogout}
                />
            </Stack>
        </AppShellNavbar>
    );
}

export * from "./mobile";
