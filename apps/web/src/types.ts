import { FileRouteTypes } from "@/routeTree.gen";

type parentNavLink = {
    label: string;
    path: FileRouteTypes["to"];
};

type childNavLink = {
    label: string;
    childs: parentNavLink[];
};

export type navLink = parentNavLink | childNavLink;
