"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useChainId,
  useReadContracts,
  useConfig,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";

import InputField from "@/components/ui/InputField";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants";
import { calculateTotal } from "@/utils";
import { formatUnits, parseEther } from "viem";
import { Button } from "./ui/button";

const AirdropForm = () => {
  const chainId = useChainId();
  const {
    writeContractAsync,
    isPending,
    error,
    data: hash,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
  } = useWaitForTransactionReceipt({
    confirmations: 1,
    hash,
  });
  const config = useConfig();
  const account = useAccount();
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
  const contract = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "name",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "decimals",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "balanceOf",
        args: [account.address],
      },
    ],
  });
  const tokenBalance =
    Number(
      formatUnits(
        (contract.data?.[2].result as bigint) ?? 0,
        (contract.data?.[1].result as number) ?? 18
      )
    ) ?? 0;
  const isValid = useMemo(
    () =>
      tokenAddress !== "" &&
      amounts !== "" &&
      recipients !== "" &&
      total <= tokenBalance,
    [tokenAddress, amounts, recipients, tokenBalance, total]
  );

  const message = useMemo(() => {
    if (total > tokenBalance) {
      return "Insufficient Balance";
    }

    if (isPending) {
      return "Confirming in wallet...";
    }

    if (isConfirming) {
      return "Waiting for transaction to be included...";
    }

    if (isConfirmed) {
      return "Transaction confirmed";
    }

    if (error || isError) {
      return "Error, see console";
    }

    return "Send Tokens";
  }, [tokenBalance, total, isPending, isConfirming, error, isError]);

  useEffect(() => {
    const savedTokenAddress = localStorage.getItem("tokenAddress");
    const savedRecipients = localStorage.getItem("recipients");
    const savedAmounts = localStorage.getItem("amounts");

    if (savedTokenAddress) setTokenAddress(savedTokenAddress);
    if (savedRecipients) setRecipients(savedRecipients);
    if (savedAmounts) setAmounts(savedAmounts);
  }, []);

  useEffect(() => {
    localStorage.setItem("tokenAddress", tokenAddress);
  }, [tokenAddress]);

  useEffect(() => {
    localStorage.setItem("recipients", recipients);
  }, [recipients]);

  useEffect(() => {
    localStorage.setItem("amounts", amounts);
  }, [amounts]);

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

      <Button
        size="lg"
        className="text-base font-semibold"
        onClick={handleSubmit}
        isLoading={isPending}
        disabled={!isValid || isPending}
      >
        {message}
      </Button>

      <div className="p-4 border border-zinc-300 space-y-3 rounded-lg">
        <h3 className="text-zinc-900 font-medium text-sm">
          Transaction Details
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-600 text-sm">Token Name:</span>
            <span className="text-zinc-900 text-base">
              {contract.data && (contract.data?.[0]?.result as string)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-600 text-sm">Amount (wei):</span>
            <span className="text-zinc-900 text-base">
              {total ? parseEther(total.toString()) : ""}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-600 text-sm">Amount (tokens):</span>
            <span className="text-zinc-900 text-base">{total || ""}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirdropForm;
