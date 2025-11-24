"use client";

import AirdropForm from "@/components/AirdropForm";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="p-4 md:p-6 xl:p-8 flex items-center justify-center">
      {isConnected ? (
        <AirdropForm />
      ) : (
        <div className="text-lg font-semibold">Please connect a wallet</div>
      )}
    </main>
  );
}
