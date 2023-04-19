import React, { createContext, useEffect, useState } from "react";
import Peer from "simple-peer";

type PeerContextType = Peer.Instance | null;

interface PeerProviderProps {
  children: React.ReactNode;
}

export const PeerContext = createContext<PeerContextType>(null);

export const PeerProvider: React.FC<PeerProviderProps> = ({ children }) => {
  const [peer, setPeer] = useState<Peer.Instance | null>(null);

  useEffect(() => {
    const newPeer = new Peer({ initiator: false });
    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, []);

  return <PeerContext.Provider value={peer}>{children}</PeerContext.Provider>;
};
