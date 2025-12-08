"""
Problem Statement:
    Given a non-negative integer x, compute and return the square root of x.
    Since the return type is an integer, the decimal digits are truncated, and only the integer part of the result is returned.

Note: You are not allowed to use any built-in exponent function or operator.

Algorithm (Binary Search):
    1. If x is 0 or 1, return x.
    2. Initialize the search range: left = 1, right = x.
    3. While left <= right:
    a. Calculate mid = (left + right) // 2
    b. If mid * mid == x, return mid (exact square root found)
    c. If mid * mid > x, search in the lower half: right = mid - 1
    d. If mid * mid < x, search in the upper half: left = mid + 1, but keep track of this as a potential result
    4. Return the last value where mid * mid < x (integer part of square root)

Time Complexity: O(log x), where x is the input number
Space Complexity: O(1), as we only use a constant amount of extra space

Note: This algorithm finds the integer part of the square root. For a more precise result,
you can modify it to work with floating-point numbers and specify a precision.
"""

def mySqrt(x: int) -> int:
    if x == 0 or x == 1:
        return x

    left, right = 1, x
    result = 0

    while left <= right:
        mid = (left + right) // 2
        
        if mid * mid == x:
            return mid
        
        if mid * mid > x:
            right = mid - 1
        else:
            left = mid + 1
            result = mid  # Keep track of the last valid answer

    return result

# Example usage
if __name__ == "__main__":
    test_cases = [0, 1, 4, 8, 9, 16, 25, 26, 100, 2147483647]

    for i, x in enumerate(test_cases, 1):
        sqrt = mySqrt(x)
        print(f"Test case {i}:")
        print(f"Input: {x}")
        print(f"Square root: {sqrt}")
        print()