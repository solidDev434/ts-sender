import { testWithSynpress } from "@synthetixio/synpress";
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";
import basicSetup from "../../test/wallet-setup/basic.setup";

const test = testWithSynpress(metaMaskFixtures(basicSetup));

const { expect } = test;

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/TSender/);
});

test("should show the AirdropForm when connected, otherwise, not", async ({
  page,
  context,
  metamaskPage,
  extensionId,
}) => {
  const metamask = new MetaMask(
    context,
    metamaskPage,
    basicSetup.walletPassword,
    extensionId
  );

  await page.goto("/");
  await expect(page.getByText("please connect a wallet")).toBeVisible();

  await page.getByTestId("rk-connect-button").click();
  await page.getByTestId("rk-wallet-option-metaMask").waitFor({
    state: "visible",
    timeout: 30000,
  });
  await page.getByTestId("rk-wallet-option-metaMask").click();

  await metamask.connectToDapp();
  // await expect(page.getByText("please connect a wallet")).not.toBeVisible();
});
