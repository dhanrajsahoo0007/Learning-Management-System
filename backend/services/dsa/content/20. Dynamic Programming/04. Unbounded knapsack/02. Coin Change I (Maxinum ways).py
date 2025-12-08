"""
Maximum Ways of Coin Change - Adapted from Rod Cutting

Problem Statement:
    Given an array of coin denominations and a target amount, find the number of different ways to make up that amount using the given coins.
    You may assume that you have an infinite number of each kind of coin.

Approach:
    1. We'll adapt the given rod_cutting function to solve the coin change problem.
    2. Instead of maximizing value, we'll count the number of ways.
    3. We'll use addition instead of maximization in our DP table.

Key Points:
    1. The 'length' parameter in rod_cutting becomes our 'amount' in coin change.
    2. 'prices' becomes our coin denominations.
    3. We're counting combinations, not permutations, so the order of coins doesn't matter.
    4. We need to handle the base case differently for coin change.


Explanation:

1. We adapt the rod_cutting function to solve the coin change problem:
   - 'length' becomes 'amount'
   - 'prices' becomes 'coins'
   -  We use 'wt' directly as our coin denominations
   - 'val' is set to all 1's as we're counting ways, not maximizing value

2. We initialize the DP table with an extra row and column:
   - K[i][j] represents the number of ways to make amount j using the first i coins

3. We set K[i][0] = 1 for all i, as there's one way to make amount 0 (by not using any coins)

4. We fill the table in a bottom-up manner:
   - If the current coin denomination (wt[i-1]) is less than or equal to the current amount (w),
     we add two values:
     a) K[i][w-wt[i-1]]: ways to make the amount by including this coin
     b) K[i-1][w]: ways to make the amount without using this coin
   - If the coin denomination is larger than the current amount, we just copy the value from the previous row

5. The final answer is in K[n][amount]

Time Complexity Analysis:
    - We have two nested loops:
    - The outer loop runs n times (number of coin denominations)
    - The inner loop runs amount times
    - Total time complexity: O(n * amount)

Space Complexity Analysis:
    - We use a 2D DP table of size (n+1) * (amount+1): O(n * amount)
    - Overall space complexity: O(n * amount)

Let's walk through a small example:
coins = [1, 2, 5], amount = 5

The DP table will be:

        0   1   2   3   4   5  (amount)
    0   1   0   0   0   0   0
    1   1   1   1   1   1   1
    2   1   1   2   2   3   3
    5   1   1   2   2   3   4

The final answer is 4, which means there are 4 ways to make amount 5 using the given coins.

Code Implementation:
"""

def coin_change_ways(amount, coins):
    n = len(coins)
    
    # Create lists for weights (coin denominations) and values (always 1 for counting)
    wt = coins
    val = [1] * n  # We're counting ways, so each coin contributes 1 to the count
    
    # Initialize a table with 0's
    K = [[0 for x in range(amount + 1)] for x in range(n + 1)]
    
    # Initialize the first row: one way to make amount 0
    for i in range(n + 1):
        K[i][0] = 1
    
    # Build table K[][] in bottom-up manner
    for i in range(1, n + 1):
        for w in range(1, amount + 1):
            if wt[i-1] <= w:
                # Instead of max, we use addition to count all possible ways
                K[i][w] = K[i][w-wt[i-1]] + K[i-1][w]
            else:
                K[i][w] = K[i-1][w]
    
    return K[n][amount]

# Example usage
coins = [1, 2, 5]
amount = 5
result = coin_change_ways(amount, coins)
print(f"Number of ways to make {amount} using coins {coins}: {result}")
# Additional test cases
print(coin_change_ways(10, [2, 5, 3, 6]))  # Should return 5
print(coin_change_ways(4, [1, 2, 3]))  # Should return 4
print(coin_change_ways(0, [1, 2, 3]))  # Should return 1


