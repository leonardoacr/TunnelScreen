import { io } from "socket.io-client";

export const socketInitializer = async () => {
    try {
        try {
            console.log('Connecting to SocketIO Server...')
            await fetch("/api/socket");
        } catch (error) {
            console.log("error fetching the api: ", error);
            return
        }

        console.log('SocketIO Server connected...')

        const socket = io("/", {
            transports: ["websocket", "polling", "flashsocket"],
        });

        return socket;
    } catch (error) {
        console.log(error);
    }
};