import React, { createContext, useState, useEffect } from "react";
import Peer from "simple-peer";

export const PeerContext = createContext<Peer.Instance | null>(null);

interface PeerProviderProps {
  children: React.ReactNode;
}

export const PeerProvider: React.FC<PeerProviderProps> = ({ children }) => {
  const [peer, setPeer] = useState<Peer.Instance | null>(null);

  useEffect(() => {
    const newPeer = new Peer({
      initiator: false,
      trickle: false,
    });

    newPeer.on("error", (err: Error) => {
      console.error("Peer error:", err);
    });

    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, []);

  return <PeerContext.Provider value={peer}>{children}</PeerContext.Provider>;
};
