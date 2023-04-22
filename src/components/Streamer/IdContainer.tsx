import React, { FC } from "react";
import Button from "../Button";
import { Copy, Wifi } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { WaitingConnections } from "../WaitingConnections";

interface iDContainerProps {
  streamId: string;
  generateID: () => void;
  streamerUsername: string;
  updateStreamerUsername: (username: string) => void;
  handleConnect: () => void;
  cancelConnect: () => void;
  isConnectButtonClicked: boolean;
  isLoading: boolean;
}

const IdContainer: FC<iDContainerProps> = ({
  streamId,
  generateID,
  streamerUsername,
  updateStreamerUsername,
  handleConnect,
  cancelConnect,
  isConnectButtonClicked,
  isLoading,
}) => {
  const [copyToClipboard, copyResult] = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard(streamId);
  };

  return (
    <div>
      <div className="h-full w-96 rounded border border-sky-700 bg-neutral-900/50 p-10">
        <h1 className="w-full pb-4 text-center text-lg font-bold text-neutral-100">
          Generate a Stream ID and send to your friends!
        </h1>
        <div className="block w-full text-center">
          <div>
            <div className="flex w-full items-center  justify-center space-x-2">
              <input
                className="w-full flex-grow rounded border border-gray-600 bg-neutral-800 p-2 text-center text-emerald-500 focus:border-sky-700 focus:outline-none"
                type="text"
                id="generate-stream-id"
                name="Name"
                value={streamId}
                readOnly
              />
              <button onClick={handleCopy}>
                <Copy />
              </button>
            </div>
            <div className="p-2 text-purple-700">
              {copyResult?.state === "success" && "Copied successfully!"}
              {copyResult?.state === "error" && `Error: ${copyResult.message}`}
            </div>
          </div>
          <div>
            <label htmlFor="generate-stream-id">
              {!streamId ? (
                <Button
                  backgroundColor="gray"
                  borderColor="gray"
                  text="Generate ID"
                  onClick={generateID}
                />
              ) : (
                <div>
                  <p className="left mt-2 flex">Chose your username</p>
                  <input
                    className="my-2 w-full flex-grow rounded border border-gray-600 bg-neutral-800 p-2 text-center text-neutral-100 focus:border-sky-700 focus:outline-none"
                    type="text"
                    id="streamer-username"
                    name="streamer-username"
                    value={streamerUsername}
                    onChange={(e) => updateStreamerUsername(e.target.value)}
                    placeholder="Idyllic"
                    maxLength={32}
                  />
                  {isConnectButtonClicked ? (
                    <Button
                      backgroundColor="red"
                      borderColor="gray"
                      text="Cancel"
                      onClick={cancelConnect}
                    />
                  ) : (
                    <Button
                      backgroundColor="purple"
                      borderColor="gray"
                      text="Connect!"
                      onClick={handleConnect}
                    />
                  )}
                </div>
              )}
            </label>
          </div>
        </div>
      </div>
      {!isLoading ? null : <WaitingConnections />}
    </div>
  );
};

export default IdContainer;
