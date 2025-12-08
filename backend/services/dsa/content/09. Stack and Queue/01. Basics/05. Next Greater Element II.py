"""
Problem Statement:
Given a circular integer array nums, return the next greater number for every element in nums.
The next greater number of a number x is the first greater number to its traversing-order next in the array,
which means you could search circularly to find its next greater number. If it doesn't exist, return -1 for this number.

Time Complexity: O(n), where n is the length of the input array.
    - We iterate through the array twice, but each element is pushed and popped at most once.

Space Complexity: O(n)
    - In the worst case, the stack might contain all elements of the array.

Detailed explanation of the solution:

    1. We initialize the result array with -1 for all elements, as this is the default when no greater element is found.

    2. We use a stack to keep track of indices of elements that are waiting for their next greater element.

    3. We iterate through the array twice (2 * n iterations) to simulate the circular nature of the array:
        - The current index in the original array is calculated as i % n.

    4. For each element:
        a. While the stack is not empty and the current element is greater than the element at the index at the top of the stack:
            - We pop the top index from the stack.
            - We update the result for this popped index with the current element, as it's the next greater element.

        b. If we're still in the first n iterations (i < n), we push the current index onto the stack.
            This ensures that we only consider each element once as a potential "next greater element".

    5. After the loop, any indices remaining in the stack correspond to elements that don't have a next greater element,
        so their result remains -1.

    6. Finally, we return the result array.


The time complexity is O(n) because although we iterate 2n times, each element is pushed and popped at most once.
The space complexity is O(n) for the stack and result array.
"""

class Solution:
    def nextGreaterElements(self, nums: list[int]) -> list[int]:
        n = len(nums)
        result = [-1] * n  # Initialize result array with -1
        stack = []  # Stack to store indices
        
        # Iterate through the array twice to simulate circular array
        for i in range(2 * n):
            # Get the actual index in the original array
            current_index = i % n
            
            # While stack is not empty and current element is greater than the element at stack top
            while stack and nums[current_index] > nums[stack[-1]]:
                # Pop the top element and update its next greater element
                result[stack.pop()] = nums[current_index]
            
            # If we're in the first iteration, push the current index to the stack
            if i < n:
                stack.append(current_index)
        
        return result

# Test cases
solution = Solution()

# Test case 1
print(solution.nextGreaterElements([1,2,1]))  # Output: [2,-1,2]
# Explanation: 
# - For 1 at index 0, the next greater element is 2.
# - For 2 at index 1, there is no greater element, so -1.
# - For 1 at index 2, the next greater element (circularly) is 2.

# Test case 2
print(solution.nextGreaterElements([1,2,3,4,3]))  # Output: [2,3,4,-1,4]
# Explanation:
# - For 1, the next greater is 2.
# - For 2, the next greater is 3.
# - For 3 at index 2, the next greater is 4.
# - For 4, there is no greater element, so -1.
# - For 3 at index 4, the next greater (circularly) is 4.

# Additional test case
print(solution.nextGreaterElements([5,4,3,2,1]))  # Output: [-1,5,5,5,5]
# Explanation: All elements except 5 have 5 as their next greater element.

