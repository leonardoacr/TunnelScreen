import { getRandomUsername } from "@/helpers/usernameGenerator";
import { Room } from "@/pages/api/ISocket";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

class StreamerHelpers {
    static currentPeerId = '';

    static handleConnect = async ({
        streamerUsername,
        streamId,
        socket,
        setStreamerUsername,
        setIsLoading,
        setIsIdConnected,
        setRoom,
        setConnectButtonClicked
    }: {
        streamerUsername: string;
        streamId: string;
        socket: Socket | null;
        setStreamerUsername: React.Dispatch<React.SetStateAction<string>>;
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
        setIsIdConnected: React.Dispatch<React.SetStateAction<boolean>>;
        setRoom: React.Dispatch<React.SetStateAction<Room>>;
        setConnectButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
    }) => {
        if (streamerUsername === "") {
            let username = await getRandomUsername();
            while (!username) {
                username = await getRandomUsername();
            }
            await setStreamerUsername(username);
        }
        if (streamerUsername !== "") {
            setConnectButtonClicked(true);
            setIsLoading(true);

            socket?.emit("streamer-ready", { streamId, streamerUsername });

            socket?.on("id-connection-stablished", async (data: any) => {
                if (data) {
                    console.log("ID connection established", data);

                    setRoom((prevRoom) => {
                        const newRoom = { ...prevRoom };
                        const listenerUsernames = newRoom[streamId]?.listenerUsernames || [];
                        const peerIds = newRoom[streamId]?.peerIds || [];

                        if (!listenerUsernames.includes(data.listenerUsername)) {
                            newRoom[streamId] = {
                                streamerUsername: streamerUsername,
                                listenerUsernames: [...listenerUsernames, data.listenerUsername],
                                peerIds: [...peerIds, data.listenerId],
                            };
                            this.currentPeerId = data.listenerId;
                        }

                        return newRoom;
                    });

                    setIsLoading(false);
                    setIsIdConnected(true);
                }
            });
        }
    };

    static cancelConnect = (setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setIsIdConnected: React.Dispatch<React.SetStateAction<boolean>>,
        setConnectButtonClicked: React.Dispatch<React.SetStateAction<boolean>>): void => {
        setIsLoading(false);
        setIsIdConnected(false);
        setConnectButtonClicked(false);

        const streamerUsernameInputStatus = document.getElementById(
            "streamer-username"
        ) as HTMLInputElement;

        if (streamerUsernameInputStatus) {
            streamerUsernameInputStatus.disabled = false;
        }
    };

    static createNewPeer = ({
        streamId,
        socket,
        stream,
        setIsLoading,
        setPeerConnected,
        userId
    }: {
        streamId: string;
        socket: Socket;
        stream: MediaStream;
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
        setPeerConnected: React.Dispatch<React.SetStateAction<boolean>>;
        userId: string
    }): Peer.Instance => {
        const newPeer = new Peer({
            initiator: true,
            stream: stream,
        });

        newPeer.on("signal", (offer: Peer.SignalData) => {
            console.log("Streamer offer sent...", {
                userId,
                streamId,
                signalData: offer,
            });
            socket.emit("streamer-signal", {
                userId,
                streamId,
                signalData: offer,
            });
        });

        socket.on("listener-answer", (data: any) => {
            console.log('ID matches? ', userId, data.listenerId)
            if (data.streamId === streamId && userId === data.listenerId) {
                const answer = data.signalData;
                if (answer && answer.type === 'answer') {
                    console.log('Received answer:', answer);
                }
                newPeer.signal(answer);
            }
        });

        newPeer.on("connect", () => {
            console.log("Peer connected!");
            setIsLoading(false);
            setPeerConnected(true);
        });

        newPeer.on("error", (err) => {
            console.log("Error connecting peer: ", err);
        });

        newPeer.on("iceConnectionStateChange", (state) => {
            console.log("Peer ice connection state changed: ", state);
        });

        return newPeer;
    };


}

export { StreamerHelpers };
