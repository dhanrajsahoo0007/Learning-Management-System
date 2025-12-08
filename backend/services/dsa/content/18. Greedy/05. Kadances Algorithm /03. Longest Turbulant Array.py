"""
Problem Statement:
    Given an integer array arr, find the length of the longest turbulent subarray.
    A subarray is turbulent if the comparison sign flips between each adjacent pair of elements.

Explanation:
    refer neetcode explanation , code is different 
    1. We use a sliding window approach with two pointers: 'l' (left) and 'r' (right).
    2. 'ans' keeps track of the maximum turbulent subarray length seen so far.
    3. We handle the base case of a single-element array first.
    4. The outer while loop iterates through the array:
    a. The first inner while loop skips any consecutive duplicate elements.
    b. The second inner while loop expands the window as long as the turbulent property is maintained.
    c. After each expansion, we update 'ans' with the maximum length found.
    d. We then reset the window by moving 'l' to 'r' and incrementing 'r'.

Time Complexity: O(n),
    The outer while loop runs at most n times.
    Across all iterations of the outer loop, the first inner while loop (moving l) can traverse the array at most once, so it's O(n) in total.
    Similarly, the second inner while loop (moving r) can also traverse the array at most once across all iterations, so it's also O(n) in total.
    The constant time operations in the outer loop contribute O(n) in total.

Adding these up: O(n) + O(n) + O(n) = O(n)

Space Complexity: O(1) We use only a constant amount of extra space, regardless of the input size.
"""


from typing import List

class Solution:
    def maxTurbulenceSize(self, arr: List[int]) -> int:
        n = len(arr)
        l, r = 0, 0
        ans = 1
        if n == 1:
            return 1
        while r < n:
            while l < n - 1 and arr[l] == arr[l+1]:  # to handle duplicates
                l += 1
            while r < n - 1 and (arr[r-1] > arr[r] < arr[r+1] or arr[r-1] < arr[r] > arr[r+1]):
                r += 1
            ans = max(ans, r - l + 1)
            l = r
            r += 1
        return ans


# Test cases
if __name__ == "__main__":
    solution = Solution()
    
    # Test case 1
    arr1 = [9,4,2,10,7,8,8,1,9]
    print(f"Test case 1: {arr1}")
    print(f"Output: {solution.maxTurbulenceSize(arr1)}")
    print(f"Expected: 5\n")

    # Test case 2
    arr2 = [4,8,12,16]
    print(f"Test case 2: {arr2}")
    print(f"Output: {solution.maxTurbulenceSize(arr2)}")
    print(f"Expected: 2\n")

    # Test case 3
    arr3 = [100]
    print(f"Test case 3: {arr3}")
    print(f"Output: {solution.maxTurbulenceSize(arr3)}")
    print(f"Expected: 1\n")

    # Test case 4: All equal elements
    arr4 = [1,1,1,1,1]
    print(f"Test case 4: {arr4}")
    print(f"Output: {solution.maxTurbulenceSize(arr4)}")
    print(f"Expected: 1\n")

    # Test case 5: Alternating elements
    arr5 = [1,2,1,2,1,2,1]
    print(f"Test case 5: {arr5}")
    print(f"Output: {solution.maxTurbulenceSize(arr5)}")
    print(f"Expected: 7\n")