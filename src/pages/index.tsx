import React, { useEffect, useState } from "react";
import Streamer from "@/components/Streamer";
import Listener from "@/components/Listener";
import { io } from "socket.io-client";

const Home = () => {
  const [streamMode, setStreamMode] = useState<string>();

  const handleStreamerClick = () => {
    setStreamMode("streamer");
  };

  const handleListenerClick = () => {
    setStreamMode("listener");
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button
        className="bg-red-800 mb-2 hover:bg-red-700  text-zinc-50  py-1.5 px-4 w-36 border border-gray-800 rounded shadow"
        onClick={handleStreamerClick}
      >
        I want to stream
      </button>
      <button
        className="bg-purple-800 mb-2 hover:bg-purple-700  text-zinc-50  py-1.5 px-4 w-36 border border-gray-800 rounded shadow"
        onClick={handleListenerClick}
      >
        I want to listen
      </button>
      {streamMode === "streamer" ? <Streamer /> : null}
      {streamMode === "listener" ? <Listener /> : null}
    </div>
  );
};

export default Home;
