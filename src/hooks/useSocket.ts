import { useEffect, useState } from "react";
import { socketInitializer } from "@/helpers/socketIO";

const useSocket = () => {
    const [socket, setSocket] = useState<any>();
    const [isServerConnected, setIsServerConnected] = useState(false);

    useEffect(() => {
        const initSocket = async () => {
            const socket = await socketInitializer();

            if (!socket) {
                console.log("Failed to initialize socket");
                return;
            }
            setSocket(socket);

            socket.on("connect", () => {
                setIsServerConnected(true);
            });

            socket.on("disconnect", () => {
                console.log("Disconnected from server");
                setIsServerConnected(false);
            });
        };

        initSocket();
    }, []);

    return { socket, isServerConnected };
};

export default useSocket;
