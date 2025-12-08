"""
Coin Change Problem: Minimum Number of Coins

Problem Statement:
    Given an array of coin denominations and a target amount, find the minimum number of coins needed to make up that amount. 
    If it's not possible to make up the amount with the given coins, return -1.

For example:
    Input: amount = 11, coins = [1,2,5]
    Output: 3
    Explanation: 11 = 5 + 5 + 1

Approach:
    1. Use dynamic programming to solve this problem efficiently.
    2. Create a DP array where dp[i] represents the minimum number of coins needed to make amount i.
    3. Initialize dp[0] = 0 and all other elements to a large value (e.g., amount + 1).
    4. For each coin, update the dp array for all amounts from the coin value to the target amount.
    5. The final answer will be in dp[amount] if it's less than amount + 1, otherwise return -1.


Key Points:
    1. This is a minimization problem, unlike the maximum ways problem.
    2. We use amount + 1 as an initial value because it's larger than any possible valid answer.
    3. The order of considering coins doesn't affect the final result.
    4. We need to handle the case where it's impossible to make the amount.

Code Implementation:
"""

def coin_change_min_coins(amount, coins):
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] <= amount else -1

# Example usage
amount = 11
coins = [1, 2, 5]
result = coin_change_min_coins(amount, coins)
print(f"Minimum number of coins to make {amount} using {coins}: {result}")

"""
Explanation:

    1. We initialize a DP array of size amount + 1 with a value larger than any possible answer (amount + 1).
    2. Set dp[0] = 0 as the base case (0 coins needed to make amount 0).
    3. For each coin:
    - We iterate from the coin value to the target amount.
    - For each amount i, we take the minimum of:
        a) Current value dp[i]
        b) 1 + dp[i - coin] (using the current coin + minimum coins needed for the remaining amount)
    4. The final answer is in dp[amount], unless it's still amount + 1, which means it's impossible.

Let's walk through the example with amount = 11 and coins = [1, 2, 5]:

Initial State

    dp: [0, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]
        0   1   2   3   4   5   6   7   8   9  10  11  (indices/amounts)
    We initialize dp[0] = 0 (it takes 0 coins to make amount 0) and all other values to 12 (amount + 1), which is larger than any possible valid answer for this problem.
        
After Considering Coin 1

    dp: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        0  1  2  3  4  5  6  7  8  9  10  11  (indices/amounts)
    For coin 1, we update each dp[i] as follows:

    dp[1] = min(dp[1], dp[1-1] + 1) = min(12, 0 + 1) = 1
    dp[2] = min(dp[2], dp[2-1] + 1) = min(12, 1 + 1) = 2
    dp[3] = min(dp[3], dp[3-1] + 1) = min(12, 2 + 1) = 3
    ...and so on up to dp[11]

    This represents using only 1-cent coins. For any amount i, we need i coins of 1 cent each.

After Considering Coin 2

dp: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6]
     0  1  2  3  4  5  6  7  8  9  10  11  (indices/amounts)
    
    For coin 2, we update each dp[i] for i ≥ 2 as follows:

    dp[2] = min(dp[2], dp[2-2] + 1) = min(2, 0 + 1) = 1
    dp[3] = min(dp[3], dp[3-2] + 1) = min(3, 1 + 1) = 2
    dp[4] = min(dp[4], dp[4-2] + 1) = min(4, 1 + 1) = 2
    dp[5] = min(dp[5], dp[5-2] + 1) = min(5, 2 + 1) = 3
...and so on up to dp[11]

Now we're considering combinations of 1-cent and 2-cent coins. For example:

For amount 3, we use one 2-cent coin and one 1-cent coin (total 2 coins)
For amount 4, we use two 2-cent coins (total 2 coins)

After Considering Coin 5

    dp: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3]
     0  1  2  3  4  5  6  7  8  9  10  11  (indices/amounts)
For coin 5, we update each dp[i] for i ≥ 5 as follows:

dp[5] = min(dp[5], dp[5-5] + 1) = min(3, 0 + 1) = 1
dp[6] = min(dp[6], dp[6-5] + 1) = min(3, 1 + 1) = 2
dp[7] = min(dp[7], dp[7-5] + 1) = min(4, 2 + 1) = 2
...and so on up to dp[11]

Now we're considering combinations of all coins. Notable updates:

    For amount 5, we now use just one 5-cent coin (total 1 coin)
    For amount 10, we use two 5-cent coins (total 2 coins)
    For amount 11, we use two 5-cent coins and one 1-cent coin (total 3 coins)

Final Result
    The final answer is dp[11] = 3, which means we need a minimum of 3 coins to make up the amount 11.

Time Complexity Analysis: O(amount * len(coins))
    - We have two nested loops:
    - The outer loop runs for each coin: O(len(coins))
    - The inner loop runs from the coin value to the amount: O(amount) in the worst case
    - Total time complexity: O(amount * len(coins))

Space Complexity Analysis: O(amount)
    - We use a 1D DP array of size amount + 1: O(amount)
    - No other significant space is used
    - Overall space complexity: O(amount)

"""