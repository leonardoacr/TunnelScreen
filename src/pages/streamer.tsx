import IdContainer from "@/components/Streamer/IdContainer";
import ScreenSharingContainer from "@/components/Streamer/ScreenSharingContainer";
import useSocket from "@/hooks/useSocket";
import { useRouter } from "next/router";
import React, { useState, useRef, useEffect } from "react";
import Peer from "simple-peer";
import { v4 as uuidv4 } from "uuid";

const Streamer = () => {
 const [isPeerConnected, setPeerConnected] = useState(false);
 const [stream, setStream] = useState<MediaStream>();
 const videoRef = useRef<HTMLVideoElement>(null);
 const peerRef = useRef<Peer.Instance | null>(null);
 const [streamerId, setStreamerId] = useState<string>("");
 const [isLoading, setIsLoading] = useState<boolean>(false);
 const { socket, isServerConnected } = useSocket();
 const [streamerReady, setStreamerReady] = useState<boolean>(false);

 const router = useRouter();

 useEffect(() => {
  console.log("checking stream state: ", stream);
 }, [stream]);

 const handleConnect = () => {
  try {
   const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
   });

   peerRef.current = peer;

   peer.on("signal", (signalData: Peer.SignalData) => {
    console.log("Streamer signal sended...");
    socket?.emit("streamer-ready", { streamerId, signalData: signalData });
    setStreamerReady(true);
   });

   socket.on("listener-answer", (data: any) => {
    console.log("Streamer received Listener signal data:", data.signalData);
    if (data) {
     console.log("type of the listener signal received: ", typeof data);
     peer.signal(data.signalData);
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
  } catch (error) {
   console.log("Error creating peer: ", error);
  }

  setIsLoading(true);
 };

 const updateStream = (stream: MediaStream | null) => {
  if (stream) {
   console.log("Streaming...");
   //  console.log(stream);
   setStream(stream);
  }
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
