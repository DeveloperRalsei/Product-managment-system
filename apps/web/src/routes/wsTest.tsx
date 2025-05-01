import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/wsTest")({
    component: RouteComponent,
});

function RouteComponent() {
    const [loading, setLoading] = useState(true);
    const [ws, setWs] = useState<WebSocket>();

    useEffect(() => {
        const newWs = new WebSocket("ws://localhost:3000/ws");

        newWs.onopen = () => {
            console.log("WebSocket bağlantısı açıldı");
            setLoading(false);
        };

        newWs.onmessage = (event) => {
            console.log("Mesaj alındı:", event.data);
        };

        newWs.onclose = () => {
            console.log("WebSocket bağlantısı kapandı");
        };

        setWs(newWs);

        ws?.send("uwu");

        return () => {
            newWs.close();
        };
    }, []);

    return <>{loading ? "Bağlanıyor..." : "WebSocket bağlı!"}</>;
}
