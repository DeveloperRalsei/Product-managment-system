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
import { useNavigate } from "@tanstack/react-router";
import { logout, useUser } from "@/utils/api/auth";
import { IconLogout } from "@tabler/icons-react";
import { openConfirmModal } from "@mantine/modals";
import { useState } from "react";

export const Navbar = ({ close }: { close: () => void }) => {
    const [active, setActive] = useState(0);
    const [childActive, setChildActive] = useState<null | number>(null);
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

    const handleClose = (path: string, activeIndex: number) => {
        setActive(activeIndex);
        setChildActive(null);
        close();
        navigate({
            to: path,
        });
    };

    return (
        <AppShellNavbar>
            <AppShellSection component={Stack} gap={0} grow>
                {links.map((link, i) => {
                    if ("childs" in link) {
                        return (
                            <NavLink
                                key={link.label + i}
                                label={link.label}
                                leftSection={
                                    link.icon ? <link.icon /> : undefined
                                }
                                active={i === active}
                            >
                                {link.childs.map((childLink, j) => (
                                    <NavLink
                                        key={childLink.label + i + j}
                                        label={childLink.label}
                                        onClick={() => {
                                            handleClose(childLink.path, i);
                                            setChildActive(j);
                                        }}
                                        active={
                                            i === active && j === childActive
                                        }
                                    />
                                ))}
                            </NavLink>
                        );
                    }

                    return (
                        <NavLink
                            key={link.label + i}
                            label={link.label}
                            leftSection={link.icon ? <link.icon /> : undefined}
                            active={i === active}
                            onClick={() => handleClose(link.path, i)}
                        />
                    );
                })}
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
