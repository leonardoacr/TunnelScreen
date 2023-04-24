import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";

import useSocket from "@/hooks/useSocket";
import IdContainer from "@/components/Listener/IdContainer";
import Video from "@/components/Video";
import ListenerHelpers from "@/helpers/ListenerHelpers";
import Header from "@/components/Header";
import StreamSelector from "@/components/StreamSelector";
import { Room } from "./api/ISocket";

const Listener = () => {
  const { socket, isServerConnected } = useSocket();
  const [isPeerConnected, setPeerConnected] = useState(false);
  const [isIdConnected, setIsIdConnected] = useState<boolean>(false);
  const [streamId, setStreamId] = useState<string>("");
  const [room, setRoom] = useState<Room>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listenerId] = useState<string>(
    Math.random().toString(36).substring(2, 15)
  );
  const [streamingData, setStreamingData] = useState<MediaStream | null>(null);
  const [listenerUsername, setListenerUsername] = useState<string>("");
  const [connectButtonClicked, setConnectButtonClicked] =
    useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    console.log("Get all users...");
    if (!streamId) {
      const streamId = localStorage.getItem("streamId");
      if (typeof streamId === "string") {
        setStreamId(streamId);
      }
    }

    if (streamId !== "") {
      ListenerHelpers.getAllUsers(socket, streamId, setRoom);
    }

  }, [room, socket, setRoom, streamId, isIdConnected]);

  const getStreamId = (streamId: string) => {
    console.log("Setting stream ID", streamId);
    setStreamId(streamId);
  };

  const handleConnect = async () => {
    ListenerHelpers.handleConnect(
      streamId,
      listenerUsername,
      listenerId,
      setListenerUsername,
      setConnectButtonClicked,
      setIsLoading,
      setIsIdConnected,
      socket,
      setRoom
    );
  };

  const cancelConnect = () => {
    ListenerHelpers.cancelConnect(
      setIsLoading,
      setIsIdConnected,
      setConnectButtonClicked
    );
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

    ListenerHelpers.createNewPeer({
      streamId,
      socket,
      listenerUsername,
      listenerId,
      setStreamingData,
      setIsLoading,
      setPeerConnected,
      peerRef,
    });
  }, [
    socket,
    isIdConnected,
    streamId,
    isPeerConnected,
    listenerUsername,
    listenerId,
  ]);

  return (
    <>
      <Header />
      <div className="flex h-screen w-full items-center justify-center">
        <div className="block">
          {room[streamId] ? (
            <div className="my-6 flex w-full justify-center">
              <StreamSelector room={room} streamId={streamId} />
            </div>
          ) : null}
          <div>
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
        </div>
      </div>
    </>
  );
};

export default Listener;
