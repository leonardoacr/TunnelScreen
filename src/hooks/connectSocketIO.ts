import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const useConnectSocketIO = (uri: string): Socket | undefined => {
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        const newSocket = io(uri);
        newSocket.on('connect', () => {
            console.log('Socket.IO connected');
        });

        newSocket.on('disconnect', () => {
            console.log('Socket.IO disconnected');
        });

        newSocket.on('status', (data: any) => {
            const dataTransmitted = parseInt(data.signal);
            console.log('ta chegando algo? ', dataTransmitted);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [uri]);

    return socket;
};

export default useConnectSocketIO;
