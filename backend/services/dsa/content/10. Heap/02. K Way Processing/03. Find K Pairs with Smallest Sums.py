"""
373. Find K Pairs with Smallest Sums
Solved
Medium
Topics
Companies
You are given two integer arrays nums1 and nums2 sorted in non-decreasing order and an integer k.

Define a pair (u, v) which consists of one element from the first array and one element from the second array.

Return the k pairs (u1, v1), (u2, v2), ..., (uk, vk) with the smallest sums.

 

Example 1:

Input: nums1 = [1,7,11], nums2 = [2,4,6], k = 3
Output: [[1,2],[1,4],[1,6]]
Explanation: The first 3 pairs are returned from the sequence: [1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]
Example 2:

Input: nums1 = [1,1,2], nums2 = [1,2,3], k = 2
Output: [[1,1],[1,1]]
Explanation: The first 2 pairs are returned from the sequence: [1,1],[1,1],[1,2],[2,1],[1,2],[2,2],[1,3],[1,3],[2,3]
 

Constraints:

1 <= nums1.length, nums2.length <= 105
-109 <= nums1[i], nums2[i] <= 109
nums1 and nums2 both are sorted in non-decreasing order.
1 <= k <= 104
k <= nums1.length * nums2.length



"""

class Solution:
    def kSmallestPairs(self, nums1: List[int], nums2: List[int], k: int) -> List[List[int]]:
        """
        Inferences: given two sorted arrays
        find k pairs u,v from each array such that their sum is minimal

        3 7 11
        1 2 6

        1 -> 1,2 1,7 1,11
        2 -> 2,3 2,7 2,11
        6 -> (6,3) (6,7) (6,11)
        solution is 1,2 2,3 

        Complexities:
        For each of k pairs we want:
			1. Pop from heap: O(log k)
			2. Push up to 2 new pairs: O(2 log k)

			Operations per iteration = O(log k)
			Number of iterations = k
			Total: O(k log k)
		Space = O(heap) + O(seen) + O(result)
		      = O(k) + O(k) + O(k)
		      = O(k)
        """
        import heapq

        results = []
        if k <= 0 or not nums1 or not nums2:
            return results

        pair_sum_heap = [(nums1[0]+nums2[0], 0, 0)]
        nums1_len = len(nums1)
        nums2_len = len(nums2)
        seen = set([])

        while len(results) < k and pair_sum_heap:
            current_smallest, num1_idx, num2_idx = heapq.heappop(pair_sum_heap)
            results.append([nums1[num1_idx], nums2[num2_idx]])

            next_num1_idx = num1_idx+1
            if num1_idx<nums1_len-1 and (next_num1_idx, num2_idx) not in seen:
                new_sum = nums1[next_num1_idx] + nums2[num2_idx]
                heapq.heappush( pair_sum_heap, (new_sum, next_num1_idx, num2_idx))
                seen.add((next_num1_idx, num2_idx))
            next_num2_idx = num2_idx+1
            if num2_idx<nums2_len-1 and (num1_idx, next_num2_idx) not in seen:
                new_sum = nums1[num1_idx] + nums2[next_num2_idx]
                heapq.heappush(pair_sum_heap, (new_sum, num1_idx, next_num2_idx))
                seen.add((num1_idx, next_num2_idx))

        return results