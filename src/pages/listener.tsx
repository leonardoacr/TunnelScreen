import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";

import useSocket from "@/hooks/useSocket";
import IdContainer from "@/components/Listener/IdContainer";
import Video from "@/components/Video";
import { getRandomUsername } from "@/helpers/usernameGenerator";

const Listener = () => {
  const { socket, isServerConnected } = useSocket();
  const [isPeerConnected, setPeerConnected] = useState(false);
  const [isIdConnected, setIsIdConnected] = useState<boolean>(false);
  const [streamId, setStreamId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamingData, setStreamingData] = useState<MediaStream | null>(null);
  const [listenerUsername, setListenerUsername] = useState<string>("");
  const [connectButtonClicked, setConnectButtonClicked] =
    useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  const getStreamId = (streamId: string) => {
    setStreamId(streamId);
  };

  const handleConnect = async () => {
    if (listenerUsername === "") {
      const username = await getRandomUsername();
      setListenerUsername(username);
    }

    if (listenerUsername !== "") {
      setConnectButtonClicked(true);
      setIsLoading(true);

      console.log("Listener ready...", streamId, listenerUsername);

      socket?.emit("listener-ready", { streamId, listenerUsername });

      socket.on("id-connection-stablished", (data: boolean) => {
        if (data) {
          console.log("ID connection established");
          setIsLoading(false);
          setIsIdConnected(true);
        }
      });
    }
  };

  const cancelConnect = () => {
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

  const updateListenerUsername = (listenerUsername: string) => {
    const listenerUsernameInputStatus = document.getElementById(
      "listener-username"
    ) as HTMLInputElement;

    if (connectButtonClicked) {
      listenerUsernameInputStatus.disabled = true;
    } else {
      listenerUsernameInputStatus.removeAttribute("disabled");
      listenerUsername = listenerUsername.replace(/\s+/g, "");
      setListenerUsername(listenerUsername);
    }
  };

  useEffect(() => {
    if (videoRef.current && streamingData) {
      videoRef.current.srcObject = streamingData;
    }
  }, [videoRef, streamingData]);

  useEffect(() => {
    if (!isIdConnected) return;

    const peer = new Peer({
      initiator: false,
      trickle: false,
    });
    peerRef.current = peer;

    socket.on("listener-offer", (data: any) => {
      if (data.streamId === streamId) {
        const offer = data.signalData;
        console.log("Listener received Listener offer:", offer);
        if (offer) {
          peer.signal(offer);
        }
      }
    });

    peer.on("signal", (answer: Peer.SignalData) => {
      console.log("Listener answer sended...", {
        streamId,
        signalData: answer,
      });
      socket?.emit("listener-signal", { streamId, signalData: answer });
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
  }, [socket, isIdConnected, streamId]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {isServerConnected ? (
        <div className="block">
          {!isIdConnected ? (
            <IdContainer
              getStreamId={(streamId) => getStreamId(streamId)}
              listenerUsername={listenerUsername}
              updateListenerUsername={(listenerUsername: string) =>
                updateListenerUsername(listenerUsername)
              }
              handleConnect={handleConnect}
              cancelConnect={cancelConnect}
              isConnectButtonClicked={connectButtonClicked}
              isLoading={isLoading}
            />
          ) : (
            <div>
              <Video videoRef={videoRef} />
            </div>
          )}
        </div>
      ) : (
        <div className="block">
          <h1>The server is not connected.</h1>
          {!isPeerConnected && <h1>The Peer is not connected.</h1>}
        </div>
      )}
    </div>
  );
};

export default Listener;
