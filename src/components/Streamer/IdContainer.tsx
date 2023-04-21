import React, { FC } from "react";
import Button from "../Button";
import { Copy, Wifi } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { WaitingConnections } from "../WaitingConnections";

interface iDContainerProps {
 streamId: string;
 generateID: () => void;
 handleConnect: () => void;
 isLoading: boolean;
}

const IdContainer: FC<iDContainerProps> = ({
 streamId,
 generateID,
 handleConnect,
 isLoading,
}) => {
 const [copyToClipboard, copyResult] = useCopyToClipboard();

 const handleCopy = () => {
  copyToClipboard(streamId);
 };

 return (
  <div className="w-96 h-full border border-sky-700 rounded p-10">
   <h1 className="w-full text-center pb-4 text-lg">
    Generate a Stream ID and send to your friends!
   </h1>
   <div className="block w-full text-center">
    <div>
     <div className="flex items-center w-full  justify-center space-x-2">
      <input
       className="bg-neutral-300/10 rounded text-center border p-1 text-neutral-100 border-gray-200"
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
       <Button
        backgroundColor="purple"
        borderColor="purple"
        text="Connect!"
        onClick={handleConnect}
       />
      )}
     </label>
    </div>
    {!isLoading ? null : <WaitingConnections />}
   </div>
  </div>
 );
};

export default IdContainer;
