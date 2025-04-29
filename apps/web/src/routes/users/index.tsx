import { wait } from "#";
import { UsersTable, UserTableLoading } from "@/components/ui/UsersTable";
import { getUsers } from "@/utils/user";
import { Divider, Stack, TextInput, Title } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/users/")({
    component: RouteComponent,
});

function RouteComponent() {
    const [search, setSearch] = useState("");
    const {
        isPending,
        data: users,
        refetch,
    } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            nprogress.start();
            const users = await getUsers();
            nprogress.complete();
            return users;
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
        <Stack p="lg">
            <Title order={2}>Kullanıcılar</Title>
            <Divider />
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
    );
}
