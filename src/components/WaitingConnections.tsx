import { Wifi } from "lucide-react";

export const WaitingConnections = () => {
 return (
  <div className="flex items-center w-full justify-center text-center space-x-2 mt-4">
   <div className="font-bold text-zinc-300">Waiting for connections</div>
   <div className="flex items-center animate-pulse">
    <Wifi className="text-sky-900" />
   </div>
  </div>
 );
};
