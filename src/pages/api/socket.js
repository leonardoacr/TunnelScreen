import { Server } from 'socket.io';

const io = new Server(); // create a single instance of Server

const connections = {};

const SocketHandler = (req, res) => {
    io.attach(res.socket.server);

    io.on("connection", (socket) => {
        console.log("Socket connected");

        // socket.on("connect-listener", ({ streamerId, listenerId }) => {
        //     if (connections[listenerId]) {
        //         // If there is already a connection for this listener, close it before creating a new one
        //         connections[listenerId].socket.disconnect();
        //     }

        //     const listenerSocket = io.sockets.connected[listenerId];

        //     if (listenerSocket) {
        //         // If the listener socket exists, create a new connection
        //         const connectionId = streamerId; // Use streamerId as the connection ID

        //         connections[listenerId] = {
        //             id: connectionId,
        //             socket,
        //             streamerId,
        //         };

        //         listenerSocket.emit("listener-connected", {
        //             streamerId,
        //             connectionId,
        //         });

        //         socket.emit("streamer-id", connectionId); // Emit the streamer ID to the listener

        //         socket.on("disconnect", () => {
        //             console.log(`Socket disconnected: ${socket.id}`);

        //             if (connections[listenerId]?.id === connectionId) {
        //                 // If this connection is still the active one, remove it from the connections object
        //                 delete connections[listenerId];
        //             }
        //         });
        //     } else {
        //         // If the listener socket doesn't exist, emit an error event
        //         socket.emit("listener-not-found", { listenerId });
        //     }
        // });
        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    });

    res.end();
};

export default SocketHandler;
