"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { anvil, zksync } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const projectID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const config = getDefaultConfig({
  appName: "TSender",
  projectId: projectID,
  chains: [anvil, zksync],
  ssr: false,
});

const queryClient = new QueryClient();

export const WalletProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
