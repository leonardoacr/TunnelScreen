import IdContainer from "@/components/Streamer/IdContainer";
import ScreenSharingContainer from "@/components/Streamer/ScreenSharingContainer";
import { socketInitializer } from "@/helpers/socketIO";
import { useRouter } from "next/router";
import React, { useState, useRef, useEffect } from "react";
import Peer from "simple-peer";
import { v4 as uuidv4 } from "uuid";

const Streamer = () => {
 const [isPeerConnected, setPeerConnected] = useState(false);
 const [isServerConnected, setIsServerConnected] = useState(false);
 const [stream, setStream] = useState<MediaStream>();
 const videoRef = useRef<HTMLVideoElement>(null);
 const peerRef = useRef<Peer.Instance | null>(null);
 const [streamerId, setStreamerId] = useState<string>("");
 const [isLoading, setIsLoading] = useState<boolean>(false);
 const [socket, setSocket] = useState<any>();

 const router = useRouter();

 useEffect(() => {
  const initSocket = async () => {
   const socket = await socketInitializer();

   if (!socket) {
    console.log("Failed to initialize socket");
    return;
   }
   setSocket(socket);

   socket.on("connect", () => {
    setIsServerConnected(true);
   });
   socket.on("disconnect", () => {
    console.log("Disconnected from server");
    setIsServerConnected(false);
   });
  };

  initSocket();
 }, []);

 const handleConnect = () => {
  try {
   const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
   });

   peerRef.current = peer;

   peer.on("signal", (data) => {
    socket?.emit("connect-streamer", { streamerId, signalData: data });
   });

   type RTCSessionDescriptionInitWithSdpType = RTCSessionDescriptionInit & {
    type: "offer" | "answer";
   };

   socket?.on(
    "streamer-signal",
    (signalData: string | RTCSessionDescriptionInitWithSdpType) => {
     if (typeof signalData === "string") {
     } else {
      peer.signal(signalData);
     }
    }
   );

   peer.on("connect", () => {
    setIsLoading(false);
    setPeerConnected(true);
   });

   peer.on("error", (err) => {
    console.log("Error connecting peer: ", err);
   });
  } catch (error) {
   console.log("Error creating peer: ", error);
  }

  setIsLoading(true);

  // simulate the loading time as 3 seconds and then, setPeerConnected(true)
  //   setTimeout(() => {
  //    setIsLoading(false);
  //   }, 3000);
  //  };
 };

 const updateStream = (stream: MediaStream | null) => {
  if (stream) setStream(stream);
 };

 const closeStream = () => {
  peerRef.current?.destroy();
  peerRef.current = null;

  setPeerConnected(false);

  router.push("/");
 };

 const generateID = () => {
  setStreamerId(uuidv4().slice(0, 16));
 };

 return (
  <div className="w-full items-center justify-center h-screen flex">
   {isServerConnected ? (
    <div className="block">
     {!isPeerConnected ? (
      <IdContainer
       streamerId={streamerId}
       generateID={generateID}
       handleConnect={handleConnect}
       isLoading={isLoading}
      />
     ) : (
      <ScreenSharingContainer
       videoRef={videoRef}
       closeStream={closeStream}
       updateStream={(stream) => updateStream(stream)}
      />
     )}
    </div>
   ) : (
    <div className="block">
     <h1>The server is not connected.</h1>
    </div>
   )}
  </div>
 );
};

export default Streamer;
