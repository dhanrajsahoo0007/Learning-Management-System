"""
Problem Statement: Aggressive Cows Problem

    You are given an array 'arr' consisting of 'n' integers which denote the position of a stall.
    You are also given an integer 'k' which denotes the number of aggressive cows.
    You are given the task of assigning stalls to 'k' cows such that the minimum distance between any two of them is the maximum possible.
    
    return the maximum possible minimum distance.

Examples:
    Example 1:
    Input: n = 6, k = 4, arr = [0, 3, 4, 7, 10, 9]
    Output: 3
    Explanation: The maximum possible minimum distance will be 3 when 4 cows are placed at positions {0, 3, 7, 10}. 
    Here distances between cows are 3, 4 and 3 respectively.

    Example 2:
    Input: n = 5, k = 2, arr = [4, 2, 1, 3, 6]
    Output: 5
    Explanation: The maximum possible minimum distance will be 5 when 2 cows are placed at positions {1, 6}.

Constraints:
    * 2 <= n <= 10^5
    * 2 <= k <= n
    * 0 <= arr[i] <= 10^9
    * Time Limit: 1 sec

Solution Explanation:
    The solution uses a binary search approach to find the maximum minimum distance:

    1. We define a helper function 'can_place_cows' that checks if it's possible to place 'k' cows with a given minimum distance.
    2. In the main function 'aggressiveCows', we perform a binary search on the possible range of distances:
       - The minimum possible distance is 0.
       - The maximum possible distance is the difference between the largest and smallest stall positions.
    3. We keep narrowing down our search range until we find the maximum valid distance.

Time Complexity: O(n * log(max_distance)), where n is the number of stalls and max_distance is the difference between the largest and smallest stall positions.
    - Sorting the stalls takes O(n log n) time.
    - The binary search takes O(log(max_distance)) iterations.
    - In each iteration, we call the 'can_place_cows' function which takes O(n) time.

Space Complexity: O(1), as we only use a constant amount of extra space (not counting the input array).
"""


from typing import List

class Solution:
    def can_place_cows(self, stalls: List[int], n: int, cows: int, min_dist: int) -> bool:
        # Initialize the count of placed cows and the position of the last placed cow
        count = 1
        last_position = stalls[0]
        
        # Iterate through the stalls
        for i in range(1, n):
            # If the current stall is far enough from the last placed cow
            if stalls[i] - last_position >= min_dist:
                # Place a cow here
                count += 1
                last_position = stalls[i]
                
                # If we've placed all cows, return True
                if count == cows:
                    return True
        
        # If we couldn't place all cows, return False
        return False

    def aggressiveCows(self, stalls: List[int], k: int) -> int:
        n = len(stalls)
        # Sort the stalls to ensure we can use the distance effectively
        stalls.sort()
        
        # Initialize the binary search range
        # Minimum distance is 0, maximum is the distance between first and last stall
        low = 0
        high = stalls[-1] - stalls[0]
        result = 0
        
        # Perform binary search
        while low <= high:
            # Calculate the middle distance
            mid = (low + high) // 2
            
            # Check if we can place k cows with this minimum distance
            if self.can_place_cows(stalls, n, k, mid):
                # If yes, this could be our result, but we'll try for a larger distance
                result = mid
                low = mid + 1
            else:
                # If no, we need to try a smaller distance
                high = mid - 1
        
        # Return the largest minimum distance we found
        return result


# Example usage
if __name__ == "__main__":
    solution = Solution()

    # Example 1
    stalls1 = [0, 3, 4, 7, 10, 9]
    k1 = 4
    result1 = solution.aggressiveCows(stalls1, k1)
    print(f"Example 1 - Input: stalls = {stalls1}, k = {k1}")
    print(f"Output: {result1}")
    print()

    # Example 2
    stalls2 = [4, 2, 1, 3, 6]
    k2 = 2
    result2 = solution.aggressiveCows(stalls2, k2)
    print(f"Example 2 - Input: stalls = {stalls2}, k = {k2}")
    print(f"Output: {result2}")