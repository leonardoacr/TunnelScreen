import { useRouter } from "next/router";
import React, { useState, useRef, useEffect } from "react";
import Peer from "simple-peer";
import { v4 as uuidv4 } from "uuid";

import { WaitingConnections } from "@/components/WaitingConnections";
import IdContainer from "@/components/Streamer/IdContainer";
import ScreenSharingContainer from "@/components/Streamer/ScreenSharingContainer";
import useSocket from "@/hooks/useSocket";
import { Room } from "./api/ISocket";
import { StreamerHelpers } from "@/helpers/Streamer/StreamerHelpers";

export interface PeerRef {
  peerId: string;
  peer: Peer.Instance;
}

const Streamer = () => {
  const [isPeerConnected, setPeerConnected] = useState(false);
  const [isIdConnected, setIsIdConnected] = useState<boolean>(false);
  const [streamId, setStreamId] = useState<string>("");
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamerUsername, setStreamerUsername] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [room, setRoom] = useState<Room>({});
  const [connectButtonClicked, setConnectButtonClicked] =
    useState<boolean>(false);
  const [peers, setPeers] = useState<Peer.Instance[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<PeerRef[] | undefined>([]);

  const { socket, isServerConnected } = useSocket();
  const router = useRouter();

  useEffect(() => {
    console.log("testing room: ", room);

    console.log(
      "checking room listeners length to detect new user",
      room[streamId]?.listenerUsernames?.length
    );
    if (room[streamId]?.listenerUsernames?.length > 1) {
      console.log("yup, peers: ", peers, peers);
      updateStream(stream);
    }
  }, [room, stream, streamId]);

  const handleConnect = async () => {
    StreamerHelpers.handleConnect({
      streamerUsername,
      streamId,
      socket,
      setStreamerUsername,
      setIsLoading,
      setIsIdConnected,
      setRoom,
    });
  };

  const cancelConnect = () => {
    StreamerHelpers.cancelConnect(
      setIsLoading,
      setIsIdConnected,
      setConnectButtonClicked
    );
  };

  const updateStream = (stream: MediaStream | null) => {
    if (stream) {
      setIsLoading(true);
      setIsSharing(true);
      setStream(stream);
      console.log("check stream", stream);

      const users = room[streamId].peerIds;
      console.log("testing users: ", users);

      users?.forEach((userID) => {
        const peer = StreamerHelpers.createNewPeer({
          streamId,
          socket,
          stream,
          setIsLoading,
          setPeerConnected,
        });
        peersRef.current?.push({
          peerId: userID,
          peer,
        });
        peers.push(peer);
      });
      setPeers(peers);
    }
  };

  const closeStream = () => {
    // peersRef.current.forEach((peer) => {
    //   peer.destroy();
    // });
    peersRef.current = [];
    setPeers([]);
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
