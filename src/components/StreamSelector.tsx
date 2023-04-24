import { Room } from "@/pages/api/ISocket";
import { useState } from "react";
import GrayButton from "./Buttons/GrayButton";
import PurpleBorderButton from "./Buttons/PurpleBorderButton";
import { Copy, X } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface StreamSelectorProps {
  room: Room;
  streamId: string;
}

const StreamSelector = ({ room, streamId }: StreamSelectorProps) => {
  const [showStream, setShowStream] = useState(false);
  const [copyToClipboard, copyResult] = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard(streamId);
  };

  function handleToggleStream() {
    setShowStream(!showStream);
  }

  return (
    <div>
      <PurpleBorderButton text={"Online Users"} onClick={handleToggleStream} />
      {showStream && (
        <>
          <div className="fixed left-0 top-0 z-50 h-full w-full bg-gray-900 bg-opacity-70"></div>
          <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform rounded-md border border-indigo-700 bg-sky-950/90 shadow-lg">
            <div className="mr-2 mt-2 flex justify-end">
              <X
                className="cursor-pointer text-indigo-500"
                onClick={handleToggleStream}
              />
            </div>
            <div className="px-12 pb-8">
              <h2 className="mb-4 text-lg font-semibold">Users in the room</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-700"></div>
                  <div>{room[streamId].streamerUsername}</div>
                </div>
                {room[streamId].listenerUsernames.map((username) => (
                  <div key={username} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-sky-700"></div>
                    <div>{username}</div>
                  </div>
                ))}
                <div className="flex w-full justify-center text-center">
                  <div className="w-full items-center rounded bg-purple-700 text-center text-neutral-700">
                    <hr className="rounded"></hr>
                  </div>
                </div>
                <span className="font-semibold">Key</span>
                <div className="flex space-x-2">
                  <span className="w-full rounded border border-sky-300 px-2 text-center font-semibold text-green-500">
                    {streamId}
                  </span>
                  <button onClick={handleCopy}>
                    <Copy className="text-green-500" />
                  </button>
                </div>
                <div className="p-2 text-green-500/90">
                  {copyResult?.state === "success" && "Copied successfully!"}
                  {copyResult?.state === "error" &&
                    `Error: ${copyResult.message}`}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StreamSelector;
