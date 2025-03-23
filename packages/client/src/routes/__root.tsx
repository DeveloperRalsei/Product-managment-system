import { AppShell } from "@mantine/core";
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

function redirectLogin() {
    throw redirect({
        to: "/login",
        search: {
            redirect: location.pathname,
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
            if (!isAuthenticated() && location.pathname !== "/login") {
                redirectLogin();
            }
        } catch (err) {
            redirectLogin();
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
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
