import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/categories/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { change } = useBreadCrumbs();

    useEffect(() => {
        change([{ label: "Kategoriler", to: "/categories" }]);
    }, []);
    return <div>Hello "/categories/"!</div>;
}
