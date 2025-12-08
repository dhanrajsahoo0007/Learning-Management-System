"""
You are given an array prices where prices[i] is the price of a given stock on the ith day.
You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.
Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

Example 1:
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.

Example 2:
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.
"""
from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        """
        Problem: Find the maximum profit from one buy-sell transaction.

        Approach:
        - Track the minimum price seen so far.
        - At each day, calculate the profit if selling today.
        - Keep updating the maximum profit.
        - If no profit is possible, return 0.
        """

        if not prices or len(prices) <= 1:
            return 0

        l, r = 0, 1
        maxP = 0

        while r < len(prices):
            if prices[l] < prices[r]:
                profit = prices[r] - prices[l]
                maxP = max(maxP, profit)
            else:
                l = r
            r += 1
        return maxP

    
if __name__ == "__main__":
    sol = Solution()
    print(sol.maxProfit([7,1,5,3,6,4]))  # Expected 5
    print(sol.maxProfit([7,6,4,3,1]))    # Expected 0
    print(sol.maxProfit([7,3,5,1,6,4]))  # Expected 5
