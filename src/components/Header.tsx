import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();

  const routes = [
    { name: "Home", path: "/" },
    { name: "Streamer", path: "/streamer" },
    { name: "Listener", path: "/listener" },
  ];

  return (
    <>
      <div className={`flex h-16 items-center justify-center bg-indigo-950 `}>
        <div className="w-full text-center">
          <button>
            <Link href="/">
              <div className="flex items-center">
                <h1 className="text-4xl font-bold lg:text-3xl">
                  <span className="text-sky-600">Tunnel</span>
                  <span className="text-purple-800">Screen</span>
                </h1>
              </div>
            </Link>
          </button>
        </div>
      </div>
      <hr className="border-t border-gray-600/10" />
      <div
        className="flex h-10 items-center
       justify-center text-white"
      >
        {routes.map((route) => (
          <Link key={route.path} href={route.path}>
            <span
              className={`mx-2 cursor-pointer font-bold ${
                router.pathname === route.path ? "text-green-600" : ""
              }`}
            >
              {route.name}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Header;
