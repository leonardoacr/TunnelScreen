import { Server } from 'socket.io';
import type { NextApiRequest } from 'next'
import type { Server as IOServer } from 'socket.io'
import { Connection, NextApiResponseWithSocket, Room } from './ISocket';

let io: IOServer | undefined;

const runServer = () => {
    return new Server({
        cors: {
            origin: "*",
            methods: ["*"]
        }
    });
}

io = runServer();

const connections: Connection[] = [];
const room: Room = {};
let listenerId: string = '';

const SocketHandler = (_: NextApiRequest, res: NextApiResponseWithSocket) => {
    if (!io) {
        io = runServer();
    }

    if (io) {
        io.attach(res.socket.server);

        io.on("connection", (socket) => {
            console.log("Socket connected");

            socket.on("streamer-ready", (data) => {
                connections.push({ streamId: data.streamId });
                room[data.streamId] = { streamerUsername: data.streamerUsername, listenerUsernames: [] };
                console.log('teste data: ', data)
                console.log(`Streamer ${JSON.stringify(data.streamerUsername)} for stream ${JSON.stringify(data.streamId)} is ready`);
            });

            socket.on("listener-ready", async (data) => {
                console.log(`Listener ${JSON.stringify(data.listenerUsername)} for stream ${JSON.stringify(data.streamId)} is ready`);
                console.log('room test: ', room)
                if (room[data.streamId].listenerUsernames.length === 0) {
                    room[data.streamId].listenerUsernames.push(data.listenerUsername);
                } else {
                    room[data.streamId].listenerUsernames[0] = data.listenerUsername;
                }

                listenerId = data.listenerId;
                console.log('ListenerId: ', listenerId);

                console.log('Checking room: ', room);
                await broadcastIdConnectionStablished(data, socket)
            });

            socket.on('streamer-signal', (data) => {
                console.log("Offer from the streamer (ID, OFFER)", data.streamId, ' ', data.signalData);
                data = { ...data, listenerId };
                socket.broadcast.emit('streamer-offer', data);
            });

            socket.on('listener-signal', (data) => {
                console.log("Answer from the listener (ID, OFFER)", data.streamId, ' ', data.signalData);
                socket.broadcast.emit('listener-answer', data);
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });
        });

        res.end();
    }
};

async function findConnection(streamId: any) {
    return connections.find(conn => conn.streamId === streamId);
}

async function broadcastIdConnectionStablished(data: any, socket: any) {
    const connection: Connection | undefined = await findConnection(data.streamId);
    if (!connection) {
        console.log(`No streamer found for stream ID ${JSON.stringify(data.streamId)}`);
        return;
    }

    console.log(`Streamer found for stream ID ${JSON.stringify(data.streamId)}`);
    socket.broadcast.emit('id-connection-stablished', data);
    socket.emit('id-connection-stablished', data);
}

export default SocketHandler;
