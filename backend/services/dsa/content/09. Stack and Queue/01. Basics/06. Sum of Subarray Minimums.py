"""
Problem Statement:
        Given an array of integers arr, find the sum of min(b), where b ranges over every (contiguous) subarray of arr. 
        Since the answer may be large, return the answer modulo 10^9 + 7.

Time Complexity: 
    Approach 1 (Brute Force): O(n^2)
    Approach 2 (Monotonic Stack): O(n)

Space Complexity:
    Approach 1: O(1)
    Approach 2: O(n)

# Approach 1: Simple Brute Force (May result in TLE for large inputs)
Explanation for Approach 1 (Brute Force):
    1. We use two nested loops to generate all possible subarrays.
    2. For each subarray, we keep track of the minimum element.
    3. We add the minimum element of each subarray to the result.
    4. The final result is the sum of all these minimums, modulo 10^9 + 7.

Time Complexity: O(n^2) due to the nested loops.
Space Complexity: O(1) as we only use a constant amount of extra space.

"""
class Solution1:
    def sumSubarrayMins(self, arr: list[int]) -> int:
        M = 10**9 + 7
        n = len(arr)
        result = 0
        
        for i in range(n):
            min_val = arr[i]
            for j in range(i, n):
                # Update the minimum value for the current subarray
                min_val = min(min_val, arr[j])
                # Add the minimum to the result
                result = (result + min_val) % M
        
        return result

# Approach 2: Efficient solution using monotonic stacks
"""
Explanation for Approach 2 (Monotonic Stack):
    1. We use the concept of "Next Smaller Element" to the left (NSL) and right (NSR).
    2. For each element, we calculate:
        - The distance to the next smaller element on the left
        - The distance to the next smaller element on the right
    3. The product of these distances gives us the number of subarrays where this element is the minimum.
    4. We multiply this count by the element value and add it to the result.

Key concept:
    - Use "strictly less" for NSL and "non-strictly less" for NSR to avoid double-counting.
    - This ensures that for equal elements, we count subarrays correctly without repetition.

Time Complexity: O(n) as we traverse the array a constant number of times.
Space Complexity: O(n) for the stack and result arrays.

"""
class Solution2:
    # Next Greater element to the Left
    def getNSL(self, arr: list[int]) -> list[int]:
        n = len(arr)
        result = [-1] * n
        stack = []
        
        for i in range(n):
            # Pop elements from stack while they're greater than current
            while stack and arr[stack[-1]] > arr[i]:  # strictly less
                stack.pop()
            
            # Set NSL index (top of stack or -1 if stack is empty)
            if stack:
                result[i] = stack[-1]
            
            stack.append(i)
        
        return result
    
    # Next Greater element to the Right
    def getNSR(self, arr: list[int]) -> list[int]:
        n = len(arr)
        result = [n] * n
        stack = []
        
        for i in range(n-1, -1, -1):
            # Pop elements from stack while they're greater than or equal to current
            while stack and arr[stack[-1]] >= arr[i]:  # non-strictly less
                stack.pop()
            
            # Set NSR index (top of stack or n if stack is empty)
            if stack:
                result[i] = stack[-1]
            
            stack.append(i)
        
        return result
    
    def sumSubarrayMins(self, arr: list[int]) -> int:
        n = len(arr)
        M = 10**9 + 7
        
        NSL = self.getNSL(arr)  # Next smaller to left
        NSR = self.getNSR(arr)  # Next smaller to right
        
        total_sum = 0
        
        for i in range(n):
            d1 = i - NSL[i]  # distance to nearest smaller to left from i
            d2 = NSR[i] - i  # distance to nearest smaller to right from i
            
            # Total ways for arr[i] to be the minimum
            total_ways_for_i_min = d1 * d2
            sum_i_in_total_ways = arr[i] * total_ways_for_i_min
            
            total_sum = (total_sum + sum_i_in_total_ways) % M
        
        return total_sum

# Test cases
arr1 = [3, 1, 2, 4]
arr2 = [11, 81, 94, 43, 3]

solution1 = Solution1()
solution2 = Solution2()

print("Approach 1 (Brute Force):")
print(f"Test case 1: {solution1.sumSubarrayMins(arr1)}")  # Expected: 17
print(f"Test case 2: {solution1.sumSubarrayMins(arr2)}")  # Expected: 444

print("\nApproach 2 (Monotonic Stack):")
print(f"Test case 1: {solution2.sumSubarrayMins(arr1)}")  # Expected: 17
print(f"Test case 2: {solution2.sumSubarrayMins(arr2)}")  # Expected: 444