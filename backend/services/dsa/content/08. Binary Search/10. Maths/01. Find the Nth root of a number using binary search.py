"""
Problem Statement:
    Given two integers N and M, find the Nth root of M. 
    The Nth root of a number M is a number R such that R^N equals M.
    If the Nth root is not an integer, return -1.

Example:
    Input: n = 3, m = 27
    Output: 3
    Explanation: 3 is the cube root of 27 (3^3 = 27)

    Input: n = 3, m = 9
    Output: -1
    Explanation: The cube root of 9 is not an integer (2.08...)

Algorithm (Binary Search):
    1. Define a helper function 'func' to calculate mid^n and compare with m:
        - Return 1 if mid^n == m (exact root found)
        - Return 2 if mid^n > m (current mid is too large)
        - Return 0 if mid^n < m (current mid is too small)
    2. In the main NthRoot function:
        - Initialize the search range: low = 1, high = m
        - While low <= high:
            a. Calculate mid = (low + high) // 2
            b. Call func(mid, n, m) to compare mid^n with m
            c. If func returns 1, we've found the exact root, return mid
            d. If func returns 0, search in the upper half: low = mid + 1
            e. If func returns 2, search in the lower half: high = mid - 1
    3. If no integer Nth root is found, return -1

Time Complexity: O(log(M) * N), where M is the number and N is the root we're finding
Space Complexity: O(1), as we only use a constant amount of extra space

Note: This algorithm finds the integer Nth root. If no integer Nth root exists, it returns -1.
"""

# This function checks if 'mid' is the nth root of 'm'
def func(mid: int, n: int, m: int) -> int:
    ans = 1
    for i in range(1, n + 1):
        ans *= mid
        if ans > m:
            return 2  # If ans > m, mid is too large
    if ans == m:
        return 1  # If ans == m, mid is the exact nth root
    return 0  # If ans < m, mid is too small

# This function finds the integer nth root of m using binary search
def NthRoot(n: int, m: int) -> int:
    low = 1
    high = m
    while low <= high:
        mid = (low + high) // 2
        midN = func(mid, n, m)
        if midN == 1:
            return mid  # Exact nth root found
        elif midN == 0:
            low = mid + 1  # Search in upper half
        else: # if mid is 2
            high = mid - 1  # Search in lower half
    return -1  # No integer nth root exists


# Example usage
if __name__ == "__main__":
    test_cases = [
        (3, 27),   # Cube root of 27
        (2, 9),    # Square root of 9
        (4, 256),  # 4th root of 256
        (3, 9),    # Cube root of 9 (not an integer)
        (2, 16),   # Square root of 16
        (5, 243),  # 5th root of 243 (3^5)
        (3, 1000), # Cube root of 1000 (10)
        (10, 1024) # 10th root of 1024 (2^10)
    ]

    for i, (n, m) in enumerate(test_cases, 1):
        result = NthRoot(n, m)
        print(f"Test case {i}:")
        print(f"Find the {n}th root of {m}")
        if result != -1:
            print(f"Result: {result}")
            print(f"Verification: {result}^{n} = {result**n}")
        else:
            print("No integer root exists")
        print()