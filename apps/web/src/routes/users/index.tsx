import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { UsersTable, UserTableLoading } from "@/components/ui/users/UsersTable";
import { getUsers } from "@/utils/user";
import { Divider, Stack, TextInput } from "@mantine/core";
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
