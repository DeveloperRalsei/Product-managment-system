import React from "react";
import { MantineProvider } from "@mantine/core";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./styles.css";

import { routeTree } from "./routeTree.gen";
import { theme } from "./config/theme";
import { UserProvider } from "./components/user";
import { Notifications } from "@mantine/notifications";
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
            <QueryClientProvider client={queryClient}>
                <UserProvider>
                    <RouterProvider router={router} />
                    <Notifications position="bottom-right" />
                </UserProvider>
            </QueryClientProvider>
        </MantineProvider>
    </React.StrictMode>,
);
