"""
Explanation:

1. Memoization:
   We use a dictionary 'memo' to store the results of subproblems. The key is a
   tuple (n, W) representing the current state (number of items and remaining capacity).

2. Base Case:
   Same as the recursive solution - if there are no items left or no capacity,
   we return 0.

3. Memoization Check:
   Before computing a result, we check if it's already in our memo dictionary.
   If it is, we return the memoized result immediately.

4. Recursive Cases:
   The logic is the same as the non-memoized version, but we pass the memo
   dictionary to all recursive calls.

5. Storing Results:
   After computing a result, we store it in the memo dictionary before returning.

Time Complexity: O(nW)
- In the worst case, we solve each subproblem once and store its result.
- There are n*W possible different subproblems (n items, W possible weights).

Space Complexity: O(nW)
- The memoization dictionary can contain up to n*W entries.
- The recursion stack can go up to depth n.
"""

def knapsack_memoized(W, wt, val, n, memo=None):
    if memo is None:
        memo = {}
    
    # Create a unique key for the current state
    key = (n, W)
    
    # Base case: if we have no items or no capacity left
    if n == 0 or W == 0:
        return 0
    
    # If we've already computed this state, return the memoized result
    if key in memo:
        return memo[key]
    
    # If weight of the nth item is more than the capacity W,
    # then this item cannot be included
    if wt[n-1] > W:
        result = knapsack_memoized(W, wt, val, n-1, memo)
    else:
        # Return the maximum of two cases:
        # (1) nth item included
        # (2) nth item not included
        result = max(
            val[n-1] + knapsack_memoized(W - wt[n-1], wt, val, n-1, memo),
            knapsack_memoized(W, wt, val, n-1, memo)
        )
    
    # Memoize the result before returning
    memo[key] = result
    return result


def knapsack_memoized_matrix(W, wt, val, n):
    # Initialize the memoization matrix with -1
    memo = [[-1 for _ in range(W + 1)] for _ in range(n + 1)]
    
    def knapsack_recursive(n, W):
        # Base case: if we have no items or no capacity left
        if n == 0 or W == 0:
            return 0
        
        # If we've already computed this state, return the memoized result
        if memo[n][W] != -1:
            return memo[n][W]
        
        # If weight of the nth item is more than the capacity W,
        # then this item cannot be included
        if wt[n-1] > W:
            result = knapsack_recursive(n-1, W)
        else:
            # Return the maximum of two cases:
            # (1) nth item included
            # (2) nth item not included
            result = max(
                val[n-1] + knapsack_recursive(n-1, W - wt[n-1]),
                knapsack_recursive(n-1, W)
            )
        
        # Memoize the result before returning
        memo[n][W] = result
        return result
    
    # Call the recursive function and return the result
    return knapsack_recursive(n, W)

# Example usage
val = [60, 100, 120]
wt = [10, 20, 30]
W = 50
n = len(val)

print("Items (value, weight):")
for v, w in zip(val, wt):
    print(f"({v}, {w})")
print(f"\nKnapsack capacity: {W}")

max_value = knapsack_memoized(W, wt, val, n)
print(f"\nMaximum value: {max_value}")


"""
Explanation:

1. Memo Matrix:
   We use a 2D matrix 'memo' where memo[i][j] represents the maximum value
   achievable with the first i items and a capacity of j.

2. Initialization:
   The matrix is initialized with -1, indicating that no subproblems have been solved yet.

3. Memoization:
   - Before computing a result, we check if memo[n][W] != -1.
   - After computing a result, we store it in memo[n][W].

4. Recursive Structure:
   The core logic remains the same as the previous memoized version.

5. Visualization:
   The print_memo_matrix function displays the memo after computation:
   - Rows represent the number of items considered (0 to n).
   - Columns represent the weight capacity (0 to W).
   - '-' indicates an unused cell (subproblem that wasn't needed).
   - Numbers show the maximum value for that subproblem.

Time Complexity: O(nW)
Space Complexity: O(nW)

"""

def knapsack_memoized(W, wt, val, n):
    # Initialize the memo matrix with -1
    memo = [[-1 for x in range(W + 1)] for x in range(n + 1)]
    
    def knapsack_recursive(W, wt, val, n):
        # Base case: if we have no items or no capacity left
        if n == 0 or W == 0:
            return 0
        
        # If we've already computed this state, return the memoized result
        if memo[n][W] != -1:
            return memo[n][W]
        
        # If weight of the nth item is more than the capacity W,
        # then this item cannot be included
        if wt[n-1] > W:
            result = knapsack_recursive(W, wt, val, n-1)
        else:
            # Return the maximum of two cases:
            # (1) nth item included
            # (2) nth item not included
            result = max(
                val[n-1] + knapsack_recursive(W - wt[n-1], wt, val, n-1),
                knapsack_recursive(W, wt, val, n-1)
            )
        
        # Memoize the result before returning
        memo[n][W] = result
        return result
    
    return knapsack_recursive(W, wt, val, n), memo


# Example usage
val = [60, 100, 120]
wt = [10, 20, 30]
W = 50
n = len(val)

print("Items (value, weight):")
for v, w in zip(val, wt):
    print(f"({v}, {w})")
print(f"\nKnapsack capacity: {W}")

max_value, memo = knapsack_memoized(W, wt, val, n)
print(f"\nMaximum value: {max_value}")
