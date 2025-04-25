import { User } from "#";
import { getUsers } from "@/utils/user";
import { CodeHighlight } from "@mantine/code-highlight";
import { Stack, TextInput, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconExclamationCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/users/")({
    component: RouteComponent,
});

function RouteComponent() {
    const [search, setSearch] = useState("");
    const [isUnVerifiedExist, setIsUnverifiedExist] = useState(false);
    const { isPending, data: users } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });

    if (users && !isPending && users.some((user) => !user.verified)) {
        showNotification({
            message:
                "Uyarı! Onaylanmamış kullanıcılarınız var. Sistemi kullanmasını istiyorsanız lütfen bu kullanıcıların email'lerini onaylayın",
            color: "orange",
        });
    }

    const filteredUsers = search
        ? users?.filter((v) =>
              [v.email, v.name]
                  .filter((x) => x)
                  .join(" ")
                  .toLowerCase()
                  .includes(search.toLowerCase()),
          )
        : users;

    return (
        <Stack>
            <TextInput
                placeholder="Kullanıcı ara..."
                onChange={(e) => setSearch(e.target.value)}
            />
            {isPending ? (
                <Text>Yükleniyor...</Text>
            ) : (
                <CodeHighlight
                    code={JSON.stringify(filteredUsers, null, 4)}
                    language="json"
                />
            )}
        </Stack>
    );
}
