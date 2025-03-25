import { createContext, useContext, useState, useEffect } from "react";
import {
    AppShellSection,
    BreadcrumbsProps,
    Breadcrumbs as MantineBreadCrumbs,
    Text,
} from "@mantine/core";
import { FileRouteTypes } from "@/routeTree.gen";
import { Link } from "@tanstack/react-router";
import { useHover } from "@mantine/hooks";

type BreadCrumbType = {
    label: string;
    to: FileRouteTypes["to"];
};

type BreadcrumbsContextType = {
    breadCrumbs: BreadCrumbType[];
    setBreadCrumbs: (v: BreadCrumbType[]) => void;
};

const BreadcrumbsContext = createContext<BreadcrumbsContextType>({
    breadCrumbs: [
        {
            label: "/",
            to: "/",
        },
    ],
    setBreadCrumbs: () => {},
});

export const BreadcrumbsProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [breadCrumbValues, setBreadCrumbValues] = useState<BreadCrumbType[]>([
        {
            label: "/",
            to: "/",
        },
    ]);

    const setBreadCrumbs = (v: BreadCrumbType[]) => setBreadCrumbValues(v);

    return (
        <BreadcrumbsContext.Provider
            value={{
                breadCrumbs: breadCrumbValues,
                setBreadCrumbs,
            }}
        >
            {children}
        </BreadcrumbsContext.Provider>
    );
};

export const useBreadCrumbs = (v: BreadCrumbType[]) => {
    const { breadCrumbs, setBreadCrumbs } = useContext(BreadcrumbsContext);
    useEffect(() => {
        const isSame =
            breadCrumbs.length === v.length &&
            breadCrumbs.every(
                (b, i) => b.label === v[i].label && b.to === v[i].to,
            );

        if (!isSame) {
            setBreadCrumbs(v);
        }
    }, [v, setBreadCrumbs]);
};

export const BreadCrumbs = ({
    ...rest
}: Omit<BreadcrumbsProps, "children">) => {
    const { breadCrumbs } = useContext(BreadcrumbsContext);
    const { ref, hovered } = useHover();

    return (
        <AppShellSection bd={"1px solid var(--app-shell-border-color)"} p="sm">
            <MantineBreadCrumbs {...rest}>
                <Text component={Link} to="/" c="dimmed" className="hover-text">
                    Home
                </Text>
                {breadCrumbs.map((b, i) => (
                    <Text
                        key={b.label + i}
                        ref={ref}
                        c={hovered ? "white" : "dimmed"}
                        component={Link}
                        to={b.to}
                    >
                        {b.label}
                    </Text>
                ))}
            </MantineBreadCrumbs>
        </AppShellSection>
    );
};
