import { useBreadCrumbs } from "@/components";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
    component: RouteComponent,
});

function RouteComponent() {
    useBreadCrumbs([
        {
            label: "/",
            to: "/test",
        },
    ]);
    return <div>Hello "/test"!</div>;
}
