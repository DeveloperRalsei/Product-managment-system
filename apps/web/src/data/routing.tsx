import {
    IconHome,
    IconList,
    IconShoppingCart,
    IconUsers,
} from "@tabler/icons-react";
import { navLink } from "../types";

export const routes: (navLink & { icon: typeof IconHome })[] = [
    {
        label: "Ana Sayfa",
        path: "/",
        icon: IconHome,
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

    {
        label: "Kategoriler",
        icon: IconList,
        childs: [
            {
                label: "Listele",
                path: "/categories",
            },
            {
                label: "Ekle",
                path: "/categories/new",
            },
        ],
    },
];
