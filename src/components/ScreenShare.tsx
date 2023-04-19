import React, { useState, useRef, useContext } from "react";
import Peer from "simple-peer";
import { PeerContext } from "./PeerContext";

const ScreenShare: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sharing, setSharing] = useState<boolean>(false);
  const peer = useContext(PeerContext);

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
      {!sharing && (
        <button
          className="bg-sky-800 mb-2 hover:bg-sky-700  text-zinc-50  py-1.5 px-4 w-36 border border-gray-800 rounded shadow"
          onClick={startSharing}
        >
          Start Sharing
        </button>
      )}
      {sharing && (
        <button
          className="bg-red-800 mb-2 hover:bg-red-700  text-zinc-50  py-1.5 px-4 w-36 border border-gray-800 rounded shadow"
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
          className="bg-purple-800 mb-2 hover:bg-purple-700  text-zinc-50  py-1.5 px-4 w-36 border border-gray-800 rounded shadow"
          onClick={handleFullScreen}
        >
          Full Screen
        </button>
      </div>
    </div>
  );
};

export default ScreenShare;
