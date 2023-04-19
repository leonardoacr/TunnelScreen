import { Server } from 'socket.io';

const io = new Server(); // create a single instance of Server

const SocketHandler = (req, res) => {
    console.log('Socket is initializing');
    io.attach(res.socket.server); // attach the Server instance to the HTTP server

    io.on('connection', (socket) => {
        console.log('Socket connected');

        socket.on("video-data", (data) => {
            console.log("Signal data received from the client:", data);
            socket.broadcast.emit("video-data", data); // emit to all clients except sender
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    });

    res.end();
};

export default SocketHandler;
