import { Server } from 'socket.io';
import type { NextApiRequest } from 'next'
import type { Server as IOServer } from 'socket.io'
import { NextApiResponseWithSocket } from './ISocket';

interface Connection {
    streamId: string;
}

interface Room {
    [streamId: string]: {
        streamerUsername: string;
        listenerUsernames: string[];
    }
}

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

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
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
                console.log(`Streamer ${JSON.stringify(data.streamerUsername)} for stream ${JSON.stringify(data.streamId)} is ready`);
            });

            socket.on("listener-ready", async (data) => {
                console.log(`Listener ${JSON.stringify(data.listenerUsername)} for stream ${JSON.stringify(data.streamId)} is ready`);

                if (room[data.streamId].listenerUsernames.length === 0) {
                    room[data.streamId].listenerUsernames.push(data.listenerUsername);
                } else {
                    room[data.streamId].listenerUsernames[0] = data.listenerUsername;
                }

                console.log('Checking room: ', room);
                await sendSignalDataToListener(data.streamId, socket)
            });

            socket.on('streamer-signal', (data) => {
                console.log("Offer from the streamer (ID, OFFER)", data.streamId, ' ', data.signalData);
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

async function sendSignalDataToListener(streamId: any, socket: any) {
    const connection: Connection | undefined = await findConnection(streamId);
    if (!connection) {
        console.log(`No streamer found for stream ID ${JSON.stringify(streamId)}`);
        return;
    }

    console.log(`Streamer found for stream ID ${JSON.stringify(streamId)}`);
    socket.broadcast.emit('id-connection-stablished', true);
    socket.emit('id-connection-stablished', true);
}

export default SocketHandler;
