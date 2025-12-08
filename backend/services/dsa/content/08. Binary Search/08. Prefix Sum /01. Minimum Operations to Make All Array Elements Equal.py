"""
Problem Statement: Minimum Operations to Make All Array Elements Equal
    
    Given an array 'nums' of positive integers and an array 'queries', 
    find the minimum number of operations to make all elements in 'nums' equal to each query value. 
    An operation is defined as increasing or decreasing an element by 1. 
    The array is reset after each query.

Time Complexity: O((n + m) log n), where n is the length of nums and m is the length of queries.
    - Sorting nums: O(n log n)
    - Calculating prefix sum: O(n)
    - For each query: O(log n) for binary search
    - Total: O(n log n) + O(n) + O(m log n) = O((n + m) log n)

Space Complexity: O(n) for the prefix sum array.

Explanation:
    1. Sort the nums array to efficiently find elements smaller/larger than each query.
    2. Use prefix sum for quick calculation of sum of elements up to any index.
    3. For each query:
        a. Use binary search to find where the query would be inserted in sorted nums.
        b. Calculate operations for elements smaller than query: sum(query - element).
        c. Calculate operations for elements larger than query: sum(element - query).
        d. Total operations = operations for smaller elements + operations for larger elements.
    4. Return the list of minimum operations for each query.

Example Explanation:
Let's work through the first example: nums = [3, 1, 6, 8], queries = [1, 5]

    1. Sort nums: [1, 3, 6, 8]
    2. Calculate prefix sum: [0, 1, 4, 10, 18]
       (0 is added at the beginning for easier calculations)

    3. For query = 1:
        a. Binary search finds index 1 (where 1 would be inserted)
        b. Operations for smaller elements:
            - No elements smaller than 1
        c. Operations for larger elements:
            - Sum of larger elements: 18 - 1 = 17
            - Operations: 17 - 1 * 3 = 14
        d. Total operations: 0 + 14 = 14

    4. For query = 5:
        a. Binary search finds index 2 (where 5 would be inserted)
        b. Operations for smaller elements:
            - Sum of smaller elements: 4
            - Operations: 5 * 2 - 4 = 6
        c. Operations for larger elements:
            - Sum of larger elements: 18 - 4 = 14
            - Operations: 14 - 5 * 2 = 4
        d. Total operations: 6 + 4 = 10

5. Final result: [14, 10]
"""

from typing import List

class Solution:
    def minOperations(self, nums: List[int], queries: List[int]) -> List[int]:
        n = len(nums)
        nums.sort()  # Sort the array in ascending order
        
        # Calculate prefix sum for efficient range sum queries
        prefix_sum = [0] * (n + 1)
        for i in range(n):
            prefix_sum[i + 1] = prefix_sum[i] + nums[i]
        
        def binary_search(target):
            # Find the index where target would be inserted in sorted nums
            left, right = 0, n
            while left < right:
                mid = (left + right) // 2
                if nums[mid] < target:
                    left = mid + 1
                else:
                    right = mid
            return left
        
        answer = []
        for query in queries:
            index = binary_search(query)
            
            # Calculate operations for elements smaller than query
            left_sum = prefix_sum[index]
            left_ops = query * index - left_sum
            
            # Calculate operations for elements larger than or equal to query
            right_sum = prefix_sum[n] - left_sum
            right_ops = right_sum - query * (n - index)
            
            total_ops = left_ops + right_ops
            answer.append(total_ops)
        
        return answer

# Test the solution
if __name__ == "__main__":
    sol = Solution()
    
    # Test case 1
    nums1 = [3, 1, 6, 8]
    queries1 = [1, 5]
    print(f"Test case 1 result: {sol.minOperations(nums1, queries1)}")
    
    # Test case 2
    nums2 = [2, 9, 6, 3]
    queries2 = [10]
    print(f"Test case 2 result: {sol.minOperations(nums2, queries2)}")