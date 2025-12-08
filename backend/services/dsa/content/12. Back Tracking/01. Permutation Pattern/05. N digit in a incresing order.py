"""
Problem Statement:
    Given an integer N, find all N-digit numbers with digits in strictly increasing order.

Time Complexity: O(9^N)
    - In the worst case, we explore 9 choices for each of the N digits.

Space Complexity: O(9^N) for the result list, O(N) for the recursion stack
    - We store all valid numbers in the result list.
    - The recursion depth is at most N.

Explanation:
    This solution uses a recursive approach to generate all N-digit numbers with strictly increasing digits.
    It builds the numbers digit by digit, ensuring each new digit is greater than the previous one.
    For N=1, it handles the case separately to include 0.

Examples:
N = 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
N = 2: [12, 13, 14, 15, 16, 17, 18, 19, 23, 24, 25, 26, 27, 28, 29, 34, 35, 36, 37, 38, 39, 45, 46, 47, 48, 49, 56, 57, 58, 59, 67, 68, 69, 78, 79, 89]
"""

def increasingNumber(n):
    res = []
    
    # Handle n = 1 case explicitly
    if n == 1:
        res = [i for i in range(10)]  # Include 0 for single-digit numbers
        return res
    
    def solve(vec, n):
        # Base case: if we've added n digits
        if n == 0:
            # Combine digits in vec to form a number
            ans = 0
            for digit in vec:
                ans = (ans * 10) + digit
            res.append(ans)
            return
        
        # Recursive case: try adding each possible next digit
        for i in range(1, 10):
            # Only add i if it's greater than the last digit in vec (if any)
            if len(vec) == 0 or i > vec[-1]:
                vec.append(i)  # Add the digit
                solve(vec, n-1)  # Recurse with one less digit to add
                vec.pop()  # Backtrack: remove the digit we just added
    
    # Start the recursion with an empty vector and n digits to add
    solve([], n)
    return res

# Test the function
for n in range(1, 4):
    print(f"All {n}-digit numbers with strictly increasing digits:")
    print(increasingNumber(n))
    print()