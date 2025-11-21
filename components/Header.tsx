import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-5 bg-white shadow-sm shadow-black/5">
      <div className="flex items-center gap-3">
        <Link
          href="https://github.com/soliddev/ts-sender"
          rel="noopener noreferrer"
          target="_blank"
          className="transition-colors hover:text-gray-600"
        >
          <FaGithub size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">tSender</h1>
      </div>

      <ConnectButton />
    </header>
  );
};

export default Header;
