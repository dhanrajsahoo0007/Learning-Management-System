"""
Problem: Remove Covered Intervals

    Given an array intervals where intervals[i] = [li, ri] represent the interval [li, ri),
    remove all intervals that are covered by another interval in the list.
    The interval [a, b) is covered by the interval [c, d) if and only if c <= a and b <= d.
    Return the number of remaining intervals.

Approach:
1. Sort intervals by start point (ascending) and end point (descending).
2. Iterate through sorted intervals, keeping only non-covered ones.
3. Compare each interval with the previously added non-covered interval.
4. Return the count of non-covered intervals.

Time Complexity: O(n log n) due to sorting, where n is the number of intervals.
Space Complexity: O(n) in the worst case where no intervals are covered.
"""

from typing import List

class Solution:
    def removeCoveredIntervals(self, intervals: List[List[int]]) -> int:
        # Sort intervals by start point (ascending) and end point (descending)
        intervals.sort(key=lambda i: (i[0], -i[1]))

        # Initialize result list with the first interval
        res = [intervals[0]]

        # Iterate through remaining intervals
        for l, r in intervals[1:]:
            prevL, prevR = res[-1]

            # If current interval is covered by previous, skip it
            if prevL <= l and prevR >= r:
                continue

            # Add non-covered interval to result
            res.append([l, r])

        # Return the count of non-covered intervals
        return len(res)

# Test cases
def run_test_case(intervals, case_number):
    solution = Solution()
    result = solution.removeCoveredIntervals(intervals)
    print(f"Test case {case_number}:")
    print(f"Input: {intervals}")
    print(f"Output: {result}")
    print(f"Explanation: Number of remaining intervals after removing covered ones: {result}\n")

# Run the tests
if __name__ == "__main__":
    run_test_case([[1,4],[3,6],[2,8]], 1)
    run_test_case([[1,4],[2,3]], 2)
    run_test_case([[1,2],[1,4],[3,4]], 3)
    run_test_case([[1,5]], 4)  # Edge case: single interval
    run_test_case([[1,2],[2,3],[3,4],[4,5]], 5)  # No overlaps