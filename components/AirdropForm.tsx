"use client";

import { useState } from "react";
import { useChainId } from "wagmi";
import InputField from "@/components/ui/InputField";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";

const AirdropForm = () => {
  const chainId = useChainId();
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  console.log(chainId);

  const handleSubmit = async () => {
    console.log(tokenAddress, recipients, amounts);
    // 1. Approve our tsender contract to send our tokens
    // 1a. If already approved, move to step 2
    // 2. Call the airdrop function on our tsender contract
    // 3. Wait for transaction to be mined
    const tsenderAddress = chainsToTSender[chainId]; // Replace with your tsender contract address
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

      <button onClick={handleSubmit}>Send Tokens</button>
    </div>
  );
};

export default AirdropForm;
