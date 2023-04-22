import { useRouter } from "next/router";
import React, { useState, useRef } from "react";
import Peer from "simple-peer";
import { v4 as uuidv4 } from "uuid";

import { WaitingConnections } from "@/components/WaitingConnections";
import IdContainer from "@/components/Streamer/IdContainer";
import ScreenSharingContainer from "@/components/Streamer/ScreenSharingContainer";
import useSocket from "@/hooks/useSocket";

const Streamer = () => {
  const [isPeerConnected, setPeerConnected] = useState(false);
  const [isIdConnected, setIsIdConnected] = useState<boolean>(false);
  const [streamId, setStreamId] = useState<string>("");
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamerUsername, setStreamerUsername] = useState<string>("");
  const [connectButtonClicked, setConnectButtonClicked] =
    useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  const { socket, isServerConnected } = useSocket();
  const router = useRouter();

  const handleConnect = () => {
    setConnectButtonClicked(true);
    setIsLoading(true);

    socket?.emit("streamer-ready", { streamId, streamerUsername });

    socket.on("id-connection-stablished", (data: boolean) => {
      if (data) {
        console.log("ID connection established");
        setIsLoading(false);
        setIsIdConnected(true);
      }
    });
  };

  const cancelConnect = () => {
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

  const updateStream = (stream: MediaStream | null) => {
    if (stream) {
      setIsLoading(true);
      setIsSharing(true);

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      });

      peerRef.current = peer;

      peer.on("signal", (offer: Peer.SignalData) => {
        console.log("Streamer offer sended...", {
          streamId,
          signalData: offer,
        });
        socket.emit("streamer-signal", {
          streamId,
          signalData: offer,
          streamerUsername,
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
    }
  };

  const closeStream = () => {
    peerRef.current?.destroy();
    peerRef.current = null;

    setPeerConnected(false);

    router.push("/");
  };

  const generateID = () => {
    setStreamId(uuidv4().slice(0, 16));
  };

  const updateStreamerUsername = (streamerUsername: string) => {
    const streamerUsernameInputStatus = document.getElementById(
      "streamer-username"
    ) as HTMLInputElement;

    if (connectButtonClicked) {
      streamerUsernameInputStatus.disabled = true;
    } else {
      streamerUsernameInputStatus.removeAttribute("disabled");
      streamerUsername = streamerUsername.replace(/\s+/g, "");
      setStreamerUsername(streamerUsername);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {isServerConnected ? (
        <>
          <div className="block">
            {!isIdConnected ? (
              <IdContainer
                streamId={streamId}
                generateID={generateID}
                streamerUsername={streamerUsername}
                updateStreamerUsername={(streamerUsername: string) =>
                  updateStreamerUsername(streamerUsername)
                }
                handleConnect={handleConnect}
                cancelConnect={cancelConnect}
                isConnectButtonClicked={connectButtonClicked}
                isLoading={isLoading}
              />
            ) : (
              <ScreenSharingContainer
                videoRef={videoRef}
                closeStream={closeStream}
                updateStream={(stream: MediaStream | null) =>
                  updateStream(stream)
                }
              />
            )}
            <div>
              {isSharing ? (
                isLoading ? (
                  <div>
                    <WaitingConnections />
                  </div>
                ) : (
                  <div>Listener Connected.</div>
                )
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <div className="block">
          <h1>The server is not connected.</h1>
          {!isPeerConnected && <h1>The Peer is not connected.</h1>}
        </div>
      )}
    </div>
  );
};

export default Streamer;
