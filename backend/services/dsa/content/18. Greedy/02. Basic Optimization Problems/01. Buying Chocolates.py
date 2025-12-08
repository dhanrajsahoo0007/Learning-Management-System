"""

Problem Statement:
    Buy Two Chocolates
        You are given an integer array prices representing the prices of various chocolates in a store. 
        You are also given a single integer money, which represents your initial amount of money.
        You must buy exactly two chocolates in such a way that you still have some non-negative leftover money. 
        You would like to minimize the sum of the prices of the two chocolates you buy.
        Return the amount of money you will have leftover after buying the two chocolates. 
        If there is no way for you to buy two chocolates without ending up in debt, return money. Note that the leftover must be non-negative.

Explanation:
    1. We initialize two variables (smallest and second_smallest) to store the two
    smallest prices we've seen so far.
    2. We iterate through the prices list once, updating these variables as needed.
    3. After the iteration, we have the two smallest prices.
    4. We calculate the total cost of buying these two chocolates.
    5. If the total cost is less than or equal to our money, we return the leftover.
    6. Otherwise, we return the original amount of money.

Time Complexity: O(n), where n is the length of the prices list.
We only iterate through the list once.

Space Complexity: O(1)
We use only a constant amount of extra space (two variables) regardless of the input size.

"""
from typing import List

class Solution:
    def buyChoco(self, prices: List[int], money: int) -> int:
        # Initialize the two smallest prices to a large value
        smallest = second_smallest = float('inf')
        
        # Iterate through the prices
        for price in prices:
            if price < smallest:
                # Update both smallest and second_smallest
                second_smallest = smallest
                smallest = price
            elif price < second_smallest:
                # Update only second_smallest
                second_smallest = price
        
        # Calculate the total cost of the two cheapest chocolates
        total_cost = smallest + second_smallest
        
        # Check if we can buy the chocolates and have non-negative leftover
        if total_cost <= money:
            return money - total_cost
        else:
            return money

