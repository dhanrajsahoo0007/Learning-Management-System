"""
Problem Statement:
    Geek wants to climb from the 0th stair to the (n-1)th stair. At a time the Geek can climb either one or two steps. 
    A height[N] array is also given. Whenever the geek jumps from stair i to stair j, the energy consumed in the jump 
    is abs(height[i]- height[j]), where abs() means the absolute difference. Return the minimum energy that can be 
    used by the Geek to jump from stair 0 to stair N-1.

Example:
Input: n = 4
height = {10 20 30 10}
Output: 20
Explanation:
    Geek jump from 1st to 2nd stair(|20-10| = 10 energy lost).
    Then a jump from the 2nd to the last stair(|10-20| = 10 energy lost).
    so, total energy lost is 20 which is the minimum.

Expected Time Complexity: O(n)
Expected Space Complexity: O(n)
Constraint: 1 <= n <= 100000, 1 <= height[i] <= 1000
"""

# 1. Recursive Approach
def MinimumEnergy_recursive(height, n):
    def jump(i):
        if i == 0:
            return 0
        if i == 1:
            return abs(height[1] - height[0])
        
        one_step = jump(i-1) + abs(height[i] - height[i-1])
        two_steps = jump(i-2) + abs(height[i] - height[i-2])
        
        return min(one_step, two_steps)
    
    return jump(n-1)

"""
1. Recursive Approach:
   - Base cases: 
     - If at stair 0, no energy needed.
     - If at stair 1, energy is the absolute difference between heights of stair 0 and 1.
   - For any other stair, we recursively calculate:
     a) Energy needed if we came from the previous stair (one step)
     b) Energy needed if we came from two stairs back (two steps)
   - We return the minimum of these two options.
   Time Complexity: O(2^n) - we potentially make two recursive calls for each step
   Space Complexity: O(n) - maximum depth of the recursion tree

"""


# 2. Memoized Approach
def MinimumEnergy_memoized(height, n):
    memo = [-1] * n
    
    def jump(i):
        if i == 0:
            return 0
        if i == 1:
            return abs(height[1] - height[0])
        
        if memo[i] != -1:
            return memo[i]
        
        one_step = jump(i-1) + abs(height[i] - height[i-1])
        two_steps = jump(i-2) + abs(height[i] - height[i-2])
        
        memo[i] = min(one_step, two_steps)
        return memo[i]
    
    return jump(n-1)


"""
2. Memoized Approach:
   - Similar to the recursive approach, but we store computed results in a memo array.
   - Before computing, we check if the result for the current stair is already in memo.
   - After computing, we store the result in memo before returning.
   Time Complexity: O(n) - we compute the result for each stair only once
   Space Complexity: O(n) - for the memo array and the recursion stack
"""

# 3. Dynamic Programming Approach (Bottom-up)

def MinimumEnergy_dp(height, n):
    dp = [float('inf')] * n
    dp[0] = 0
    
    for i in range(1, n):
        one_step = dp[i-1] + abs(height[i] - height[i-1])
        dp[i] = one_step
        
        if i > 1:
            two_steps = dp[i-2] + abs(height[i] - height[i-2])
            dp[i] = min(dp[i], two_steps)
    
    return dp[n-1]

# Test the function
height = [10, 20, 30, 10]
n = len(height)
result = MinimumEnergy_dp(height, n)
print(f"Minimum energy required: {result}")

"""
Detailed Explanation:

1. Dynamic Programming Approach:
   We use a bottom-up dynamic programming approach. This means we solve smaller subproblems first and use their 
   solutions to build up to the final solution.

2. DP Array Initialization:
   - We create a dp array of size n, initialized with infinity (float('inf')).
   - dp[i] will represent the minimum energy required to reach the i-th stair.
   - We use infinity as the initial value so that any actual calculated value will be smaller.

3. Base Case:
   - dp[0] = 0, because no energy is required to start at the first stair.

4. Iterative Calculation:
   - We iterate from the 1st stair (index 1) to the last stair (index n-1).
   - For each stair, we consider two possible ways to reach it:
     a) Jumping from the previous stair (one step)
     b) Jumping from two stairs back (two steps)

5. One-Step Jump:
   - Energy = dp[i-1] + abs(height[i] - height[i-1])
   - This calculates the energy needed to reach the current stair by jumping from the previous one.
   - We add the energy required to reach the previous stair (dp[i-1]) to the energy lost in this jump.

6. Two-Step Jump:
   - Only possible if i > 1 (we're at least at the 3rd stair)
   - Energy = dp[i-2] + abs(height[i] - height[i-2])
   - This calculates the energy needed to reach the current stair by jumping from two stairs back.

7. Choosing the Minimum:
   - We take the minimum of the one-step and two-step options (if both are available).
   - This ensures dp[i] always holds the minimum energy required to reach the i-th stair.

8. Final Result:
   - After the iteration, dp[n-1] contains the minimum energy required to reach the last stair.

9. Time and Space Complexity:
   - Time Complexity: O(n) because we iterate through the array once.
   - Space Complexity: O(n) for the dp array.

10. Example Walkthrough (for height = [10, 20, 30, 10]):
    - dp[0] = 0 (base case)
    - dp[1] = |20-10| = 10 (only one way to reach)
    - dp[2] = min(dp[1] + |30-20|, dp[0] + |30-10|) = min(10+10, 0+20) = 20
    - dp[3] = min(dp[2] + |10-30|, dp[1] + |10-20|) = min(20+20, 10+10) = 20
    - Final result: dp[3] = 20

This solution efficiently solves the Geek Jump problem by breaking it down into smaller subproblems and 
building up to the final solution, avoiding redundant calculations in the process.
"""