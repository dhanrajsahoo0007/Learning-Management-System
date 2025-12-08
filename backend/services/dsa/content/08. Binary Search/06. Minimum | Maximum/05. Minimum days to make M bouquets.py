"""
Problem Statement: Minimum Days to Make m Bouquets
                  * similar to the Koko Eating Bananas problem    
    
    You are given an integer array bloomDay, an integer m and an integer k.
    You want to make m bouquets. To make a bouquet, you need to use k adjacent flowers from the garden.
    The garden consists of n flowers, the ith flower will bloom in the bloomDay[i] and then can be used in exactly one bouquet.
    
    Return the minimum number of days you need to wait to be able to make m bouquets from the garden. If it is impossible to make m bouquets return -1.

Example 1:
    Input: bloomDay = [1,10,3,10,2], m = 3, k = 1
    Output: 3

Example 2:
    Input: bloomDay = [1,10,3,10,2], m = 3, k = 2
    Output: -1

Example 3:
    Input: bloomDay = [7,7,7,7,12,7,7], m = 2, k = 3
    Output: 12

Constraints:
    * bloomDay.length == n
    * 1 <= n <= 10^5
    * 1 <= bloomDay[i] <= 10^9
    * 1 <= m <= 10^6
    * 1 <= k <= n

Solution Explanation:
    The solution uses a binary search approach to find the minimum number of days:

    1. We define a helper function 'get_num_of_bouquets' that checks how many bouquets can be made by a given day.
    2. In the main function 'min_days', we perform a binary search on the possible days:
        - The minimum possible day is the minimum bloom day.
        - The maximum possible day is the maximum bloom day.
    3. We keep narrowing down our search range until we find the minimum day that allows making m bouquets.

Time Complexity: O(n * log(max(bloomDay))), where n is the length of the bloomDay array.
    - The binary search takes O(log(max(bloomDay))) iterations.
    - In each iteration, we call the 'get_num_of_bouquets' function which takes O(n) time.

Space Complexity: O(1), as we only use a constant amount of extra space.

"""

from typing import List

class Solution:
    def can_make_bouquets(self, bloom_day: List[int], mid: int, k: int) -> int:
        num_of_bouquets = 0
        consecutive_count = 0
        
        # Find count of consecutive flowers you can pick at mid day
        for day in bloom_day:
            
            if day <= mid:
                # If the flower has bloomed by 'mid' day, increment the consecutive count
                consecutive_count += 1
            else:
                # If not, reset the consecutive count
                consecutive_count = 0
            
            # If we have enough consecutive flowers for a bouquet
            if consecutive_count == k:
                # Increment the bouquet count and reset consecutive count
                num_of_bouquets += 1
                consecutive_count = 0
        
        return num_of_bouquets

    def min_days(self, bloomDay: List[int], m: int, k: int) -> int:
        # Check if it's impossible to make m bouquets
        if m * k > len(bloomDay):
            return -1

        # Initialize the binary search range
        left = 1  # Minimum possible days
        right = max(bloomDay)  # Maximum possible days

        while left < right:
            # Calculate the middle number of days
            mid_days = left + (right - left) // 2

            # Check if we can make m bouquets within mid_days
            if self.can_make_bouquets(bloomDay, mid_days, k) >= m:
                # If possible, try to minimize the days further
                right = mid_days
            else:
                # If not possible, increase the lower bound
                left = mid_days + 1

        # Return the minimum number of days required
        return left


# Example usage
if __name__ == "__main__":
    solution = Solution()

    # Example 1
    bloomDay1 = [1,10,3,10,2]
    m1, k1 = 3, 1
    result1 = solution.min_days(bloomDay1, m1, k1)
    print(f"Example 1 - Input: bloomDay = {bloomDay1}, m = {m1}, k = {k1}")
    print(f"Output: {result1}")
    print()

    # Example 2
    bloomDay2 = [1,10,3,10,2]
    m2, k2 = 3, 2
    result2 = solution.min_days(bloomDay2, m2, k2)
    print(f"Example 2 - Input: bloomDay = {bloomDay2}, m = {m2}, k = {k2}")
    print(f"Output: {result2}")
    print()

    # Example 3
    bloomDay3 = [7,7,7,7,12,7,7]
    m3, k3 = 2, 3
    result3 = solution.min_days(bloomDay3, m3, k3)
    print(f"Example 3 - Input: bloomDay = {bloomDay3}, m = {m3}, k = {k3}")
    print(f"Output: {result3}")