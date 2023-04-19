import React from "react";
import { PeerProvider } from "@/components/PeerContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PeerProvider>
      <Component {...pageProps} />
    </PeerProvider>
  );
}
