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

            socket.on("streamer-ready", (streamId: StreamId, signalData: Peer.SignalData) => {
                connections.push({ streamId, signalData });
                console.log(`Streamer ${JSON.stringify(streamId.streamerId)} is ready`);
            });

            socket.on("listener-ready", async (streamId) => {
                console.log(`Listener for stream ${JSON.stringify(streamId.streamerId)} is ready`);

                async function findConnection(streamId: any) {
                    return new Promise(resolve => {
                        const connection = connections.find(conn => conn.streamId.streamerId === streamId.streamId);
                        resolve(connection);
                    });
                }

                async function sendSignalDataToListener(streamId: any) {
                    const connection: any = await findConnection(streamId);
                    if (!connection) {
                        console.log(`No streamer found for stream ID ${JSON.stringify(streamId)}`);
                        return;
                    } else {
                        console.log(`Streamer found for stream ID ${JSON.stringify(streamId)}`);
                        // console.log(`Signal data received from Streamer: ${JSON.stringify(connection.streamId.signalData)}`)
                        socket.emit('streamer-signal', connection.streamId.signalData)
                        return;
                    }
                }

                await sendSignalDataToListener(streamId)
            });

            socket.on('listener-signal', (signalData: SignalData) => {
                console.log("Answer from the listener", signalData);
                socket.broadcast.emit('listener-answer', signalData)
            })

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });
        });

        res.end();
    }
};

export default SocketHandler;