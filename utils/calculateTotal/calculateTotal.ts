export const calculateTotal = (amounts: string): number => {
  const amountsArray = amounts
    .split(/[\n,]+/)
    .map((amt) => amt.trim())
    .filter((amt) => amt !== "")
    .map((amt) => parseFloat(amt));

  return amountsArray
    .filter((num) => !isNaN(num))
    .reduce((sum, num) => sum + num, 0);
};
