"""
Problem Statement:
    Given an array of integers 'nums' and an integer 'k', return the total number of subarrays whose sum equals to 'k'.
    A subarray is a contiguous non-empty sequence of elements within an array.

Example 1:
    Input: nums = [1,1,1], k = 2
    Output: 2

Example 2:
    Input: nums = [1,2,3], k = 3
    Output: 2

Constraints:
    * 1 <= nums.length <= 2 * 10^4
    * -1000 <= nums[i] <= 1000
    * -10^7 <= k <= 10^7

Solution:
    • This solution uses a sliding window approach with two pointers, i and j.
    • We expand the window by moving j to the right and adding nums[j] to the window sum.
    • If the window sum exceeds k, we shrink the window from the left by moving i.
    • When we find a window sum equal to k, we increment the count.
    • We also check for subarrays starting from i+1 to j that sum to k.

Time Complexity: O(n^2) in the worst case, where n is the length of nums.
The outer while loop runs n times, and for each iteration, we might need to run the inner while loop up to n times.

Space Complexity: O(1) as we only use a constant amount of extra space.
"""


class Solution(object):
    def subarraySum(self, nums, k):
        n = len(nums)
        window_count = 0
        window_sum = 0
        i = 0
        j = 0

        while j < n:
            # Expand the window
            window_sum += nums[j]

            # If window_sum exceeds k, first check if i <= j, then shrink the window
            if window_sum > k and i <= j:
                while window_sum > k and i <= j:
                    window_sum -= nums[i]
                    i += 1

            # If window_sum equals k, update window_count
            if window_sum == k:
                window_count += 1

            # Check for subarrays starting from i+1 to j
            temp_sum = window_sum
            temp_i = i
            while temp_i < j:
                temp_sum -= nums[temp_i]
                if temp_sum == k:
                    window_count += 1
                temp_i += 1

            # Move to the next element
            j += 1

        return window_count
    
"""
## Todo
Optimal Solution Explanation:
    • Uses a hash map to store cumulative sum frequencies
    • Iterates through the array once, calculating cumulative sum
    • Checks if (cum_sum - k) exists in hash map, indicating a subarray summing to k
    • Hash map tracks number of times each cumulative sum is seen, handling zero/negative numbers

Time Complexity: O(n), where n is the length of nums. Single pass through the array.
Space Complexity: O(n) worst case, potentially storing all cumulative sums in the hash map.
"""

class Solution:
    def subarraySum(self, nums: list[int], k: int) -> int:
        # Initialize count of subarrays summing to k
        count = 0
        # Running sum of elements
        cum_sum = 0
        # Hash map to store frequency of cumulative sums
        # Initialize with 0:1 for subarrays starting from index 0
        sum_freq = {0: 1}

        for num in nums:
            # Update cumulative sum
            cum_sum += num

            # If (cum_sum - k) exists in sum_freq, we've found subarray(s) summing to k
            if cum_sum - k in sum_freq:
                count += sum_freq[cum_sum - k]

            # Update frequency of current cumulative sum
            sum_freq[cum_sum] = sum_freq.get(cum_sum, 0) + 1

        return count