"""
Frog Jump with K Distance Problem

Problem Statement:
    A frog is crossing a river. The river is divided into x units, and at each unit, there may or may not be a stone. 
    The frog can jump on a stone, but it must not jump into the water.

    Given a list of stones' positions (in units) in sorted ascending order, determine if the frog can cross the river 
    by landing on the last stone. Initially, the frog is on the first stone and assumes the first jump must be 1 unit.

    If the frog's last jump was k units, its next jump must be either k - 1, k, or k + 1 units. The frog can only jump 
    in the forward direction.

Input:
    stones: List of integers representing the positions of stones
    n: Number of stones
    k: Maximum jump distance

Output:
    Minimum total cost (energy) to reach the last stone

Example:
    Input: stones = [0, 1, 3, 5, 6, 8, 12, 17], n = 8, k = 5
    Output: 5
    Explanation: The frog can jump to stones at positions 1 (1 unit), 3 (2 units), 5 (2 units), 8 (3 units), and 17 (5 units).
"""
# 1. Recursive Approach
def frog_jump_k_recursive(stones, n, k):
    def jump(i):
        if i == 0:
            return 0
        
        min_cost = float('inf')
        for j in range(1, min(i, k) + 1):
            if i - j >= 0:
                cost = jump(i - j) + abs(stones[i] - stones[i - j])
                min_cost = min(min_cost, cost)
        
        return min_cost
    
    return jump(n - 1)

"""

1. Recursive Approach:
   - Base case: If we're at the first stone (i == 0), no energy is needed.
   - For each stone, we try all possible jumps from 1 to min(i, k) steps back.
   - We recursively calculate the cost for each jump and choose the minimum.
   - Time Complexity: O(k^n) - we potentially make k recursive calls for each of the n stones.
   - Space Complexity: O(n) for the recursion stack.

"""

# 2. Memoized Approach
def frog_jump_k_memoized(stones, n, k):
    memo = [-1] * n
    
    def jump(i):
        if i == 0:
            return 0
        
        if memo[i] != -1:
            return memo[i]
        
        min_cost = float('inf')
        for j in range(1, min(i, k) + 1):
            if i - j >= 0:
                cost = jump(i - j) + abs(stones[i] - stones[i - j])
                min_cost = min(min_cost, cost)
        
        memo[i] = min_cost
        return min_cost
    
    return jump(n - 1)

"""
2. Memoized Approach:
   - Similar to the recursive approach, but we store computed results in a memo array.
   - Before computing, we check if the result for the current stone is already in memo.
   - After computing, we store the result in memo before returning.
   - Time Complexity: O(n * k) - we compute the result for each stone only once, considering k jumps.
   - Space Complexity: O(n) for the memo array and the recursion stack.
"""

# 3. Dynamic Programming Approach
def frog_jump_k_dp(stones, n, k):
    # Initialize dp array
    dp = [float('inf')] * n
    dp[0] = 0  # Starting position

    # Iterate through all stones
    for i in range(1, n):
        # Check all possible jumps from 1 to k
        for j in range(1, min(i, k) + 1):
            # Calculate the cost of jumping from stone i-j to stone i
            cost = dp[i-j] + abs(stones[i] - stones[i-j])
            # Update dp[i] if this jump is cheaper
            dp[i] = min(dp[i], cost)

    # Return the minimum cost to reach the last stone
    return dp[n-1]

# Test the function
stones = [0, 1, 3, 5, 6, 8, 12, 17]
n = len(stones)
k = 5
result = frog_jump_k_dp(stones, n, k)
print(f"Minimum energy required: {result}")

"""
Explanation:

1. Problem Understanding:
   - The frog starts at the first stone (index 0).
   - It can jump up to K units forward.
   - The goal is to reach the last stone with minimum energy cost.
   - The energy cost of a jump is the absolute difference between the heights of the stones.

2. Dynamic Programming Approach:
   - We use a bottom-up DP approach to solve this problem.
   - dp[i] represents the minimum energy required to reach the i-th stone.

3. DP Array Initialization:
   - Initialize dp array with infinity for all positions except the first.
   - Set dp[0] = 0, as the frog starts at the first stone with no energy cost.

4. Iterative Calculation:
   - For each stone from index 1 to n-1:
     - Consider all possible jumps from 1 to min(i, k) units back.
     - For each jump, calculate the cost: dp[i-j] + abs(stones[i] - stones[i-j])
     - Update dp[i] with the minimum cost found.

5. Final Result:
   - After the iteration, dp[n-1] contains the minimum energy required to reach the last stone.

6. Time Complexity: O(n * k)
   - We have two nested loops: one iterating through n stones, and another considering up to k jumps.

7. Space Complexity: O(n)
   - We use a DP array of size n to store intermediate results.

8. Optimization Note:
   - This solution assumes that the frog can always reach the next stone within k jumps.
   - In a more complex version, we might need to check if a jump is valid before considering its cost.

This solution efficiently handles the variable jump distance K, making it more flexible than the original problem 
where K was fixed at 2. It demonstrates how dynamic programming can be adapted to solve more complex variations 
of a problem.
"""