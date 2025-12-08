"""
480. Sliding Window Median
Solved
Hard
Topics
Companies
Hint
The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value. So the median is the mean of the two middle values.

For examples, if arr = [2,3,4], the median is 3.
For examples, if arr = [1,2,3,4], the median is (2 + 3) / 2 = 2.5.
You are given an integer array nums and an integer k. There is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.

Return the median array for each window in the original array. Answers within 10-5 of the actual value will be accepted.

 

Example 1:

Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [1.00000,-1.00000,-1.00000,3.00000,5.00000,6.00000]
Explanation: 
Window position                Median
---------------                -----
[1  3  -1] -3  5  3  6  7        1
 1 [3  -1  -3] 5  3  6  7       -1
 1  3 [-1  -3  5] 3  6  7       -1
 1  3  -1 [-3  5  3] 6  7        3
 1  3  -1  -3 [5  3  6] 7        5
 1  3  -1  -3  5 [3  6  7]       6
Example 2:

Input: nums = [1,2,3,4,2,3,1,4,2], k = 3
Output: [2.00000,3.00000,3.00000,3.00000,2.00000,3.00000,2.00000]
 

Constraints:

1 <= k <= nums.length <= 105
-231 <= nums[i] <= 231 - 1
"""

class Solution:
        def medianSlidingWindow(self, nums: List[int], k: int) -> List[float]:
            from collections import defaultdict
            import heapq
            
            medians = []
            hash_table = defaultdict(int)
            
            left = []  # max heap (using negatives)
            right = []  # min heap
            num_counter = 0    # index of current incoming element
            # initialize the heaps
            for i in range(k):
                heapq.heappush(left, -nums[i])

            # move larger half to min heap
            for _ in range(k // 2):
                heapq.heappush(right, -heapq.heappop(left))

            num_counter = k   
            while True:
                # get median of current window
                if k % 2 == 1:
                    medians.append(float(-left[0]))
                else:
                    medians.append((-left[0] + right[0]) * 0.5)
                    
                if num_counter >= len(nums):
                    break  # break if all elements processed
                    
                out_num = nums[num_counter - k]  # outgoing element
                in_num = nums[num_counter]       # incoming element
                num_counter += 1
                balance = 0           # balance factor
                
                # number `out_num` exits window
                balance += -1 if out_num <= -left[0] else 1
                hash_table[out_num] += 1
                
                # number `in_num` enters window
                if len(left) and in_num <= -left[0]:
                    balance += 1
                    heapq.heappush(left, -in_num)
                else:
                    balance -= 1
                    heapq.heappush(right, in_num)
                    
                # re-balance heaps
                if balance < 0:  # `lo` needs more valid elements
                    heapq.heappush(left, -right[0])
                    heapq.heappop(right)
                    balance += 1
                    
                if balance > 0:  # `hi` needs more valid elements
                    heapq.heappush(right, -left[0])
                    heapq.heappop(left)
                    balance -= 1
                    
                # remove invalid numbers that should be discarded from heap tops
                while left and hash_table[-left[0]]:
                    hash_table[-left[0]] -= 1
                    heapq.heappop(left)
                    
                while right and hash_table[right[0]]:
                    hash_table[right[0]] -= 1
                    heapq.heappop(right)
                    
            return medians