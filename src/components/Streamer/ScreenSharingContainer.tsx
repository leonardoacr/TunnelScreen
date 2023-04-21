import { useState } from "react";
import Button from "../Button";
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
  frameRate: { ideal: 30 },
 },
 audio: true,
};

const ScreenSharingContainer = ({
 videoRef,
 closeStream,
 updateStream,
}: ScreenSharingContainerProps) => {
 const [stream, setStream] = useState<MediaStream | null>(null);

 const handleFullScreen = () => {
  const video = videoRef.current!;
  if (video.requestFullscreen) {
   video.requestFullscreen();
  } else {
   console.error("Fullscreen API is not supported on this browser");
  }
 };

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
   updateStream(null);
   videoRef.current!.srcObject = null;
  }
 };

 return (
  <>
   <Video videoRef={videoRef} />
   <div className="pt-4 space-x-4 w-full text-center">
    <Button
     backgroundColor="sky"
     borderColor="gray"
     text="Start Sharing"
     onClick={startSharing}
    />
    <Button
     backgroundColor="red"
     borderColor="gray"
     text="Stop Sharing"
     onClick={stopSharing}
    />
    <Button
     backgroundColor="gray"
     borderColor="gray"
     text="Full Screen"
     onClick={handleFullScreen}
    />
    <Button
     backgroundColor="gray"
     borderColor="gray"
     text="Close Stream"
     onClick={closeStream}
    />
   </div>
  </>
 );
};

export default ScreenSharingContainer;
