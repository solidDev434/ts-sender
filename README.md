1. Create a basic react/nextjs application
2. Connect wallet with a nicer connect application
3. Implement this function

```javascript
function airdropERC20(
    address tokenAddress,
    address[] calldata recipients,
    uint256[] calldata amounts,
    unint256 totalAmount
)
```

4. e2e testing
   1. When we connect, we see the form
   2. When disconnected, we don't
5. Deploy to Fleek

### Installing packages not in PNPM, eg:

- pnpm create -D playwright@latest

### Download Browsers (Step 2)

- pnpm exec playwright install

### Running Playwrite via GUI

- pnpm exec playwright test --ui

### Running Playwrite via CLI

- pnpm exec playwright test

### Running Playwrite via CLI with debug

- pnpm exec playwright test --debug

### Running Playwrite via CLI with debug and browser

- pnpm exec playwright test --debug --headed
