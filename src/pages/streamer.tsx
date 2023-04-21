import IdContainer from "@/components/Streamer/IdContainer";
import ScreenSharingContainer from "@/components/Streamer/ScreenSharingContainer";
import { WaitingConnections } from "@/components/WaitingConnections";
import useSocket from "@/hooks/useSocket";
import { useRouter } from "next/router";
import React, { useState, useRef, useEffect } from "react";
import Peer from "simple-peer";
import { v4 as uuidv4 } from "uuid";

const Streamer = () => {
 const [isPeerConnected, setPeerConnected] = useState(false);
 const [isIdConnected, setIsIdConnected] = useState<boolean>(false);
 const [stream, setStream] = useState<MediaStream>();
 const videoRef = useRef<HTMLVideoElement>(null);
 const peerRef = useRef<Peer.Instance | null>(null);
 const [streamId, setStreamId] = useState<string>("");
 const [isSharing, setIsSharing] = useState<boolean>(false);
 const [isLoading, setIsLoading] = useState<boolean>(false);
 const { socket, isServerConnected } = useSocket();
 const [streamerReady, setStreamerReady] = useState<boolean>(false);

 const router = useRouter();

 const handleConnect = () => {
  // Sending the id to the server with socket and wait for someone to connect
  socket?.emit("streamer-ready", { streamId });
  setStreamerReady(true);
  setIsLoading(true);

  socket.on("id-connection-stablished", (data: boolean) => {
   if (data) {
    console.log("ID connection established");
    setIsLoading(false);
    setIsIdConnected(true);
   }
  });
 };

 const updateStream = (stream: MediaStream | null) => {
  if (stream) {
   setIsLoading(true);
   setIsSharing(true);
   setStream(stream);

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
    socket.emit("streamer-signal", { streamId, signalData: offer });
    setStreamerReady(true);
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

 return (
  <div className="w-full items-center justify-center h-screen flex">
   {isServerConnected ? (
    <>
     <div className="block">
      {!isIdConnected ? (
       <IdContainer
        streamId={streamId}
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
    </div>
   )}
  </div>
 );
};

export default Streamer;
