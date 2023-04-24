import BlueButton from "@/components/Buttons/BlueButton";
import PurpleButton from "@/components/Buttons/PurpleButton";
import Header from "@/components/Header";
import Link from "next/link";

const HomePage = () => {
  return (
    <div>
      <Header />
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-8 text-4xl font-bold text-white lg:text-6xl">
            <span className="text-sky-600">Tunnel</span>
            <span className="text-purple-800">Screen</span>
          </h1>
          <div className="m-8 text-lg">
            <span>
              Stream to your friends in high quality video & audio for free!
            </span>
          </div>
          <div className="flex justify-center space-x-4">
            <Link href="/streamer">
              <BlueButton text="Stream" />
            </Link>
            <Link href="/listener">
              <PurpleButton text="Watch" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
