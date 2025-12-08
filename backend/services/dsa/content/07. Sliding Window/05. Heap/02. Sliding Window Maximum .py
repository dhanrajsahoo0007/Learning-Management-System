"""
Given an integer list, nums, find the maximum values in all the contiguous subarrays (windows) of size w.
Constraints:
1 ≤  nums.length ≤ 10^3
−10^4 ≤  nums[i] ≤ 10^4 
1 ≤ w
"""
"""
    Using an monotonically decreasing dequeu
    Create a deque of size (k) add the elements and move the window
    as each element is moved out of the window, remove from the dequeue
Time: O(n).
Sapce: O(k)
"""
def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:
    
    from collections import deque
    # Store the indexes of the elements in the array within the window
    dq = deque()
    res = []

    for i in range(k):
        while dq and nums[i] >= nums[dq[-1]]:
            dq.pop()
        dq.append(i)

    res.append(nums[dq[0]])

    for i in range(k, len(nums)):
        if dq and dq[0] == i - k:
            dq.popleft()
        while dq and nums[i] >= nums[dq[-1]]:
            dq.pop()

        dq.append(i)
        res.append(nums[dq[0]])

    return res
