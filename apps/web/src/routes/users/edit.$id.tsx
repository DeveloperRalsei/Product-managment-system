import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/edit/$id")({
    component: RouteComponent,
});

function RouteComponent() {
    const { id } = Route.useParams();
    return <div>Hello "/users/edit"! with user id = {id}</div>;
}
