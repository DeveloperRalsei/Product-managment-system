import { createContext, useContext, useState } from "react";
import {
    BreadcrumbsProps,
    Button,
    Breadcrumbs as MantineBreadCrumbs,
} from "@mantine/core";
import { Link, LinkProps } from "@tanstack/react-router";

type BreadCrumb = {
    label: string;
    to: LinkProps["to"];
    params?: LinkProps["params"] | any;
};

type BreadCrumbsContextType = {
    breadCrumbs: BreadCrumb[];
    change: (breadCrumbs: BreadCrumb[]) => void;
};

const BreadCrumbsContext = createContext<BreadCrumbsContextType | null>(null);

export const BreadCrumbsProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [breadCrumbs, setBreadCrumbs] = useState<BreadCrumb[]>([]);

    const change: BreadCrumbsContextType["change"] = (b) => setBreadCrumbs(b);

    return (
        <BreadCrumbsContext.Provider
            value={{
                breadCrumbs,
                change,
            }}
        >
            {children}
        </BreadCrumbsContext.Provider>
    );
};

export const useBreadCrumbs = () => {
    const ctx = useContext(BreadCrumbsContext);
    if (!ctx)
        throw new Error(
            "Use useBreadCrumbs hook in a BreadCrumbsProvider parent component",
        );
    return ctx;
};

export const BreadCrumbs = ({
    ...props
}: Omit<BreadcrumbsProps, "children">) => {
    const { breadCrumbs } = useBreadCrumbs();
    return (
        <MantineBreadCrumbs {...props}>
            {breadCrumbs.map((b, i) => (
                <Button
                    size="compact-lg"
                    variant="subtle"
                    component={Link}
                    to={b.to}
                    params={b.params}
                    key={b.label + i}
                >
                    {b.label}
                </Button>
            ))}
        </MantineBreadCrumbs>
    );
};
