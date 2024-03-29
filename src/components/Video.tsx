import { RefObject } from "react";

interface Props {
  videoRef: RefObject<HTMLVideoElement>;
}

const Video = ({ videoRef }: Props) => {
  return (
    <div className="video-container">
      <video
        className="bg-inherit"
        width="720"
        height="576"
        ref={videoRef}
        muted
        autoPlay
        playsInline
        controls
      />
    </div>
  );
};

export default Video;
