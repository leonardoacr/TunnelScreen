import React, { useState, useRef, useContext, useEffect } from "react";
import { PeerContext } from "./PeerContext";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

let socket: undefined | Socket;

const Streamer = () => {
  const [videoData, setVideoData] = useState();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    try {
      console.log("Streaming");
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
        clearInterval(interval);
      });

      const interval = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * 101);
        console.log("Sending video data:", randomNumber);
        socket.emit("video-data", randomNumber);
      }, 3000);

      socket.on("error", (error: any) => {
        console.error("Socket error:", error);
        setConnected(false);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const [sharing, setSharing] = useState<boolean>(false);
  const peer = useContext(PeerContext);

  useEffect(() => {
    console.log("Status: ", connected);
    if (connected) {
      if (peer) {
        peer.on("signal", (data) => {
          console.log("Signal data:", data);
          socket?.emit("signal", data); // emit the signal data to the listener
        });

        peer.on("connect", () => {
          console.log("Connection established with the listener");
        });

        peer.on("stream", (stream) => {
          console.log("Received stream from the listener");
          videoRef.current!.srcObject = stream;
          videoRef.current!.play();
        });

        peer.on("streamoff", () => {
          console.log("Listener stopped streaming");
          videoRef.current!.srcObject = null;
        });

        peer.on("error", (err) => {
          console.error("Peer error:", err);
        });
      }
    }
  }, [connected, peer]);

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

    peer?.addStream(stream);
  };

  const stopSharing = () => {
    setSharing(false);
    if (peer) {
      const [stream] = peer.streams;
      if (stream) {
        peer.removeStream(stream);
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const handleFullScreen = () => {
    const video = videoRef.current!;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else {
      console.error("Fullscreen API is not supported");
    }
  };

  return (
    <div className="h-screen flex items-center">
      {connected ? (
        <>
          {!sharing && (
            <button
              className="bg-sky-800 mb-2 hover:bg-sky-700 text-zinc-50 py-1.5 px-4 w-36 border border-gray-800 rounded shadow"
              onClick={startSharing}
            >
              Start Sharing
            </button>
          )}
          {sharing && (
            <button
              className="bg-red-800 mb-2 hover:bg-red-700 text-zinc-50 py-1.5 px-4 w-36 border border-gray-800 rounded shadow"
              onClick={stopSharing}
            >
              Stop Sharing
            </button>
          )}
          <div>
            video should be here
            <video
              className=""
              ref={videoRef}
              width="720"
              height="576"
              autoPlay
              onError={(e) => console.log("Video error:", e)}
            ></video>
            <button
              className="bg-purple-800 mb-2 hover:bg-purple-700 text-zinc-50 py-1.5 px-4 w-36 border border-gray-800 rounded shadow"
              onClick={handleFullScreen}
            >
              Full Screen
            </button>
          </div>
        </>
      ) : (
        <div>DISCONNECTED...</div>
      )}
    </div>
  );
};

export default Streamer;
