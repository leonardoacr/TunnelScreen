import React, { useState, useRef, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { PeerContext } from "./PeerContext";

const Listener = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const peer = useContext(PeerContext);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    try {
      console.log("Listening...");
      await fetch("/api/socket");

      const socket = io("/", {
        transports: ["websocket", "polling", "flashsocket"],
      });

      socket.on("connect", () => {
        console.log("connected");
        setConnected(true);
        setLoading(false);
      });

      socket.on("disconnect", () => {
        console.log("disconnected");
        setConnected(false);
        setLoading(false);
      });

      socket.on("video-data", (data: any) => {
        console.log("Received video data: ", data);
      });

      if (connected) {
        if (peer) {
          peer.on("signal", (data) => {
            console.log("Signal data:", data);
            socket?.emit("signal", data);
          });

          peer.on("stream", (stream) => {
            videoRef.current!.srcObject = stream;
            videoRef.current!.play();
            setStreaming(true);
          });
          peer.on("streamoff", () => {
            videoRef.current!.srcObject = null;
            setStreaming(false);
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex items-center">
      {!streaming && <div>No Stream Available</div>}
      {streaming && (
        <div>
          video should be here
          <video
            className=""
            style={{ width: "100%", height: "100%" }}
            ref={videoRef}
            muted
            autoPlay
          />
        </div>
      )}
    </div>
  );
};

export default Listener;
