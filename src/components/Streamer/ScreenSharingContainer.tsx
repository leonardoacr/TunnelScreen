import { useState } from "react";
import BlueButton from "../Buttons/BlueButton";
import GrayButton from "../Buttons/GrayButton";
import RedButton from "../Buttons/RedButton";
import Video from "../Video";

interface ScreenSharingContainerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  closeStream: () => void;
  updateStream: (stream: MediaStream | null) => void;
}

export const videoOptions = {
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    frameRate: { ideal: 60 },
    bitrate: 35000000,
    encodingBitrate: 35000000,
  },
  audio: {
    sampleRate: { ideal: 192000 },
    channelCount: { ideal: 2 },
    bitrate: 128000,
  },
};

const ScreenSharingContainer = ({
  videoRef,
  closeStream,
  updateStream,
}: ScreenSharingContainerProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startSharing = async () => {
    await navigator.mediaDevices
      .getDisplayMedia(videoOptions)
      .then(gotMedia)
      .catch((e) => {
        console.log("Error streaming: ", e);
      });

    function gotMedia(stream: MediaStream) {
      videoRef.current!.srcObject = stream;
      videoRef.current!.play();

      setStream(stream);
      updateStream(stream);
    }
  };

  const stopSharing = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      updateStream(null);
      videoRef.current!.srcObject = null;
    }
  };

  return (
    <>
      <Video videoRef={videoRef} />
      <div className="w-full space-x-4 pt-4 text-center">
        {!stream ? (
          <BlueButton text="Start Sharing" onClick={startSharing} />
        ) : (
          <RedButton text="Stop Sharing" onClick={stopSharing} />
        )}

        <GrayButton text="Close Stream" onClick={closeStream} />
      </div>
    </>
  );
};

export default ScreenSharingContainer;
