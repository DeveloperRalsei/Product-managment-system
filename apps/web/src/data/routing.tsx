import {
    IconBook,
    IconShoppingCart,
    IconUsers,
    TablerIconsProps,
} from "@tabler/icons-react";
import { navLink } from "../types";

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

    {
        label: "Ürünler",
        icon: IconShoppingCart,
        childs: [
            {
                label: "Listele",
                path: "/products",
            },
            {
                label: "Ekle",
                path: "/products/new",
            },
        ],
    },
];
