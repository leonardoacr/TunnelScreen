import { Socket } from "socket.io-client";
import { getRandomUsername } from "./usernameGenerator";
import Peer from "simple-peer";
import { socketInitializer } from "./socketIO";
import { createSemanticDiagnosticsBuilderProgram } from "typescript";
import { Room } from "@/pages/api/ISocket";

class ListenerHelpers {
    static async handleConnect(
        streamId: string,
        listenerUsername: string,
        listenerId: string,
        setListenerUsername: React.Dispatch<React.SetStateAction<string>>,
        setConnectButtonClicked: React.Dispatch<React.SetStateAction<boolean>>,
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setIsIdConnected: React.Dispatch<React.SetStateAction<boolean>>,
        socket: Socket,
        setRoom: React.Dispatch<React.SetStateAction<Room>>
    ) {
        if (listenerUsername === "") {
            const username = await getRandomUsername();
            setListenerUsername(username);
        }

        if (listenerUsername !== "") {
            setConnectButtonClicked(true);
            setIsLoading(true);

            console.log("Listener ready...", streamId, listenerUsername);

            socket?.emit("listener-ready", {
                streamId,
                listenerUsername,
                listenerId,
            });

            socket.on("id-connection-stablished", (data: any) => {
                if (data.listenerId === listenerId) {
                    console.log("ID connection established", data);
                    setIsLoading(false);
                    setIsIdConnected(true);
                    // data = data.currentRoom;
                    // setRoom((prevRoom) => {
                    //     const newRoom = { ...prevRoom };
                    //     const listenerUsernames = newRoom[streamId]?.listenerUsernames || [];
                    //     const peerIds = newRoom[streamId]?.peerIds || [];

                    //     if (!listenerUsernames.includes(listenerUsername)) {
                    //         newRoom[streamId] = {
                    //             streamerUsername: data.streamerUsername,
                    //             listenerUsernames: [...listenerUsernames, data.listenerUsername],
                    //             peerIds: [...peerIds, data.listenerId],
                    //         };
                    //     }

                    //     return newRoom;
                    // });
                }
            });
        }
    }

    static cancelConnect = (
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setIsIdConnected: React.Dispatch<React.SetStateAction<boolean>>,
        setConnectButtonClicked: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        setIsLoading(false);
        setIsIdConnected(false);
        setConnectButtonClicked(false);

        const listenerUsernameInputStatus = document.getElementById(
            "listener-username"
        ) as HTMLInputElement;

        if (listenerUsernameInputStatus) {
            listenerUsernameInputStatus.disabled = false;
        }
    };

    static createNewPeer = ({
        streamId,
        socket,
        listenerUsername,
        listenerId,
        setStreamingData,
        setIsLoading,
        setPeerConnected,
        peerRef
    }: {
        streamId: string;
        socket: Socket;
        listenerUsername: string;
        listenerId: string;
        setStreamingData: React.Dispatch<React.SetStateAction<MediaStream | null>>;
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
        setPeerConnected: React.Dispatch<React.SetStateAction<boolean>>;
        peerRef: React.MutableRefObject<Peer.Instance | null>;
    }): Peer.Instance => {
        const peer = new Peer({
            initiator: false,
            // trickle: false,
        });
        peerRef.current = peer;

        socket.on("streamer-offer", async (data: any) => {
            if (data.streamId === streamId && data.listenerId === listenerId) {
                const offer: Peer.SignalData = data.signalData;
                if (offer) {
                    if (offer && offer.type === "offer") {
                        console.log("Received offer:", offer);
                    }
                    peer.signal(offer);
                }
            }
        });

        peer.on("signal", (answer: Peer.SignalData) => {
            console.log("Listener answer sended...", {
                streamId,
                signalData: answer,
            });
            socket?.emit("listener-signal", {
                streamId,
                signalData: answer,
                listenerUsername,
                listenerId,
            });
        });

        peer.on("stream", (stream) => {
            console.log("Listener stream created...", stream);
            setStreamingData(stream);
        });

        peer.on("connect", () => {
            setIsLoading(false);
            setPeerConnected(true);
            console.log("Peer Connected");
        });
        peer.on("error", (err) => {
            console.log("Error connecting peer: ", err);
        });

        return peer;
    };

    static getAllUsers = (
        socket: Socket,
        streamId: string,
        setRoom: React.Dispatch<React.SetStateAction<Room>>
    ) => {
        socket?.on('all-users', data => {
            console.log('quem tem aqui data', data)
            console.log('stream id: ', streamId)
            console.log('quem tem aqui ', data.streamId)

            // console.log('quem tem aqui JSON ', JSON.parse(data)[streamId])

            // data = JSON.parse(data)
            if (data !== undefined) {
                const { streamerUsername } = data[streamId];
                setRoom((prevRoom) => {
                    const newRoom = { ...prevRoom };
                    const listenerUsernames = newRoom[streamId]?.listenerUsernames || [];
                    // if (!listenerUsernames.includes(data.listenerUsername)) {
                    newRoom[streamId] = {
                        streamerUsername: streamerUsername,
                        listenerUsernames: [...listenerUsernames, data.listenerUsername],
                    };
                    // }

                    return newRoom;
                });
            }
        });
    };


}

export default ListenerHelpers;