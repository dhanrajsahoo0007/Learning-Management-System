"""
"""
class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        """
        Pass a window calculate intermediate sums, shrink window
        T -  O(n)
        S - O(1)
        """
        minimal_subarray_len = float('inf')
        window_start = window_end = 0
        current_sum = 0


        while window_end < len(nums):
            # print(f"Window: {nums[window_start: window_end+1]} -> [{current_sum}]")
            current_num = nums[window_end]
            current_sum = current_sum + current_num
            while current_sum >= target:
                current_len = window_end - window_start + 1
                minimal_subarray_len = min(current_len, minimal_subarray_len)

                number_to_remove = nums[window_start]
                if current_sum -  number_to_remove >= target:
                    window_start += 1
                    current_sum -= number_to_remove
                else:
                    break
            window_end += 1
        return 0 if minimal_subarray_len == float('inf') else minimal_subarray_len
