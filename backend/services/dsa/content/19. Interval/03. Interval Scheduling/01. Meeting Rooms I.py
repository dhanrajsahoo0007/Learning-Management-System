"""
Problem: Meeting Room I

    Given an array of meeting time interval objects consisting of start and end times 
    [[start_1,end_1],[start_2,end_2],...] (start_i < end_i), determine if a person could 
    add all meetings to their schedule without any conflicts.

Example 1:
    Input: intervals = [(0,30),(5,10),(15,20)]
    Output: false
    Explanation:
        * (0,30) and (5,10) will conflict
        * (0,30) and (15,20) will conflict

Example 2:
Input: intervals = [(5,8),(9,15)]
Output: true

Note:
* (0,8),(8,10) is not considered a conflict at 8

Constraints:
* 0 <= intervals.length <= 500
* 0 <= intervals[i].start < intervals[i].end <= 1,000,000

Approach:
    1. Sort the intervals based on start time.
    2. Iterate through the sorted intervals, comparing each interval's start time 
    with the previous interval's end time.
    3. If any overlap is found, return False.
    4. If we complete the iteration without finding any overlap, return True.

Time Complexity: O(n log n) due to sorting, where n is the number of intervals.
Space Complexity: O(1) if we don't count the space for sorting, as we only use a few variables.
"""

from typing import List

class Solution:
    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:
        # Sort intervals based on start time
        intervals.sort(key=lambda x: x[0])
        
        # Iterate through intervals starting from the second one
        for i in range(1, len(intervals)):
            
            if intervals[i][0] < intervals[i-1][1]:
                # If current start time is less than previous end time, we have a conflict
                return False
        
        # If we've made it through all intervals without finding a conflict, return True
        return True

# Test cases
def run_test_case(intervals, case_number):
    solution = Solution()
    result = solution.canAttendMeetings(intervals)
    print(f"Test case {case_number}:")
    print(f"Input: {intervals}")
    print(f"Output: {result}")
    print(f"Explanation: {'All meetings can be attended' if result else 'There are conflicting meetings'}\n")

# Run the tests
if __name__ == "__main__":
    run_test_case([(0,30),(5,10),(15,20)], 1)
    run_test_case([(5,8),(9,15)], 2)
    run_test_case([(0,8),(8,10)], 3)  # Edge case: meetings exactly adjacent
    run_test_case([], 4)  # Edge case: empty schedule
    run_test_case([(1,5)], 5)  # Edge case: single meeting