import { Wifi } from "lucide-react";

export const WaitingConnections = () => {
  return (
    <div className="mt-6 flex items-center justify-center space-x-2 text-center font-semibold">
      <div className="text-lg font-bold text-neutral-200">
        Waiting for connections
      </div>
      <div className="flex animate-pulse items-center">
        <Wifi className="h-8 w-8 text-sky-500" />
      </div>
    </div>
  );
};
