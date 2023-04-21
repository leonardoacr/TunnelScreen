import IdContainer from "@/components/Listener/IdContainer";
import useSocket from "@/hooks/useSocket";
import Peer from "simple-peer";
import { useRef, useState } from "react";
import Video from "@/components/Video";

const Listener = () => {
 const { socket, isServerConnected } = useSocket();
 const [isPeerConnected, setPeerConnected] = useState(false);
 const [streamId, setStreamId] = useState<string>("");
 const [isLoading, setIsLoading] = useState<boolean>(false);
 const videoRef = useRef<HTMLVideoElement | null>(null);
 const peerRef = useRef<Peer.Instance | null>(null);

 const getStreamId = (streamId: string) => {
  setStreamId(streamId);
 };

 const handleConnect = () => {
  try {
   const peer = new Peer({
    initiator: false,
    trickle: false,
   });

   peerRef.current = peer;

   console.log("Listener ready...");

   socket?.emit("listener-ready", { streamId });

   socket.on("streamer-signal", (data: Peer.SignalData) => {
    console.log("Listener received Streamer signal data:", data);
    if (data) {
     peer.signal(data);
    }
   });

   peer.on("signal", (signalData: Peer.SignalData) => {
    console.log("Listener sending signal data:", signalData);
    socket?.emit("listener-signal", { signalData });
   });

   peer.on("connect", () => {
    setIsLoading(false);
    setPeerConnected(true);
    console.log("PEER CONNECTED");
   });

   peer.on("stream", (stream) => {
    console.log("Receving stream video...");
    if (videoRef.current) {
     videoRef.current.srcObject = stream;
    }
   });

   peer.on("error", (err) => {
    console.log("Error connecting peer: ", err);
   });
  } catch (error) {
   console.log("Error creating peer: ", error);
  }

  setIsLoading(true);
  console.log("");
 };

 return (
  <div className="w-full items-center justify-center h-screen flex">
   {isServerConnected ? (
    <div className="block">
     {!isPeerConnected ? (
      <IdContainer
       getStreamId={(streamId) => getStreamId(streamId)}
       handleConnect={handleConnect}
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
    </div>
   )}
  </div>
 );
};

export default Listener;
