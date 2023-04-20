import React, { FC, useState } from "react";
import Button from "../Button";
import { Wifi } from "lucide-react";

interface IdContainerProps {
 getStreamId: (streamId: string) => void;
 handleConnect: () => void;
 isLoading: boolean;
}

const IdContainer: FC<IdContainerProps> = ({
 getStreamId,
 handleConnect,
 isLoading,
}) => {
 const [streamId, setStreamId] = useState<string>("");

 const updateStreamId = (value: string) => {
  setStreamId(value);
  getStreamId(value);
 };

 return (
  <div className="w-96 h-full border border-sky-700 rounded p-10">
   <h1 className="w-full text-center pb-4 text-lg">Paste a Stream ID!</h1>
   <div className="block w-full text-center">
    <div>
     <div className="flex items-center w-full justify-center space-x-2">
      <input
       className="bg-neutral-300/10 rounded text-center border p-1 text-neutral-100 border-gray-200"
       type="text"
       id="stream-id"
       name="Name"
       value={streamId}
       onChange={(e) => updateStreamId(e.target.value)}
      />
      <div className="justify-center items-center mt-2">
       <Button
        backgroundColor="purple"
        borderColor="purple"
        text="Connect!"
        onClick={handleConnect}
       />
      </div>
     </div>

     <div className="flex items-center w-full justify-center text-center space-x-2 mt-4">
      {!isLoading ? null : (
       <>
        <div className="font-bold text-zinc-300">
         Connecting to the stream...
        </div>
        <div className="flex items-center animate-pulse">
         <Wifi className="text-sky-900" />
        </div>
       </>
      )}
     </div>
    </div>
   </div>
  </div>
 );
};

export default IdContainer;
