
"""
0-1 Knapsack Problem

Explanation:

    1. We create a 2D table K where K[i][w] represents the maximum value that can be 
    achieved with the first i items and a maximum weight of w.

    2. We fill this table using two nested loops:
    - The outer loop iterates over the items (0 to n)
    - The inner loop iterates over the weights (0 to W)

    3. For each cell, we decide whether to include the current item or not:
    - If including the item would exceed the weight limit, we don't include it
    - Otherwise, we take the maximum of:
        a) Including the item: val[i-1] + K[i-1][w-wt[i-1]]
        b) Excluding the item: K[i-1][w]

    4. The final answer is in K[n][W], which represents the maximum value achievable 
    using all items and the full weight capacity.

    5. The visualization shows how the table is filled. Each cell represents the 
    maximum value achievable for the corresponding number of items and weight.

Time Complexity: O(nW) - We have two nested loops iterating over n and W.
Space Complexity: O(nW) - We use a 2D array of size (n+1) x (W+1).

"""


def knapsack(W, wt, val, n):
    # Create a matrix of size K[n+1][W+1] as these variables are changing 
    # Initialize a table with 0's
    K = [[0 for _ in range(W + 1)] for _ in range(n + 1)]
    
    # Build table K[][] in bottom-up manner
    for i in range(n + 1):
        for j in range(W + 1):
            if i == 0 or j == 0:
                K[i][j] = 0
            elif wt[i-1] <= j:
                K[i][j] = max(val[i-1] + K[i-1][j-wt[i-1]],  K[i-1][j])
            else:
                K[i][j] = K[i-1][j]
    
    return K[n][W]

# Example usage
val = [60, 100, 120]
wt = [10, 20, 30]
W = 50
n = len(val)

print("Items (value, weight):")
for v, w in zip(val, wt):
    print(f"({v}, {w})")
print(f"\nKnapsack capacity: {W}")

max_value = knapsack(W, wt, val, n)
print(f"\nMaximum value: {max_value}")