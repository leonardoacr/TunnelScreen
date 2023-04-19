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
 const [stream, setStream] = useState<MediaStream | null>(null);
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

 const createPeerInstance = (stream: MediaStream) => {
  // create new Peer instance with options
  const peer = new Peer({
   initiator: true,
   trickle: false,
   stream,
  });

  // set peer instance to state
  peerRef.current = peer;

  // Peer stuff
 };

 const updateStream = (stream: MediaStream | null) => {
  setStream(stream);
  if (stream) createPeerInstance(stream);
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

 const handleConnect = () => {
  // here will go the streammer code to send the id to the server:
  // socket?.emit("connect-streamer", { streamerId });
  // waiting peer to connect
  setIsLoading(true);

  // simulate the loading time as 3 seconds and then, setPeerConnected(true)
  setTimeout(() => {
   setIsLoading(false);
   setPeerConnected(true);
  }, 3000);

  // set isPeerConnected when the peer connected to the ID
  // peerRef.current.on("connected", () => {
  //   setIsLoading(false);
  //   setIsPeerConnected(true);
  // }
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
