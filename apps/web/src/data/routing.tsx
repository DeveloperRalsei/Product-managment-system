import { IconBook, IconUsers, TablerIconsProps } from "@tabler/icons-react";
import { navLink } from "../types";
import { IconHome } from "@tabler/icons-react";

export const links: (navLink & { icon?: React.FC<TablerIconsProps> })[] = [
    {
        label: "Kılavuz",
        path: "/",
        icon: IconBook,
    },

    {
        label: "Kullanıcılar",
        icon: IconUsers,
        childs: [
            {
                label: "Listele",
                path: "/users",
            },
            {
                label: "Ekle",
                path: "/users/new",
            },
        ],
    },
];
