"""
Problem: Largest Component Size by Common Factor

    You are given an integer array of unique positive integers nums. Consider the following graph:
        * There are nums.length nodes, labeled nums[0] to nums[nums.length - 1],
        * There is an undirected edge between nums[i] and nums[j] if nums[i] and nums[j] share a common factor greater than 1.
    Return the size of the largest connected component in the graph.

Example 1:
    Input: nums = [4,6,15,35]
    Output: 4

Example 2:
    Input: nums = [20,50,9,63]
    Output: 2

Example 3:
    Input: nums = [2,3,6,7,4,12,21,39]
    Output: 8

Constraints:
    * 1 <= nums.length <= 2 * 10^4
    * 1 <= nums[i] <= 10^5
    * All the values of nums are unique.

Time Complexity: O(N * sqrt(M)), where N is the length of nums and M is the maximum value in nums
Space Complexity: O(M)

This solution uses a Disjoint Set Union (DSU) data structure to efficiently connect numbers sharing common factors.
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

class Solution:
    def largestComponentSize(self, nums: list[int]) -> int:
        n = max(nums) + 1
        dsu = DSU(n)
        
        def factor_and_union(num):
            for i in range(2, int(num**0.5) + 1):
                if num % i == 0:
                    dsu.union(num, i)
                    dsu.union(num, num // i)
        
        for num in nums:
            factor_and_union(num)
        
        component_size = {}
        max_size = 0
        for num in nums:
            parent = dsu.find(num)
            component_size[parent] = component_size.get(parent, 0) + 1
            max_size = max(max_size, component_size[parent])
        
        return max_size

# Example usage
solution = Solution()

nums1 = [4,6,15,35]
print(f"Example 1 Output: {solution.largestComponentSize(nums1)}")

nums2 = [20,50,9,63]
print(f"Example 2 Output: {solution.largestComponentSize(nums2)}")

nums3 = [2,3,6,7,4,12,21,39]
print(f"Example 3 Output: {solution.largestComponentSize(nums3)}")