"use client";

import { useMemo, useState } from "react";
import { useAccount, useChainId, useConfig, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";

import InputField from "@/components/ui/InputField";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants";
import { calculateTotal } from "@/utils";
import { parseEther } from "viem";

const AirdropForm = () => {
  const chainId = useChainId();
  const { writeContractAsync, isPending, data: hash } = useWriteContract();
  const config = useConfig();
  const account = useAccount();
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const total: number = useMemo(() => calculateTotal(amounts), [amounts]);

  const getApprovedAmount = async (
    tSenderAddress: string | null
  ): Promise<number> => {
    if (!tSenderAddress) {
      alert("No address found, please use a supported chain");
      return 0;
    }

    const response = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address, tSenderAddress as `0x${string}`],
    });

    return response as number;
  };

  console.log(
    amounts
      .split(/[,\n]+/)
      .map((amt) => amt.trim())
      .filter((amt) => amt !== "")
      .map((amt) => parseEther(amt)),
    tokenAddress,
    BigInt(total),
    parseEther(`${total}`)
  );

  // Mint address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
  const handleSubmit = async () => {
    // 1. Approve our tsender contract to send our tokens
    // 1a. If already approved, move to step 2
    // 2. Call the airdrop function on our tsender contract
    // 3. Wait for transaction to be mined
    const tsenderAddress = chainsToTSender[chainId]["tsender"];
    const approvedAmount = await getApprovedAmount(tsenderAddress);

    if (approvedAmount < total) {
      const approvalHash = await writeContractAsync({
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [tsenderAddress, parseEther(`${total}`)],
      });
      const approvalReceipt = await waitForTransactionReceipt(config, {
        hash: approvalHash,
      });
      console.log("Approval confirmed", approvalReceipt);

      await writeContractAsync({
        abi: tsenderAbi,
        address: tsenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress,
          recipients
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ""),
          amounts
            .split(/[,\n]+/)
            .map((amt) => amt.trim())
            .filter((amt) => amt !== "")
            .map((amt) => parseEther(amt)),
          parseEther(`${total}`),
        ],
      });
    } else {
      await writeContractAsync({
        abi: tsenderAbi,
        address: tsenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress,
          recipients
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ""),
          amounts
            .split(/[,\n]+/)
            .map((amt) => amt.trim())
            .filter((amt) => amt !== "")
            .map((amt) => parseEther(amt)),
          parseEther(`${total}`),
        ],
      });
      console.log("successful");
    }

    console.log("reading", approvedAmount);
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
