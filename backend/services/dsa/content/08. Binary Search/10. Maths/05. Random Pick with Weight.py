"""
Problem Statement: Random Pick with Weight

    You are given a 0-indexed array of positive integers w where w[i] describes the weight of the ith index.
    You need to implement the function pickIndex(), which randomly picks an index in the range [0, w.length - 1] (inclusive) and returns it. 
    The probability of picking an index i is w[i] / sum(w).

    For example, if w = [1, 3], the probability of picking index 0 is 1 / (1 + 3) = 0.25 (i.e., 25%), 
    and the probability of picking index 1 is 3 / (1 + 3) = 0.75 (i.e., 75%).

Constraints:
    * 1 <= w.length <= 10^4
    * 1 <= w[i] <= 10^5
    * pickIndex will be called at most 10^4 times

Time Complexity:
    - __init__: O(n), where n is the length of the input array w.
    - pickIndex: O(log n) for each call, using binary search.

Space Complexity: O(n) to store the cumulative sum array.

***This solution uses the concept of cumulative sum and binary search to efficiently implement the weighted random selection.

Explanation with Example:
Let's consider the input weights: w = [1, 3, 2, 4]

1. Initialization (__init__):
   We create a cumulative sum array:
   cumulative_sum = [1, 4, 6, 10]
   total_sum = 10

   This array represents the cumulative weights at each index:
   - Up to index 0: 1
   - Up to index 1: 1 + 3 = 4
   - Up to index 2: 1 + 3 + 2 = 6
   - Up to index 3: 1 + 3 + 2 + 4 = 10

2. Picking an Index (pickIndex):
   When we call pickIndex(), here's what happens:

   a. Generate a random number between 0 and total_sum (10 in this case).
      Let's say we get 7.2.

   b. Use binary search to find where 7.2 would fit in the cumulative_sum array:
      - It's greater than 6 (index 2)
      - It's less than or equal to 10 (index 3)
      Therefore, we return index 3.

   This process ensures that:
    - Index 0 is returned if the random number is <= 1  (1/10 chance)
    - Index 1 is returned if the random number is > 1 and <= 4  (3/10 chance)
    - Index 2 is returned if the random number is > 4 and <= 6  (2/10 chance)
    - Index 3 is returned if the random number is > 6 and <= 10 (4/10 chance)

   These probabilities correspond to the weights in the original array.
"""

from typing import List
import random

class Solution:

    def __init__(self, w: List[int]):
        # Initialize the cumulative sum array
        self.cumulative_sum = []
        total = 0
        for weight in w:
            total += weight
            self.cumulative_sum.append(total)
        # Store the total sum for later use
        self.total_sum = total

    def pickIndex(self) -> int:
        # Generate a random number in the range [0, total_sum)
        target = self.total_sum * random.random()
        
        # Binary search to find the index
        left, right = 0, len(self.cumulative_sum) - 1
        while left < right:
            mid = left + (right - left) // 2
            if self.cumulative_sum[mid] > target:
                right = mid
            else:
                left = mid + 1
        
        # Return the found index
        return left

# Example usage
if __name__ == "__main__":
    # Example with explanation
    w = [1, 3, 2, 4]
    solution = Solution(w)
    print("Example with w =", w)
    print("Cumulative Sum Array:", solution.cumulative_sum)
    print("Total Sum:", solution.total_sum)
    
    # Demonstrate multiple picks
    picks = [solution.pickIndex() for _ in range(1000)]
    frequencies = [picks.count(i) for i in range(len(w))]
    
    print("\nAfter 1000 picks:")
    for i, freq in enumerate(frequencies):
        print(f"Index {i}: {freq} times ({freq/10}%), Expected: {w[i]/sum(w)*100}%")

    print("\nNote: Due to randomness, actual percentages may vary slightly from expected percentages.")