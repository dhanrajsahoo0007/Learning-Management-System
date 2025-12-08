"""
Problem Statement: Find the Smallest Divisor Given a Threshold
    
    Given an array of integers nums and an integer threshold, we will choose a positive integer divisor, 
    divide all the array by it, and sum the division's result. Find the smallest divisor such that the 
    result mentioned above is less than or equal to threshold.

    Each result of the division is rounded to the nearest integer greater than or equal to that element. 
    (For example: 7/3 = 3 and 10/2 = 5).

    The test cases are generated so that there will be an answer.

Example 1:
    Input: nums = [1,2,5,9], threshold = 6
    Output: 5
    Explanation: We can get a sum to 17 (1+2+5+9) if the divisor is 1. 
    If the divisor is 4 we can get a sum of 7 (1+1+2+3) and if the divisor is 5 the sum will be 5 (1+1+1+2). 

Example 2:
    Input: nums = [44,22,33,11,1], threshold = 5
    Output: 44

Constraints:
    * 1 <= nums.length <= 5 * 10^4
    * 1 <= nums[i] <= 10^6
    * nums.length <= threshold <= 10^6

Solution Explanation:
    The solution uses a binary search approach to find the smallest divisor:

    1. We define a helper function 'calculate_sum' that calculates the sum of divisions rounded up for a given divisor.
    2. In the main function 'smallestDivisor', we perform a binary search on the possible divisors:
        - The minimum possible divisor is 1.
        - The maximum possible divisor is the maximum number in the input array.
    3. We keep narrowing down our search range until we find the smallest divisor that makes the sum less than or equal to the threshold.

Time Complexity: O(n * log(max(nums))), where n is the length of the nums array.
    - The binary search takes O(log(max(nums))) iterations.
    - In each iteration, we call the 'calculate_sum' function which takes O(n) time.

Space Complexity: O(1), as we only use a constant amount of extra space.

"""

from typing import List
import math

class Solution:
    def calculate_sum(self, nums: List[int], divisor: int) -> int:
        # Initialize the variable to store the total sum
        total_sum = 0
        
        # Iterate through each number in the array
        for num in nums:
            # Calculate the division result rounded up and add to total
            # math.ceil() is used to round up the division result
            total_sum += math.ceil(num / divisor)
        
        # Return the total sum
        return total_sum

    def smallestDivisor(self, nums: List[int], threshold: int) -> int:
        # Initialize the binary search range
        left = 1  # Minimum possible divisor
        right = max(nums)  # Maximum possible divisor

        while left < right:
            # Calculate the middle divisor
            mid = left + (right - left) // 2

            # Check if the sum with mid as divisor is less than or equal to threshold
            if self.calculate_sum(nums, mid) <= threshold:
                # If possible, try to minimize the divisor further
                right = mid
            else:
                # If not possible, increase the lower bound
                left = mid + 1

        # Return the smallest divisor that satisfies the condition
        return left

# Example usage
if __name__ == "__main__":
    solution = Solution()

    # Example 1
    nums1 = [1, 2, 5, 9]
    threshold1 = 6
    result1 = solution.smallestDivisor(nums1, threshold1)
    print(f"Example 1 - Input: nums = {nums1}, threshold = {threshold1}")
    print(f"Output: {result1}")
    print()

    # Example 2
    nums2 = [44, 22, 33, 11, 1]
    threshold2 = 5
    result2 = solution.smallestDivisor(nums2, threshold2)
    print(f"Example 2 - Input: nums = {nums2}, threshold = {threshold2}")
    print(f"Output: {result2}")