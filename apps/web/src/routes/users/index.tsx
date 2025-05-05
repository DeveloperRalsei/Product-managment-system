import { User } from "#";
import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import {
    UsersTable,
    UserTableLoading,
} from "@/components/ui/tables/users/users-table";
import { getUsers } from "@/utils/api/user";
import { Divider, Stack, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/users/")({
    component: RouteComponent,
});

function RouteComponent() {
    const [search, setSearch] = useState("");

    const { change } = useBreadCrumbs();
    useEffect(() => {
        change([{ label: "Kullanıcılar", to: "/users" }]);
    }, []);

    const {
        isPending,
        data: users,
        refetch,
    } = useQuery({
        queryKey: ["users"],
        queryFn: async (): Promise<User[]> => {
            nprogress.start();
            const res = await getUsers();
            if (res.status === 401) {
                showNotification({
                    message: "Buna yetkiniz yok",
                    color: "red",
                });
                nprogress.complete();
                return [];
            }
            if (!res.ok) {
                showNotification({
                    message: "Birşey ters gitti",
                    color: "red",
                });
                nprogress.complete();
                return [];
            }
            nprogress.complete();
            return await res.json();
        },
    });

    const filteredUsers = search
        ? users?.filter((v, i) =>
              [v.email, v.name, i + 1]
                  .filter((x) => x)
                  .join(" ")
                  .toLowerCase()
                  .includes(search.toLowerCase()),
          )
        : users;

    return (
        <>
            <Divider />
            <Stack p="lg">
                <TextInput
                    placeholder="Kullanıcı ara..."
                    onChange={(e) => setSearch(e.target.value)}
                />
                {isPending ? (
                    <UserTableLoading />
                ) : (
                    <UsersTable
                        users={filteredUsers || []}
                        refetchFunction={refetch}
                    />
                )}
            </Stack>
        </>
    );
}
