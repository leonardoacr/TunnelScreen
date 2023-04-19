import React, { useState, useRef, useEffect, useContext } from "react";
import { PeerContext } from "./PeerContext";
import Peer from "simple-peer";

const Listener = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const peer = useContext(PeerContext);

  useEffect(() => {
    console.log("peer listener?", peer);
    if (peer) {
      setConnected(true);

      peer.on("signal", (data) => {
        console.log("Signal data:", data);
        peer.signal(data);
      });

      peer.on("connect", () => {
        console.log("Connection established with the streamer");
      });

      peer.on("stream", (stream) => {
        console.log("Received stream from the streamer");
        videoRef.current!.srcObject = stream;
        videoRef.current!.play();
        setStreaming(true);
      });

      peer.on("streamoff", () => {
        console.log("Streamer stopped streaming");
        videoRef.current!.srcObject = null;
        setStreaming(false);
      });

      peer.on("error", (err) => {
        console.error("Peer error:", err);
      });
    }

    return () => {
      if (peer) {
        const [stream] = peer.streams;
        if (stream) {
          const [track] = stream.getTracks();
          peer?.removeStream(stream);
          track.stop();
        }
      }
    };
  }, [peer]);

  return (
    <div className="h-screen flex items-center">
      {!streaming && <div>No Stream Available</div>}
      {streaming && (
        <div>
          <video
            className=""
            style={{ width: "100%", height: "100%" }}
            ref={videoRef}
            muted
            autoPlay
          />
        </div>
      )}
      {connected && <div>Connected to the streamer!</div>}
    </div>
  );
};

export default Listener;
