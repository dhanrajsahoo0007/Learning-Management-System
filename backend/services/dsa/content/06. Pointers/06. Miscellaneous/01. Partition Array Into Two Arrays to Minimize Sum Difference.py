"""
2035. Partition Array Into Two Arrays to Minimize Sum Difference
Solved
Hard
Topics
Companies
Hint
You are given an integer array nums of 2 * n integers. You need to partition nums into two arrays of length n to minimize the absolute difference of the sums of the arrays. To partition nums, put each element of nums into one of the two arrays.

Return the minimum possible absolute difference.

 

Example 1:

example-1
Input: nums = [3,9,7,3]
Output: 2
Explanation: One optimal partition is: [3,9] and [7,3].
The absolute difference between the sums of the arrays is abs((3 + 9) - (7 + 3)) = 2.
Example 2:

Input: nums = [-36,36]
Output: 72
Explanation: One optimal partition is: [-36] and [36].
The absolute difference between the sums of the arrays is abs((-36) - (36)) = 72.
Example 3:

example-3
Input: nums = [2,-1,0,4,-2,-9]
Output: 0
Explanation: One optimal partition is: [2,4,-9] and [-1,0,-2].
The absolute difference between the sums of the arrays is abs((2 + 4 + -9) - (-1 + 0 + -2)) = 0.
 

Constraints:

1 <= n <= 15
nums.length == 2 * n
-107 <= nums[i] <= 107
"""
class Solution:
    def minimumDifference(self, nums: List[int]) -> int:
        n = len(nums) // 2
        total = sum(nums)

        first_half = nums[:n]
        second_half = nums[n:]

        def generate_sums(arr):
            result = collections.defaultdict(list)
            for i in range(n+1):
                for combo in itertools.combinations(arr, i):
                    result[i].append(sum(combo))
            return result
        
        left_sums = generate_sums(first_half)
        right_sums = generate_sums(second_half)

        for count in right_sums:
            right_sums[count].sort()
        
        min_diff = float('inf')
        target = total // 2

        for left_count in range(n+1):
            right_count = n - left_count
            if right_count not in right_sums:
                continue
            for left_sum in left_sums[left_count]:
                right_vals = right_sums[right_count]
                idx = bisect.bisect_left(right_vals, target - left_sum)

                for j in [idx-1, idx]:
                    if 0 <= j < len(right_vals):
                        curr_sum = left_sum + right_vals[j]
                        min_diff = min(min_diff, abs(total - 2*curr_sum))
        return min_diff

