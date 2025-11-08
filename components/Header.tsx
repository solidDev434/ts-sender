import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center gap-4">
        <Link
          href="https://github.com/soliddev/ts-sender"
          rel="noopener noreferrer"
          target="_blank"
          className="transition-colors hover:text-gray-600"
        >
          <FaGithub size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">tsender</h1>
      </div>

      <ConnectButton />
    </header>
  );
};

export default Header;
