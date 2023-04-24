import BlueButton from "@/components/Buttons/BlueButton";
import PurpleButton from "@/components/Buttons/PurpleButton";
import Link from "next/link";

const HomePage = () => {
  return (
    <div
      className="absolute inset-0 z-0 flex h-screen items-center justify-center bg-neutral-900"
      // style={{
      //   backgroundColor: "rgba(0, 0, 0, 0.5)",
      // }}
    >
      <div
        className="absolute left-0 top-0 h-full w-full"
        // style={{
        //   backgroundImage: `url("/background.jpeg")`,
        //   backgroundRepeat: "no-repeat",
        //   backgroundPosition: "center",
        //   backgroundSize: "cover",
        //   filter: "blur(6px) brightness(50%)",
        //   zIndex: -1,
        // }}
      ></div>
      <div className="relative z-10 text-center">
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
  );
};

export default HomePage;
