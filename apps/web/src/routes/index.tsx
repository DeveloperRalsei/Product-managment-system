import { Stack } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useBreadCrumbs } from "@/components/ui/page/BreadCrumbs";
import { useEffect } from "react";
import { AreaChart } from "@mantine/charts";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { change } = useBreadCrumbs();

    useEffect(() => {
        change([{ label: "Ana sayfa", to: "/" }]);
    }, []);

    return (
        <Stack p="xl">
            <AreaChart
                data={[
                    { test: "1", shoot: 2200, meow: 12 },
                    { test: "2", shoot: 3, meow: 32 },
                    { test: "3", shoot: 0, meow: 123 },
                ]}
                series={[
                    { name: "shoot", color: "red" },
                    { name: "meow", color: "yellow" },
                ]}
                dataKey="shoot"
                h={200}
                w={500}
            />
        </Stack>
    );
}
