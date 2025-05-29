import { CSSProperties, useState } from "react";
import { IconHome2, IconLogout } from "@tabler/icons-react";
import {
    AppShellNavbar,
    AppShellSection,
    Box,
    Center,
    Divider,
    NavLink,
    Stack,
    Tooltip,
    Transition,
    UnstyledButton,
    useMantineColorScheme,
} from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./navbar.module.css";
import { routes } from "@/data/routing";
import { useNavigate } from "@tanstack/react-router";
import { logout } from "@/utils/api/auth";
import { openConfirmModal } from "@mantine/modals";
import { parentNavLink } from "@/types";

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
    const [childsBarMounted, setChildsBarMounted] = useState(false);
    const [childRoutes, setChildRoutes] = useState<parentNavLink[]>([]);
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

    const handleNavigation = (to: string, activeIndex: number) => {
        close();
        navigate({ to });
        setActive(activeIndex);
    };

    return (
        <AppShellNavbar className={classes.navbar}>
            <Center>
                <MantineLogo type="mark" size={30} />
            </Center>
            <Divider my="md" />

            <AppShellSection component={Stack} flex={1}>
                <Stack justify="center" gap={4}>
                    {routes.map((route, i) => (
                        <NavbarLink
                            icon={route.icon}
                            label={route.label}
                            active={active === i}
                            key={route.label}
                            onClick={
                                "childs" in route
                                    ? () => {
                                          setActive(i);
                                          setChildRoutes(route.childs);
                                          setChildsBarMounted((p) => !p);
                                      }
                                    : () => handleNavigation(route.path, i)
                            }
                        />
                    ))}
                </Stack>
            </AppShellSection>

            <Stack justify="center" gap={0}>
                <NavbarLink
                    icon={IconLogout}
                    label="Logout"
                    onClick={handleLogout}
                />
            </Stack>
            <Transition mounted={childsBarMounted} transition="fade-right">
                {(styles) => (
                    <ChildsBar
                        close={() => setChildsBarMounted(false)}
                        styles={styles}
                        routes={childRoutes}
                    />
                )}
            </Transition>
        </AppShellNavbar>
    );
}

function ChildsBar({
    routes,
    styles,
    close,
}: {
    routes: parentNavLink[];
    styles: CSSProperties;
    close: () => void;
}) {
    const navigate = useNavigate();
    const { colorScheme } = useMantineColorScheme();

    const handleNavigate = (to: string) => {
        navigate({ to });
        close();
    };

    return (
        <Box
            className={classes.navbar}
            style={styles}
            pos="fixed"
            top={0}
            left={80}
            w={150}
            h="100vh"
            p="xs"
            bg={colorScheme === "dark" ? "dark" : "#fff"}
        >
            {routes.map((r) => (
                <NavLink
                    label={r.label}
                    onClick={() => handleNavigate(r.path)}
                />
            ))}
        </Box>
    );
}

export * from "./mobile";
