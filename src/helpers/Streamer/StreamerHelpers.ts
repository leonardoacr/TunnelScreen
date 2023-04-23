import { getRandomUsername } from "@/helpers/usernameGenerator";
import { Room } from "@/pages/api/ISocket";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

class StreamerHelpers {
    static handleConnect = async ({
        streamerUsername,
        streamId,
        socket,
        setStreamerUsername,
        setIsLoading,
        setIsIdConnected,
        setRoom,
    }: {
        streamerUsername: string;
        streamId: string;
        socket: Socket | null;
        setStreamerUsername: React.Dispatch<React.SetStateAction<string>>;
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
        setIsIdConnected: React.Dispatch<React.SetStateAction<boolean>>;
        setRoom: React.Dispatch<React.SetStateAction<Room>>;
    }) => {
        if (streamerUsername === "") {
            let username = await getRandomUsername();
            while (!username) {
                username = await getRandomUsername();
            }
            await setStreamerUsername(username);
        }
        if (streamerUsername !== "") {
            setIsLoading(true);

            console.log("emitting: ", streamerUsername);
            socket?.emit("streamer-ready", { streamId, streamerUsername });

            socket?.on("id-connection-stablished", async (data: any) => {
                if (data) {
                    console.log("ID connection established", data);

                    await setRoom((prevRoom) => {
                        const newRoom = { ...prevRoom };
                        const listenerUsernames =
                            newRoom[streamId]?.listenerUsernames || [];
                        if (!listenerUsernames.includes(data.listenerUsername)) {
                            newRoom[streamId] = {
                                streamerUsername: streamerUsername,
                                listenerUsernames: [...listenerUsernames, data.listenerUsername],
                            };
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
        peersRef,
    }: {
        streamId: string;
        socket: Socket;
        stream: MediaStream;
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
        setPeerConnected: React.Dispatch<React.SetStateAction<boolean>>;
        peersRef: React.MutableRefObject<Peer.Instance[]>;
    }): Peer.Instance => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", (offer: Peer.SignalData) => {
            console.log("Streamer offer sended...", {
                streamId,
                signalData: offer,
            });
            socket.emit("streamer-signal", {
                streamId,
                signalData: offer,
            });
        });

        socket.on("listener-answer", (data: any) => {
            if (data.streamId === streamId) {
                const answer = data.signalData;
                console.log("Streamer received Listener answer:", answer);
                if (answer) {
                    peer.signal(answer);
                }
            }
        });

        peer.on("connect", () => {
            console.log("Peer connected!");
            setIsLoading(false);
            setPeerConnected(true);
        });

        peer.on("error", (err) => {
            console.log("Error connecting peer: ", err);
        });

        peersRef.current.push(peer);

        return peer;
    };
}

export { StreamerHelpers };
