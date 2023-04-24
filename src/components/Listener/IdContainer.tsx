import React, { FC, useState } from "react";
import { ClipboardPaste, Wifi } from "lucide-react";
import ConnectComponent from "./ConnectListenerComponent";
import { WaitingConnections } from "../WaitingConnections";

interface IdContainerProps {
  getStreamId: (streamId: string) => void;
  listenerUsername: string;
  updateListenerUsername: (username: string) => void;
  handleConnect: () => void;
  cancelConnect: () => void;
  isConnectButtonClicked: boolean;
  isLoading: boolean;
}

const IdContainer: FC<IdContainerProps> = ({
  getStreamId,
  listenerUsername,
  updateListenerUsername,
  handleConnect,
  cancelConnect,
  isConnectButtonClicked,
  isLoading,
}) => {
  const [streamId, setStreamId] = useState<string>("");

  const updateStreamId = (value: string) => {
    console.log("Updating stream ID", streamId);
    setStreamId(value);
    getStreamId(value);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      updateStreamId(text);
    } catch (error) {
      console.error("Failed to paste from clipboard:", error);
    }
  };

  return (
    <>
      {isLoading && <WaitingConnections />}
      <div className="h-full w-96 rounded border border-purple-700 bg-neutral-900/50 p-8">
        <h1 className="w-full pb-4 text-center text-lg font-bold text-neutral-100">
          Paste a Stream ID!
        </h1>
        <div className="block w-full text-center">
          <div>
            <div className="flex w-full items-center justify-center space-x-4 align-middle">
              <input
                className="w-full flex-grow rounded border border-gray-600 bg-neutral-800 p-2 text-center text-neutral-100 focus:border-sky-700 focus:outline-none"
                type="text"
                id="stream-id"
                name="Name"
                value={streamId}
                onChange={(e) => updateStreamId(e.target.value)}
                placeholder="Stream ID"
              />
              <button onClick={handlePaste}>
                <ClipboardPaste />
              </button>
            </div>
            {streamId ? (
              <div className="mt-4">
                <ConnectComponent
                  id="listener-username"
                  username={listenerUsername}
                  updateUsername={updateListenerUsername}
                  isConnectButtonClicked={isConnectButtonClicked}
                  cancelConnect={cancelConnect}
                  handleConnect={handleConnect}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default IdContainer;
