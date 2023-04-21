import { Server } from 'socket.io';
import type { NextApiRequest } from 'next'
import type { Server as IOServer } from 'socket.io'
import Peer, { SignalData } from "simple-peer";
import { Connection, NextApiResponseWithSocket, StreamId } from './ISocket';

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

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        io = runServer();
    }
    if (io) {
        io.attach(res.socket.server);

        io.on("connection", (socket) => {
            console.log("Socket connected");

            // Receiving the id from the streamer
            socket.on("streamer-ready", (streamId: StreamId) => {
                connections.push({ streamId });
                console.log(`Streamer ${JSON.stringify(streamId.streamerId)} is ready`);
            });

            socket.on("listener-ready", async (streamId) => {
                console.log(`Listener for stream ${JSON.stringify(streamId.streamerId)} is ready`);

                await sendSignalDataToListener(streamId, socket)
            });

            socket.on('streamer-signal', (streamId: StreamId, signalData: SignalData) => {
                console.log("Offer from the streamer (ID, OFFER)", streamId, ' ', signalData);
                socket.emit('streamer-offer', { streamId, signalData })
            });


            // socket.on('listener-signal', (signalData: SignalData) => {
            //     console.log("Answer from the listener", signalData);
            //     socket.broadcast.emit('listener-answer', signalData)
            // });

            // socket.on("streamer-transmitting", async (streamData: any) => {
            //     console.log("Streamer started transmitting...", streamData);
            //     socket.broadcast.emit('streamer-started-transmitting', streamData)
            // });

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });
        });

        res.end();
    }
};

export default SocketHandler;


async function findConnection(streamId: any) {
    return new Promise(resolve => {
        const connection = connections.find(conn => conn.streamId.streamerId === streamId.streamId);
        resolve(connection);
    });
}

async function sendSignalDataToListener(streamId: any, socket: any) {
    const connection: any = await findConnection(streamId);
    if (!connection) {
        console.log(`No streamer found for stream ID ${JSON.stringify(streamId)}`);
        return;
    } else {
        console.log(`Streamer found for stream ID ${JSON.stringify(streamId)}`);
        socket.broadcast.emit('id-connection-stablished', true)
        return;
    }
}