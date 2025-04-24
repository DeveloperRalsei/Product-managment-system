import { User, wait } from "#";
import { getUsers } from "@/utils/user";
import { Stack, TextInput, Text } from "@mantine/core";
import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/users/")({
    component: RouteComponent,
});

function RouteComponent() {
    const [users, setUsers] = useState<User[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsers().then((data) => {
            setUsers(data);
            setLoading(false);
        });
    }, []);

    return (
        <Stack>
            <TextInput placeholder="Kullanıcı ara..." />
            {loading ? (
                <Text>Yükleniyor...</Text>
            ) : (
                <pre>{JSON.stringify(users, null, 4)}</pre>
            )}
        </Stack>
    );
}
