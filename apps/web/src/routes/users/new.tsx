import { UserFormValues } from "@/components/ui/form/user";
import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { createUser } from "@/utils/user";
import { Alert, Anchor, Divider, Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconExclamationCircle } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const UserForm = lazy(() =>
    import("@/components/ui/form/user").then((mod) => ({
        default: mod.UserForm,
    })),
);

export const Route = createFileRoute("/users/new")({
    component: RouteComponent,
});

function RouteComponent() {
    const [warningActive, setWarningActive] = useState(true);
    const { change } = useBreadCrumbs();
    useEffect(() => {
        change([
            { label: "Kullanıcılar", to: "/users" },
            { label: "Yeni", to: "/users/new" },
        ]);
    }, []);
    const { mutate, isPending } = useMutation({
        mutationFn: (formValues: UserFormValues) =>
            createUser({
                name: formValues.name,
                email: formValues.email,
                password: formValues.password,
                role: formValues.role,
            }),
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
                message: "Kullanıcı oluşturuldu",
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
        <>
            <Divider />
            <Stack p="sm">
                <Alert
                    title="Uyarı"
                    color="orange"
                    withCloseButton
                    onClose={() => setWarningActive(false)}
                    hidden={!warningActive}
                    icon={<IconExclamationCircle />}
                >
                    Lütfen yeni bir kullanıcı eklediğinizde, kullanıcı kimlik
                    bilgilerine erişe bilen herkesin sisteme girebildiğiniz
                    unutmayın. Herhangi acil bir durumda{" "}
                    <Anchor component={Link} to="/users">
                        listeleme
                    </Anchor>{" "}
                    ekranından silebilirsiniz.
                </Alert>
                <Suspense fallback="Yükleniyor...">
                    <UserForm
                        initialValues={{
                            name: "",
                            email: "",
                            password: "",
                            role: "USER",
                        }}
                        isPending={isPending}
                        onSubmit={mutate}
                    />
                </Suspense>
            </Stack>
        </>
    );
}
