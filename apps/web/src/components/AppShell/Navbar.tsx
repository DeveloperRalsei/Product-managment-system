import {
    AppShellNavbar,
    AppShellSection,
    Avatar,
    NavLink,
    Stack,
} from "@mantine/core";
import { links } from "@/data/routing";
import { Link } from "@tanstack/react-router";
import { getUser } from "@/utils/user";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";

export const Navbar = () => {
    const { data: user, isPending } = useQuery({
        queryFn: getUser,
        queryKey: ["user"],
    });

    return (
        <AppShellNavbar component={Stack}>
            <AppShellSection flex={1}>
                {links.map((l, i) => (
                    <NavLink
                        key={"navlink" + l.label + i}
                        rightSection={l.icon}
                        component={Link}
                        to={l.path}
                        label={l.label}
                    />
                ))}
            </AppShellSection>
        </AppShellNavbar>
    );
};
