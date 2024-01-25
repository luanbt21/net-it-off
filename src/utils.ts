export function findSubsetWithSum(arr: number[]): number[] | null {
  const targetSum = arr.reduce((pre, cur) => pre + cur);
  const n = arr.length;
  const dp: boolean[][] = new Array(n + 1)
    .fill(null)
    .map(() => new Array(targetSum + 1).fill(false));

  // If the targetSum is 0, then an empty subset is always possible
  for (let i = 0; i <= n; i++) {
    dp[i][0] = true;
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= targetSum; j++) {
      // If the current element is greater than the target sum, exclude it
      if (arr[i - 1] > j) {
        dp[i][j] = dp[i - 1][j];
      } else {
        // Include the current element or exclude it
        dp[i][j] = dp[i - 1][j] || dp[i - 1][j - arr[i - 1]];
      }
    }
  }

  // If no subset is found
  if (!dp[n][targetSum]) {
    return null;
  }

  // Reconstruct the subset
  const subset: number[] = [];
  let i = n;
  let j = targetSum;

  while (i > 0 && j > 0) {
    if (dp[i][j] && !dp[i - 1][j]) {
      subset.unshift(arr[i - 1]);
      j -= arr[i - 1];
    }
    i--;
  }

  return subset;
}
