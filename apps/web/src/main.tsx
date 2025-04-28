import React from "react";
import { MantineProvider } from "@mantine/core";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { theme } from "./config/theme";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { NavigationProgress } from "@mantine/nprogress";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/code-highlight/styles.css";
import "@mantine/nprogress/styles.css";
import "./styles.css";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const queryClient = new QueryClient();

createRoot(document.getElementById("app")!).render(
    <React.StrictMode>
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <ModalsProvider
                labels={{
                    cancel: "İptal Et",
                    confirm: "Onayla",
                }}
                modalProps={{
                    centered: true,
                }}
            >
                <QueryClientProvider client={queryClient}>
                    <NavigationProgress />
                    <RouterProvider router={router} />
                    <Notifications />
                </QueryClientProvider>
            </ModalsProvider>
        </MantineProvider>
    </React.StrictMode>,
);
