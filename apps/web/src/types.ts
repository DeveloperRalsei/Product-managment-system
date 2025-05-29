import { FileRouteTypes } from "@/routeTree.gen";

export type parentNavLink = {
    label: string;
    path: FileRouteTypes["to"];
};

type childNavLink = {
    label: string;
    childs: parentNavLink[];
};

export type navLink = parentNavLink | childNavLink;
