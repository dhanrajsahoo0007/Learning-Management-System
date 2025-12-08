"""
Problem: Greatest Common Divisor Traversal
    You are given a 0-indexed integer array nums, and you are allowed to traverse between its indices. 
    You can traverse between index i and index j, i != j, if and only if gcd(nums[i], nums[j]) > 1, where gcd is the greatest common divisor.
    Your task is to determine if for every pair of indices i and j in nums, where i < j, there exists a sequence of traversals that can take us from i to j.
    Return true if it is possible to traverse between all such pairs of indices, or false otherwise.

Example 1:
    Input: nums = [2,3,6]
    Output: true
    Explanation: In this example, there are 3 possible pairs of indices: (0, 1), (0, 2), and (1, 2).
                To go from index 0 to index 1, we can use the sequence of traversals 0 -> 2 -> 1, 
                where we move from index 0 to index 2 because gcd(nums[0], nums[2]) = gcd(2, 6) = 2 > 1, 
                and then move from index 2 to index 1 because gcd(nums[2], nums[1]) = gcd(6, 3) = 3 > 1.
                
                To go from index 0 to index 2, we can just go directly because gcd(nums[0], nums[2]) = gcd(2, 6) = 2 > 1. 
                Likewise, to go from index 1 to index 2, we can just go directly because gcd(nums[1], nums[2]) = gcd(3, 6) = 3 > 1.

Example 2:
    Input: nums = [3,9,5]
    Output: false
    Explanation: No sequence of traversals can take us from index 0 to index 2 in this example. So, we return false.

Example 3:
    Input: nums = [4,3,12,8]
    Output: true
    Explanation: There are 6 possible pairs of indices to traverse between: (0, 1), (0, 2), (0, 3), (1, 2), (1, 3), and (2, 3). 
                 A valid sequence of traversals exists for each pair, so we return true.

Constraints:
* 1 <= nums.length <= 10^5
* 1 <= nums[i] <= 10^5

Time Complexity: O(n * sqrt(m)), where n is the length of nums and m is the maximum value in nums
Space Complexity: O(n + m)

Note: This solution uses a Disjoint Set Union (DSU) data structure with Union by Size optimization.
"""

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.number_of_components = n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        x_parent, y_parent = self.find(x), self.find(y)
        if x_parent == y_parent:
            return

        if self.size[x_parent] > self.size[y_parent]:
            self.parent[y_parent] = x_parent
            self.size[x_parent] += self.size[y_parent]
        else:
            self.parent[x_parent] = y_parent
            self.size[y_parent] += self.size[x_parent]

        self.number_of_components -= 1

    def max_size(self):
        return self.number_of_components

class Solution:
    def canTraverseAllPairs(self, nums: list[int]) -> bool:
        n = len(nums)
        dsu = DSU(n)

        m = max(nums)
        first = [-1] * (m + 1)

        for i in range(n):
            num = nums[i]
            
            # Check for prime factors up to sqrt(num)
            for prime in range(2, int(num**0.5) + 1):
                if num % prime != 0:
                    continue

                if first[prime] != -1:
                    dsu.union(first[prime], i)
                else:
                    first[prime] = i

                while num % prime == 0:
                    num //= prime

            # Check if the remaining num is a prime factor > sqrt(nums[i])
            if num > 1:
                if first[num] != -1:
                    dsu.union(first[num], i)
                else:
                    first[num] = i

        return dsu.max_size() == 1

# Example usage
solution = Solution()
nums1 = [2,3,6]
print(f"Can traverse all pairs in {nums1}? {solution.canTraverseAllPairs(nums1)}")

nums2 = [3,9,5]
print(f"Can traverse all pairs in {nums2}? {solution.canTraverseAllPairs(nums2)}")

nums3 = [4,3,12,8]
print(f"Can traverse all pairs in {nums3}? {solution.canTraverseAllPairs(nums3)}")