"""
Problem Statement :
    Merge Intervals
    Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, 
    and return an array of the non-overlapping intervals that cover all the intervals in the input.

Example 1:
    Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
    Output: [[1,6],[8,10],[15,18]]
    Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].

Example 2:

    Input: intervals = [[1,4],[4,5]]
    Output: [[1,5]]
    Explanation: Intervals [1,4] and [4,5] are considered overlapping.

Constraints:
    1 <= intervals.length <= 104
    intervals[i].length == 2
    0 <= starti <= endi <= 104


Explanation of the solution:

1. Sorting:
   We start by sorting the intervals based on their start times. This is crucial because 
   it ensures that overlaps will always occur with the most recently added interval.

2. Initialization:
   We initialize the output list with the first interval from the sorted list. This 
   clever initialization eliminates the need for an empty list check in the main loop.

3. Merging Process:
   We iterate through all intervals (including the first one). For each interval:
   a. We compare its start time with the end time of the last interval in our output.
   b. If there's an overlap (current start <= last end), we merge by updating the 
      end time of the last interval in the output to the max of the two end times.
   c. If there's no overlap, we simply add the current interval to the output.


Time Complexity: O(n log n) due to the sorting step. The merging process is O(n).
Space Complexity: O(n) for the sorted list and the output list.


"""


from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        # Sort intervals based on start time
        intervals.sort(key=lambda pair: pair[0])
        
        # Initialize output with the first interval
        output = [intervals[0]]

        # Iterate through all intervals (including the first one)
        for start, end in intervals[1:]:
            # Get the end time of the last interval in output
            lastEnd = output[-1][1]

            if start <= lastEnd:
                # If current interval overlaps with last interval in output
                # merge by updating the end time
                output[-1][1] = max(lastEnd, end)
            else:
                # If no overlap, add current interval to output
                output.append([start, end])
        
        # Return the merged intervals
        return output

# Test cases
def run_test_case(intervals, case_number):
    solution = Solution()
    result = solution.merge(intervals)
    print(f"Test case {case_number}:")
    print(f"Input: {intervals}")
    print(f"Output: {result}\n")

# Run the tests
if __name__ == "__main__":
    run_test_case([[1,3],[2,6],[8,10],[15,18]], 1)
    run_test_case([[1,4],[4,5]], 2)
    run_test_case([[1,4],[0,4]], 3)
    run_test_case([[1,4],[0,1]], 4)