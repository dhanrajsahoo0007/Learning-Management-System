"""
Problem: Non-overlapping Intervals

    Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum 
    number of intervals you need to remove to make the rest of the intervals non-overlapping.

Explanation:

    * Sorting: This solution sorts the intervals based on their start times, unlike the previous 
               solution which sorted by end times. This approach is equally valid and can lead to the correct result.

    * Initialization:
            * `res` is initialized to 0, which will count the number of intervals to be removed.
            * `prevEnd` is set to the end time of the first interval.

    * Main Loop:
            * The loop iterates through all intervals starting from the second one.
            * It uses tuple unpacking (`start, end`) for cleaner code.

    * Overlap Check and Resolution:
            * If the current interval's start is greater than or equal to `prevEnd`, there's no overlap, 
                so we update `prevEnd` to the current interval's end.
            * If there is an overlap, we increment `res` (counting an interval to be removed) and update 
                `prevEnd` to the minimum of the current end and the previous end. This effectively "removes" 
                the interval that ends later.


Time Complexity: O(n log n) due to sorting, where n is the number of intervals.
Space Complexity: O(1) if we don't count the space for sorting, as we only use a few variables.
"""

from typing import List

class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        # Sort intervals based on start time
        intervals.sort()
        
        res = 0  # Counter for intervals to be removed
        prevEnd = intervals[0][1]  # End time of the first interval
        
        # Iterate through intervals starting from the second one
        for start, end in intervals[1:]:
            if start >= prevEnd:
                # No overlap, update prevEnd
                prevEnd = end
            else:
                # Overlap found, increment result
                res += 1
                # Keep the interval with the earlier end time
                prevEnd = min(end, prevEnd)
        
        return res

# Test cases
def run_test_case(intervals, case_number):
    solution = Solution()
    result = solution.eraseOverlapIntervals(intervals)
    print(f"Test case {case_number}:")
    print(f"Input: {intervals}")
    print(f"Output: {result}")
    print(f"Explanation: Minimum number of intervals to remove: {result}\n")

# Run the tests
if __name__ == "__main__":
    run_test_case([[1,2],[2,3],[3,4],[1,3]], 1)
    run_test_case([[1,2],[1,2],[1,2]], 2)
    run_test_case([[1,2],[2,3]], 3)
    run_test_case([[1,100],[11,22],[1,11],[2,12]], 4)