"use client";

import { useMemo, useState } from "react";
import { useAccount, useChainId, useConfig, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { useAccountModal } from "@rainbow-me/rainbowkit";

import InputField from "@/components/ui/InputField";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants";
import { calculateTotal } from "@/utils";
import { parseEther } from "viem";
import { Button } from "./ui/button";

const AirdropForm = () => {
  const chainId = useChainId();
  const { writeContractAsync, isPending, data: hash } = useWriteContract();
  const config = useConfig();
  const account = useAccount();
  const { accountModalOpen } = useAccountModal();

  console.log(accountModalOpen);

  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
  const isValid = useMemo(
    () => tokenAddress && amounts && recipients,
    [tokenAddress, amounts, recipients]
  );

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

  // Mint address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
  const handleSubmit = async () => {
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
    }
  };

  return (
    <div className="grid gap-y-6 ring-blue-500/25 ring-[4px] p-6 bg-white rounded-xl border-2 border-blue-500 min-w-full w-full max-w-2xl xl:min-w-lg">
      <InputField
        label="Token Address"
        placeholder="0x"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />

      <InputField
        label="Recipients"
        placeholder="0x123..., 0x456..."
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

      <Button size="lg" isLoading={isPending} disabled={!isValid}>
        Send Tokens
      </Button>
    </div>
  );
};

export default AirdropForm;
