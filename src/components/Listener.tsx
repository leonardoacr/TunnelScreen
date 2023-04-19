import React, { useState, useRef, useEffect } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

const Listener = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const peerRef = useRef<Peer.Instance | null>(null);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    socketInitializer();
  }, [socket]);

  const socketInitializer = async () => {
    try {
      try {
        await fetch("/api/socket");
      } catch (error) {
        console.log("error fetching the api: ", error);
      }

      const socket = io("/", {
        transports: ["websocket", "polling", "flashsocket"],
      });

      setSocket(socket);

      // connect to the streamer with the id he sent
      // const listenerId = prompt("Enter listener ID:");
      // if (listenerId) {
      //   socket?.emit("connect-listener", { streamerId, listenerId });
      // }

      socket.on("connect", () => {
        // console.log("Connected to server");
        setConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
        setConnected(false);
      });

      socket.on("video-data", (data) => {
        // console.log("Signal data received from server:", data);
        peerRef.current?.signal(data);
      });

      // create new Peer instance with options
      const peer = new Peer({
        initiator: false,
        trickle: false,
      });

      // set peer instance to state
      peerRef.current = peer;

      // listen for signal data
      peer.on("signal", (data) => {
        // console.log("Signal data:", data);
        socket?.emit("video-data", data);
      });

      // listen for stream from the streamer
      peer.on("stream", (stream) => {
        // console.log("Stream received");
        setStreaming(true);
        setLoading(false);
        videoRef.current!.srcObject = stream;
        videoRef.current!.play();
      });

      return () => {
        // destroy the Peer instance and reset the state
        // peerRef.current?.destroy();
        // peerRef.current = null;
        // setStreaming(false);
        // setLoading(true);
        // socket.disconnect();
      };
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className="h-screen flex items-center">
      {!loading && !streaming && <div>No Stream Available</div>}
      {streaming && (
        <div>
          <video
            className=""
            width="720"
            height="576"
            ref={videoRef}
            muted
            autoPlay
          />
        </div>
      )}
      {connected && <div>Connected to the server!</div>}
    </div>
  );
};

export default Listener;
