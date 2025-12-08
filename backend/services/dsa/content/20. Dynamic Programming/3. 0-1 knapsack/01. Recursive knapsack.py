
"""
0-1 Knapsack Problem

Problem Statement:
    Given a set of items, each with a weight and a value, determine which items
    to include in a collection so that the total weight is less than or equal to
    a given limit and the total value is as large as possible.

Explanation:

1. The recursive function `knapsack_recursive` takes four parameters:
   - W: remaining weight capacity
   - wt: list of item weights
   - val: list of item values
   - n: number of items left to consider

2. Base case: If there are no items left to consider (n == 0) or no capacity
   left (W == 0), we return 0.

3. If the weight of the current item (wt[n-1]) is more than the remaining
   capacity (W), we can't include this item, so we recursively call the
   function without this item.

4. If we can potentially include the current item, we consider two possibilities
   and return the maximum of:
   a) Including the current item: We add its value (val[n-1]) and recursively
      solve for the remaining items and reduced capacity.
   b) Excluding the current item: We recursively solve for the remaining items
      without changing the capacity.

Time Complexity: O(2^n)
The recursive solution has an exponential time complexity because for each item,
we have two choices (include or exclude), leading to 2^n possible combinations.

Space Complexity: O(n)
The space complexity is O(n) due to the recursion stack, where n is the number
of items. In the worst case, the recursion depth will be equal to the number
of items.

Note: While this recursive solution is more intuitive, it's less efficient than
the dynamic programming approach for larger inputs due to repeated calculations
of the same subproblems. For small inputs, however, it can be a viable solution.
"""


def knapsack_recursive(W, wt, val, n):
    # Base case: if we have no items or no capacity left
    if n == 0 or W == 0:
        return 0
    
    # If weight of the nth item is more than the capacity W,
    # then this item cannot be included
    if wt[n-1] > W:
        return knapsack_recursive(W, wt, val, n-1)
    
    else:
        # Return the maximum of two cases:
        # (1) nth item included
        # (2) nth item not included
        return max(
            val[n-1] + knapsack_recursive(W - wt[n-1], wt, val, n-1),
            knapsack_recursive(W, wt, val, n-1)
        )
    

# Example usage
val = [60, 100, 120]
wt = [10, 20, 30]
W = 50
n = len(val)

print("Items (value, weight):")
for v, w in zip(val, wt):
    print(f"({v}, {w})")
print(f"\nKnapsack capacity: {W}")

max_value = knapsack_recursive(W, wt, val, n)
print(f"\nMaximum value: {max_value}")
