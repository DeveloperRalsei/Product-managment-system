import {
    createRootRoute,
    Outlet,
    redirect,
    useLocation,
} from "@tanstack/react-router";
import { Layout, NotFoundComponent } from "../components";
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
            if (!auth && !location.pathname.startsWith("/login")) {
                redirectLogin(location.pathname);
            }
        } catch (err) {
            redirectLogin(location.pathname);
        }
    },
});

function RootComponent() {
    const { pathname } = useLocation();

    if (pathname.startsWith("/login")) return <Outlet />;

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}
