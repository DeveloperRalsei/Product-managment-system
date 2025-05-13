import { User } from "#";
import {
    ActionIcon,
    Skeleton,
    Stack,
    Table,
    Text,
    Tooltip,
} from "@mantine/core";
import {
    IconCheck,
    IconPencil,
    IconSquareCheck,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import { openConfirmModal, openModal } from "@mantine/modals";
import { activateUser, deleteUserById } from "@/utils/api/user";
import { nprogress } from "@mantine/nprogress";
import { showNotification } from "@mantine/notifications";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { VerificationCodeEntry } from "./VerificationCodeEntry";

const roleValues: Record<User["role"], string> = {
    USER: "Kullanıcı",
    ADMIN: "Admin",
};

export const UsersTable = ({
    users,
    refetchFunction,
}: {
    users: User[];
    refetchFunction: () => void;
}) => {
    const [loading, setLoading] = useState(false);

    const sortedUsers = users.sort((u1, u2) => {
        if (u1.deleted && !u2.deleted) return 1;
        if (!u1.deleted && u2.deleted) return -1;
        if (!u1.verified && u2.verified) return 1;
        if (u1.verified && !u2.verified) return -1;
        const name1 = u1.name ?? "";
        const name2 = u2.name ?? "";

        if (name1 && name2) {
            return name1.localeCompare(name2);
        }
        if (name1) return -1;
        if (name2) return 1;

        return 0;
    });

    const handleVerification = () => {
        openModal({
            title: "Doğrula",
            children: (
                <>
                    <Text>
                        Kayıtlı E-mail'e gönderdiğimiz 6 haneli kodu giriniz
                    </Text>
                    <VerificationCodeEntry />
                </>
            ),
        });
    };

    const handlePermanentDelete = (id: string, nameOrEmail: string) => {
        const isEmail = nameOrEmail.includes("@");
        openConfirmModal({
            title: isEmail
                ? "Şu emaile sahip kullanıcıyı silmek istiyormusunuz?"
                : "Şu kullanıcıyı silmek istiyormusunuz?",
            children: (
                <Stack>
                    {nameOrEmail}
                    <Text span>
                        <span style={{ color: "var(--mantine-color-red-5)" }}>
                            Uyarı:{" "}
                        </span>
                        Bu işlem geri alınamaz ve kullanıcıya ait tüm veriler
                        kaybolacaktır!
                    </Text>
                </Stack>
            ),
            confirmProps: { color: "red" },
            async onConfirm() {
                nprogress.start();
                setLoading(true);
                const res = await deleteUserById("permanent", id);
                if (res.ok) {
                    showNotification({
                        message: "Kullanıcı Silindi",
                        color: "green",
                    });
                    nprogress.complete();
                    setLoading(false);
                    refetchFunction();
                    return;
                }
                showNotification({
                    message: "Birşey ters gitti",
                    color: "red",
                });
                nprogress.complete();
                setLoading(false);
                refetchFunction();
            },
        });
    };

    return (
        <Table.ScrollContainer minWidth="100%">
            <Table withRowBorders striped>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>#</Table.Th>
                        <Table.Th>İsim</Table.Th>
                        <Table.Th>E-Mail</Table.Th>
                        <Table.Th>Rol</Table.Th>
                        <Table.Th>Doğrulandı</Table.Th>
                        <Table.Th>Düzenle</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {sortedUsers.map((u, i) => (
                        <Table.Tr
                            key={u.email + i}
                            bg={u.deleted ? "rgba(255,0,0,0.1)" : undefined}
                        >
                            <Table.Th>{i + 1}</Table.Th>
                            <Table.Td>
                                {u.name ? (
                                    u.name
                                ) : (
                                    <Text c="dimmed" span>
                                        İsimsiz
                                    </Text>
                                )}
                            </Table.Td>
                            <Table.Td>{u.email}</Table.Td>
                            <Table.Td>{roleValues[u.role]}</Table.Td>
                            <Table.Td>
                                {u.verified ? <IconCheck /> : <IconX />}
                            </Table.Td>
                            <Table.Td>
                                <ActionIcon.Group>
                                    <Tooltip label="Düzenle">
                                        <ActionIcon
                                            size="lg"
                                            color="green"
                                            component={Link}
                                            to={`/users/edit/${u.id}`}
                                        >
                                            <IconPencil />
                                        </ActionIcon>
                                    </Tooltip>
                                    {!u.verified && (
                                        <Tooltip label="Doğrula">
                                            <ActionIcon
                                                onClick={async () =>
                                                    handleVerification()
                                                }
                                                color="grape"
                                                size="lg"
                                            >
                                                <IconSquareCheck />
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                    {u.deleted ? (
                                        <Tooltip label="Aktive Et">
                                            <ActionIcon
                                                onClick={async () => {
                                                    setLoading(true);
                                                    nprogress.start();
                                                    await activateUser(u.id);
                                                    nprogress.complete();
                                                    setLoading(false);
                                                    refetchFunction();
                                                }}
                                                size="lg"
                                                loading={loading}
                                                display={
                                                    !u.deleted
                                                        ? "none"
                                                        : undefined
                                                }
                                            >
                                                <IconCheck />
                                            </ActionIcon>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip label="Sil">
                                            <ActionIcon
                                                onClick={async () => {
                                                    nprogress.start();
                                                    setLoading(true);
                                                    await deleteUserById(
                                                        "delete",
                                                        u.id,
                                                    );
                                                    nprogress.complete();
                                                    setLoading(false);
                                                    refetchFunction();
                                                }}
                                                size="lg"
                                                color="red"
                                                loading={loading}
                                                display={
                                                    u.deleted
                                                        ? "none"
                                                        : undefined
                                                }
                                            >
                                                <IconTrash />
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                    <Tooltip label="Kalıcı olarak sil">
                                        <ActionIcon
                                            onClick={() =>
                                                handlePermanentDelete(
                                                    u.id,
                                                    u.name || u.email,
                                                )
                                            }
                                            loading={loading}
                                            color="dark.9"
                                            size="lg"
                                        >
                                            <IconTrash color="#fff" />
                                        </ActionIcon>
                                    </Tooltip>
                                </ActionIcon.Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                    {!users ||
                        (users.length === 0 && (
                            <Table.Tr>
                                <Table.Td colSpan={999} c="dimmed" ta="center">
                                    Kullanıcı Bulunamadı
                                </Table.Td>
                            </Table.Tr>
                        ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
};

export const UserTableLoading = () => (
    <Stack>
        {Array(15)
            .fill(0)
            .map((v, i) => (
                <Skeleton key={v + i} w="100%" h={50} />
            ))}
    </Stack>
);
