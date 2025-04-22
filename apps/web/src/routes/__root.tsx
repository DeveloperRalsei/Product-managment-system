import { AppShell } from "@mantine/core";
import {
    createRootRoute,
    Outlet,
    redirect,
    useLocation,
} from "@tanstack/react-router";
import { Header, Navbar, NotFoundComponent } from "../components";
import { useDisclosure } from "@mantine/hooks";
import { isAuthenticated } from "@/utils/auth";
import { ErrorComponent } from "@/components/ui/page/ErrorComponent";

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
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
    beforeLoad: async ({ location }) => {
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

    if (pathname === "/login") return <Outlet />;

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
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
