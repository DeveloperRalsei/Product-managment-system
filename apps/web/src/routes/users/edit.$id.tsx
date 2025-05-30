import { UserFormValues } from "@/components/ui/form/user";
import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { getUserById, updateUser } from "@/utils/api/user";
import { Alert, Divider, Stack, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconExclamationCircle } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";

const UserForm = lazy(() =>
    import("@/components/ui/form/user").then((mod) => ({
        default: mod.UserForm,
    })),
);

export const Route = createFileRoute("/users/edit/$id")({
    component: RouteComponent,
    loader: ({ params: { id } }) => getUserById(id),
    pendingComponent: () => "yükleniyor...",
});

function RouteComponent() {
    const { change } = useBreadCrumbs();
    const user = Route.useLoaderData();

    useEffect(() => {
        change([
            { label: "Kullanıcılar", to: "/users" },
            {
                label: "Düzenle",
                to: "/users/edit/$id",
                params: { id: user.id },
            },
        ]);
    }, []);

    const { mutate, isPending } = useMutation({
        mutationFn: ({ name, email, password, role }: UserFormValues) =>
            updateUser(user.id, { name, email, password, role }),
        onSuccess: (response) => {
            if (response.status === 401)
                return showNotification({
                    color: "red",
                    message: "Kullanıcı oluşturulamadı. Buna yetkiniz yok",
                });
            if (response.status === 409)
                return showNotification({
                    message: "Bu email zaten kullanım da",
                    color: "red",
                });
            if (!response.ok)
                return showNotification({
                    color: "red",
                    message: "Birşey ters gitti.",
                });
            showNotification({
                message: "Kullanıcı güncellendi",
                color: "green",
            });
        },
        onError: (error) => {
            console.error(error.message);
            showNotification({
                message: "Birşey ters gitti!",
                color: "red",
            });
        },
    });
    return (
        <Stack m="md">
            <Title order={3}>Düzenle</Title>
            <Alert icon={<IconExclamationCircle />} color="orange">
                Uyarı! Kullanıcı değiştikten sonra tekrar emailin tekrar
                onaylanması gerekmektedir.
            </Alert>
            <Divider />
            <Suspense fallback="yükleniyor...">
                <UserForm
                    initialValues={user}
                    onSubmit={mutate}
                    isPending={isPending}
                />
            </Suspense>
        </Stack>
    );
}
