"""
Smallest Range Covering Elements from K Lists 
lc: 632
diff: HARD

632. Smallest Range Covering Elements from K Lists
You have k lists of sorted integers in non-decreasing order. Find the smallest range that includes at least one number from each of the k lists.

We define the range [a, b] is smaller than range [c, d] if b - a < d - c or a < c if b - a == d - c.

 

Example 1:

Input: nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]
Output: [20,24]
Explanation: 
List 1: [4, 10, 15, 24,26], 24 is in range [20,24].
List 2: [0, 9, 12, 20], 20 is in range [20,24].
List 3: [5, 18, 22, 30], 22 is in range [20,24].
Example 2:

Input: nums = [[1,2,3],[1,2,3],[1,2,3]]
Output: [1,1]
 

Constraints:

nums.length == k
1 <= k <= 3500
1 <= nums[i].length <= 50
-105 <= nums[i][j] <= 105
nums[i] is sorted in non-decreasing order.
"""

class Solution:
    def smallestRange(self, nums: List[List[int]]) -> List[int]:
        """
        first set the minimum range from the lists in a iteration
        populate the heap with all the 0th elements from the k lists
        find the initial range
        1. next keep iterating till you reach the end of any of the list
        2. remove the smallest element from the heap
        3. check if the new range is lesser than the earlier range
        4. if so update the range and continue
        5. this ensures that the n elements in
            between are included in the range [min, max]
        """
        import heapq
        
        k = len(nums)
        range_start, range_end = nums[0][0], nums[0][0]
        min_heap = []

        for array_index in range(k):
            curr_list = nums[array_index]
            range_start = min(curr_list[0], range_start)
            range_end = max(curr_list[0], range_end)
            heap_item = (curr_list[0], array_index, 0)
            heapq.heappush(min_heap, heap_item)
        
        res = [range_start, range_end]
        while True:
            num, array_index, num_pos = heapq.heappop(min_heap)
            num_pos += 1

            if num_pos >= len(nums[array_index]):
                break
            
            next_val = nums[array_index][num_pos]
            heap_item = (next_val, array_index, num_pos)
            heapq.heappush( min_heap, heap_item )

            range_start = min_heap[0][0]
            range_end = max(range_end, next_val)
            if range_end - range_start  < res[1] - res[0]:
                res[0], res[1] = range_start, range_end

        return res