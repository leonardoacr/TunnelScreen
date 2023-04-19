import Button from "@/components/Button";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="w-full items-center justify-center h-screen flex">
      <div className="block">
        <h1>TunnelScreen!</h1>
        <div>
          <Link href="/streamer">
            <Button backgroundColor="red" borderColor="gray" text="Stream" />
          </Link>
          <Link href="/listener">
            <Button backgroundColor="purple" borderColor="gray" text="Watch" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
