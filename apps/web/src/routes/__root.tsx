import { AppShell, Space } from "@mantine/core";
import {
    createRootRoute,
    Outlet,
    redirect,
    useLocation,
} from "@tanstack/react-router";
import {
    ErrorComponent,
    Header,
    Navbar,
    NotFoundComponent,
} from "../components";
import { useDisclosure } from "@mantine/hooks";
import { isAuthenticated } from "@/utils/user";
import { BreadCrumbs } from "@/components/AppShell/Breadcrumbs";

function redirectLogin(redirectPath: string = "/") {
    throw redirect({
        to: "/login",
        search: {
            redirect: redirectPath,
        },
        reloadDocument: true,
    });
}

export const Route = createRootRoute({
    component: RootComponent,
    errorComponent: ErrorComponent,
    notFoundComponent: NotFoundComponent,
    async beforeLoad({ location }) {
        try {
            const auth = await isAuthenticated();
            if (!auth && location.pathname !== "/login") {
                redirectLogin(location.pathname);
            }
        } catch (err) {
            redirectLogin(location.pathname);
        }
    },
});

function RootComponent() {
    const [navbarOpened, { toggle }] = useDisclosure();
    const { pathname } = useLocation();

    if (pathname === "/login") {
        return <Outlet />;
    }

    return (
        <AppShell
            header={{
                height: 60,
            }}
            navbar={{
                breakpoint: "sm",
                width: 240,
                collapsed: {
                    desktop: false,
                    mobile: !navbarOpened,
                },
            }}
        >
            <Header
                navbar={{
                    opened: navbarOpened,
                    toggle,
                }}
            />
            <Navbar />
            <AppShell.Main>
                <BreadCrumbs />
                <Outlet />
                <Space h="200vh" />
            </AppShell.Main>
        </AppShell>
    );
}
