import React, { useState, useRef, useEffect } from "react";
import SimplePeer from "simple-peer";

const Streamer = () => {
  const [connected, setConnected] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sharing, setSharing] = useState<boolean>(false);

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

    // initialize peer
    const peer = new SimplePeer({ initiator: true, trickle: false });
    peer.addStream(stream);

    peer.on("signal", (data) => {
      console.log("Signal data:", data);
      // send signal data to listeners
    });
  };

  const stopSharing = () => {
    setSharing(false);
    // TODO: stop sharing and close peer connection
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
