import React, { useState, useRef, useEffect } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const Streamer = () => {
  const [connected, setConnected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sharing, setSharing] = useState<boolean>(false);
  const peerRef = useRef<Peer.Instance | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [streamerId, setStreamerId] = useState<string>(uuidv4());

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
        peerRef.current?.signal(data.signal);
      });

      socket.on("listener-connected", (id) => {
        console.log("Listener connected with ID:", id);
        // establish direct peer-to-peer connection with listener
        peerRef.current?.signal(id);
      });

      return () => {
        socket.disconnect();
      };
    } catch (error) {
      // console.log(error);
    }
  };

  const startSharing = async () => {
    setSharing(true);

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 },
      },
      audio: true,
    });

    videoRef.current!.srcObject = stream;
    videoRef.current!.play();

    // create new Peer instance with options
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    // set peer instance to state
    peerRef.current = peer;

    // listen for signal data
    peer.on("signal", (signalData) => {
      // console.log("Signal data:", data);
      socket?.emit("video-data", { signal: signalData, streamerId });
    });
  };

  const stopSharing = () => {
    setSharing(false);
    // destroy the Peer instance and reset the state
    peerRef.current?.destroy();
    peerRef.current = null;
  };

  const handleFullScreen = () => {
    const video = videoRef.current!;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else {
      console.error("Fullscreen API is not supportedon this browser");
    }
  };

  const handleConnect = () => {
    const listenerId = prompt("Enter listener ID:");
    if (listenerId) {
      socket?.emit("connect-listener", { streamerId, listenerId });
    }
  };
  return (
    <div className="streamer-container">
      <div className="video-container">
        <video
          ref={videoRef}
          style={{ width: "100%", height: "100%" }}
          muted
          playsInline
        />
        {!sharing ? (
          <button
            className="bg-gray-800 hover:bg-gray-700 text-zinc-50 py-1.5 px-4 w-24 border
               border-gray-800 rounded shadow"
            onClick={startSharing}
          >
            Start Sharing
          </button>
        ) : (
          <button
            className="bg-gray-800 hover:bg-gray-700 text-zinc-50 py-1.5 px-4 w-24 border
               border-gray-800 rounded shadow"
            onClick={stopSharing}
          >
            Stop Sharing
          </button>
        )}
        <button
          className="bg-gray-800 hover:bg-gray-700 text-zinc-50 py-1.5 px-4 w-24 border
               border-gray-800 rounded shadow"
          onClick={handleFullScreen}
        >
          Full Screen
        </button>
      </div>
      <div className="connect-container">
        {!connected ? (
          <p>Connecting to server...</p>
        ) : (
          <>
            <p>Streamer ID: {streamerId}</p>
            {!sharing && (
              <button
                className="bg-gray-800 hover:bg-gray-700 text-zinc-50 py-1.5 px-4 w-24 border
               border-gray-800 rounded shadow"
                onClick={handleConnect}
              >
                Connect to listener
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Streamer;
