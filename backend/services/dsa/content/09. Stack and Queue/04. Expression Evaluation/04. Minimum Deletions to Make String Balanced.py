"""
Problem Statement: Minimum Deletions to Make String Balanced

You are given a string s consisting only of characters 'a' and 'b'.
You can delete any number of characters in s to make s balanced.
s is balanced if there is no pair of indices (i,j) such that i < j and s[i] = 'b' and s[j] = 'a'.
Return the minimum number of deletions needed to make s balanced.

Example 1:
Input: s = "aababbab"
Output: 2
Explanation: You can either delete the characters at 0-indexed positions 2 and 6 ("aababbab" -> "aaabbb"), or
delete the characters at 0-indexed positions 3 and 6 ("aababbab" -> "aabbbb").

Example 2:
Input: s = "bbaaaaabb"
Output: 2
Explanation: The only solution is to delete the first two characters.

Constraints:
- 1 <= s.length <= 10^5
- s[i] is 'a' or 'b'.

All four approaches solve the problem correctly, but they trade off between time complexity, space complexity, and code simplicity. 
Approach-4 is the most optimized in terms of space , efficiency while maintaining a reasonable time complexity.
"""

# Approach-1 (Using stack)
"""
1. Approach-1 (Using stack):
   - We use a stack to keep track of characters.
   - When we encounter a 'b' followed by an 'a', we remove the 'b' and increment the deletion count.
   - This approach directly simulates the deletion process.
   - Time Complexity: O(n) - We iterate through the string once
   - Space Complexity: O(n) - In the worst case, we might push all characters to the stack
   - Pros: Intuitive and straightforward implementation.
   - Cons: Uses extra space for the stack.
"""
class Solution1:
    def minimumDeletions(self, s: str) -> int:
        count = 0
        stack = []
        for char in s:
            if stack and char == 'a' and stack[-1] == 'b':  # Found 'ba' pattern
                stack.pop()  # Remove 'b'
                count += 1   # Increment deletion count
            else:
                stack.append(char)  # Push current character to stack
        return count

# Approach-2 (3 Pass + O(2*n) space)
"""
2. Approach-2 (3 Pass + O(2*n) space):
   - We use two arrays: left_b to store count of 'b's from left, and right_a for 'a's from right.
   - In the first pass, we count 'b's from left to right.
   - In the second pass, we count 'a's from right to left.
   - In the third pass, we find the minimum deletions by summing 'b's to the left and 'a's to the right at each position.
   - Time Complexity: O(3*n) - We make three passes through the string
   - Space Complexity: O(2*n) - We use two arrays of length n
   - Pros: Breaks down the problem into simpler steps.
   - Cons: Uses more space and requires three passes through the string.

"""
class Solution2:
    def minimumDeletions(self, s: str) -> int:
        n = len(s)
        
        left_b = [0] * n  # Array to store count of 'b's from left
        right_a = [0] * n  # Array to store count of 'a's from right
        
        # First pass: Count 'b's from left
        countb = 0
        for i in range(n):
            left_b[i] = countb
            if s[i] == 'b':
                countb += 1
        
        # Second pass: Count 'a's from right
        counta = 0
        for i in range(n-1, -1, -1):
            right_a[i] = counta
            if s[i] == 'a':
                counta += 1
        
        # Third pass: Find minimum deletions
        count = float('inf')
        for i in range(n):
            count = min(count, left_b[i] + right_a[i])
        
        return count

# Approach-3 (2 Pass + O(n) space)
"""
3. Approach-3 (2 Pass + O(n) space):
   - This is an optimization of Approach-2.
   - We only store the count of 'a's from the right.
   - We calculate the count of 'b's on the fly in the second pass.
   - This reduces one pass and halves the space requirement compared to Approach-2.
   - Time Complexity: O(2*n) - We make two passes through the string
   - Space Complexity: O(n) - We use one array of length n
   - Pros: More efficient in terms of space and number of passes.
   - Cons: Slightly more complex logic compared to Approach-1.
"""
class Solution3:
    def minimumDeletions(self, s: str) -> int:
        n = len(s)
        
        right_a = [0] * n  # Array to store count of 'a's from right
        
        # First pass: Count 'a's from right
        counta = 0
        for i in range(n-1, -1, -1):
            right_a[i] = counta
            if s[i] == 'a':
                counta += 1
        
        # Second pass: Find minimum deletions
        count = float('inf')
        countb = 0
        for i in range(n):
            count = min(count, countb + right_a[i])
            if s[i] == 'b':
                countb += 1
        
        return count

# Approach-4 (Constant space)
"""
4. Approach-4 (Constant space):
   - This is a further optimization that achieves constant space complexity.
   - We first count all 'a's in the string.
   - Then, we iterate through the string again, updating the counts of 'a's and 'b's.
   - At each step, we calculate the minimum deletions needed.
   - Time Complexity: O(2*n) - We make two passes through the string
   - Space Complexity: O(1) - We use only a constant amount of extra space
   - Pros: Most space-efficient approach, using only constant extra space.
   - Cons: Requires careful handling of counters and may be less intuitive at first glance.

"""
class Solution4:
    def minimumDeletions(self, s: str) -> int:
        n = len(s)
        
        # First pass: Count all 'a's
        counta = sum(1 for char in s if char == 'a')
        
        # Second pass: Find minimum deletions
        count = float('inf')
        countb = 0
        for char in s:
            if char == 'a':
                counta -= 1
            count = min(count, countb + counta)
            if char == 'b':
                countb += 1
        
        return count

# Test the solutions
if __name__ == "__main__":
    test_cases = [
        "aababbab",
        "bbaaaaabb",
        "aabbab",
        "bababaa",
        "abababa"
    ]
    
    solutions = [Solution1(), Solution2(), Solution3(), Solution4()]
    
    for i, s in enumerate(test_cases, 1):
        print(f"Test case {i}: s = '{s}'")
        for j, sol in enumerate(solutions, 1):
            result = sol.minimumDeletions(s)
            print(f"  Approach {j} output: {result}")
        print()