import Button from "@/components/Button";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="bg-gray-900 h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl lg:text-6xl text-white font-bold mb-8">
          <span className="text-sky-600">Tunnel</span>
          <span className="text-purple-800">Screen</span>
        </h1>
        <div className="flex justify-center space-x-4">
          <Link href="/streamer">
            <Button
              backgroundColor="sky"
              borderColor="gray"
              text="Stream"
              textColor="gray"
            />
          </Link>
          <Link href="/listener">
            <Button
              backgroundColor="purple"
              borderColor="gray"
              text="Watch"
              textColor="gray"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
