"use client";

import { useState } from "react";
import { useAccount, useChainId, useConfig } from "wagmi";
import { readContract } from "@wagmi/core";
import InputField from "@/components/ui/InputField";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants";

const AirdropForm = () => {
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  console.log(chainId);

  const getApprovedAmount = async (
    tSenderAddress: string | null
  ): Promise<number> => {
    if (!tSenderAddress) {
      alert("No address found, please use a supported chain");
      return 0;
    }
    console.log(tSenderAddress);

    const response = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address, tSenderAddress as `0x${string}`],
    });
    console.log(response);

    return response as number;
  };

  const handleSubmit = async () => {
    console.log(tokenAddress, recipients, amounts);
    // 1. Approve our tsender contract to send our tokens
    // 1a. If already approved, move to step 2
    // 2. Call the airdrop function on our tsender contract
    // 3. Wait for transaction to be mined
    const tsenderAddress = chainsToTSender[chainId]["tsender"];
    const approvedAmount = await getApprovedAmount(tsenderAddress);
    console.log(approvedAmount);
  };

  return (
    <div>
      <InputField
        label="Token Address"
        placeholder="0x"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />

      <InputField
        label="Recipients"
        placeholder="0x1234,0x3434"
        value={recipients}
        onChange={(e) => setRecipients(e.target.value)}
        large
      />

      <InputField
        label="Amount"
        placeholder="100,200,300..."
        value={amounts}
        onChange={(e) => setAmounts(e.target.value)}
        large
      />

      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disable:cursor-not-allowed"
      >
        Send Tokens
      </button>
    </div>
  );
};

export default AirdropForm;
