import {
    ActionIcon,
    AppShellNavbar,
    AppShellSection,
    Group,
    NavLink,
    Skeleton,
    Stack,
    Text,
} from "@mantine/core";
import { links } from "apps/web/src/data/routing";
import { Link, useNavigate } from "@tanstack/react-router";
import { logout, useUser } from "@/utils/auth";
import { IconLogout } from "@tabler/icons-react";
import { openConfirmModal } from "@mantine/modals";

export const Navbar = () => {
    const { user, loading } = useUser();
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

    return (
        <AppShellNavbar>
            {/* <AppShellSection>Nav Head</AppShellSection> */}
            <AppShellSection component={Stack} gap={0} grow>
                {links.map((l, i) => (
                    <NavLink
                        key={"navlink" + l.label + i}
                        rightSection={l.icon}
                        component={Link}
                        to={l.path}
                        label={l.label}
                    />
                ))}
            </AppShellSection>
            <AppShellSection
                p="sm"
                bd="1px solid var(--app-shell-border-color)"
            >
                {loading && !user ? (
                    <Skeleton w="100%" h={25} />
                ) : (
                    <Group>
                        <Stack gap={5}>
                            <Text>{user?.name}</Text>
                            <Text c="dimmed"> {user?.email}</Text>
                        </Stack>
                        <ActionIcon onClick={handleLogout}>
                            <IconLogout />
                        </ActionIcon>
                    </Group>
                )}
            </AppShellSection>
        </AppShellNavbar>
    );
};
