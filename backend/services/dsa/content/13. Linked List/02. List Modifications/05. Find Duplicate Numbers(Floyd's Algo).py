"""
Problem Statement:
    Find the Duplicate Number
    Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive.
    There is only one repeated number in nums, return this repeated number.
    You must solve the problem without modifying the array nums and uses only constant extra space.

Example 1:
    Input: nums = [1,3,4,2,2]
    Output: 2

Example 2:
    Input: nums = [3,1,3,4,2]
    Output: 3
Example 3:
    Input: nums = [3,3,3,3,3]
    Output: 3

Constraints:

1 <= n <= 105
nums.length == n + 1
1 <= nums[i] <= n
All the integers in nums appear only once except for precisely one integer which appears two or more times.

"""


class Solution:
    def findDuplicate(self, nums):
        # Phase 1: Detect the cycle
        slow = fast = nums[0]
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break
        
        # Phase 2: Find the entrance to the cycle
        slow = nums[0]
        while slow != fast:
            slow = nums[slow]
            fast = nums[fast]
        
        return slow

"""
Explanation:

1. Treating the Array as a Linked List:
   - We consider each element in the array as a node in a linked list.
   - The value of each element is treated as a pointer to the next node.
   - For example, if nums[0] = 3, we consider it as a pointer to nums[3].

2. Floyd's Cycle Detection Algorithm:
   - We use two pointers: 'slow' and 'fast'.
   - Both start at nums[0].
   - In each iteration:
     - 'slow' moves one step: slow = nums[slow]
     - 'fast' moves two steps: fast = nums[nums[fast]]

3. Phase 1: Detecting the Cycle
   - We move the pointers until they meet inside the cycle.
   - This meeting point is guaranteed to exist because there's a duplicate number, which creates a cycle.

4. Phase 2: Finding the Entrance to the Cycle
   - After detecting the cycle, we reset the 'slow' pointer to nums[0].
   - We move both 'slow' and 'fast' one step at a time.
   - The point where they meet again is the entrance to the cycle, which is our duplicate number.

Time Complexity: O(n), where n is the length of the array.
- We may traverse the array up to two times in the worst case.

Space Complexity: O(1)
- We only use two pointers, regardless of the input size.

This solution effectively finds the duplicate number while adhering to the constraints of 
not modifying the array and using only constant extra space.
"""

class Solution:
    def findDuplicate(self, nums):
        slow, fast = 0, 0
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break

        slow2 = 0
        while True:
            slow = nums[slow]
            slow2 = nums[slow2]
            if slow == slow2:
                return slow

"""
Explanation:

1. Phase 1: Detecting the Cycle
   - Initialize both 'slow' and 'fast' pointers to 0 (start of the array).
   - Move 'slow' one step and 'fast' two steps at a time until they meet.
   - The loop breaks when a cycle is detected (slow == fast).

2. Phase 2: Finding the Entrance to the Cycle
   - Initialize a new pointer 'slow2' to 0.
   - Move both 'slow' and 'slow2' one step at a time.
   - The point where they meet is the entrance to the cycle, which is our duplicate number.

Key Differences from the Previous Implementation:
    1. Both pointers start at index 0 instead of nums[0].
    2. The second phase uses a new pointer 'slow2' instead of resetting 'slow'.
    3. The second phase is implemented as a separate loop for clarity.

Time Complexity: O(n), where n is the length of the array.
Space Complexity: O(1), using only a constant amount of extra space.
"""


# Test cases
def test_find_duplicate():
    solution = Solution()

    # Test case 1
    nums1 = [1, 3, 4, 2, 2]
    result1 = solution.findDuplicate(nums1)
    print(f"Test case 1 result: {result1}")  # Expected: 2

    # Test case 2
    nums2 = [3, 1, 3, 4, 2]
    result2 = solution.findDuplicate(nums2)
    print(f"Test case 2 result: {result2}")  # Expected: 3

    # Test case 3
    nums3 = [3, 3, 3, 3, 3]
    result3 = solution.findDuplicate(nums3)
    print(f"Test case 3 result: {result3}")  # Expected: 3

# Run the test cases
test_find_duplicate()