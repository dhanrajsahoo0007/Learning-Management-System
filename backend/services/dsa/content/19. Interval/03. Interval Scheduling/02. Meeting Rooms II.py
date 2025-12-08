"""
Problem: Meeting Schedule II

    Given an array of meeting time interval objects consisting of start and end times 
    [[start_1,end_1],[start_2,end_2],...] (start_i < end_i), find the minimum number of days 
    required to schedule all meetings without any conflicts.

Example 1:
    Input: intervals = [(0,40),(5,10),(15,20)]
    Output: 2
    Explanation: day1: (0,40) day2: (5,10),(15,20)

Example 2:
    Input: intervals = [(4,9)]
    Output: 1

Note:
    * (0,8),(8,10) is not considered a conflict at 8

Constraints:
    * 0 <= intervals.length <= 500
    * 0 <= intervals[i].start < intervals[i].end <= 1,000,000

Approach:
    1. Sort the intervals based on start time.
    2. Use a min-heap (priority queue) to keep track of end times of ongoing meetings.
    3. Iterate through the sorted intervals:
        - Remove all meetings that have ended (end time <= current start time)
        - Add the current meeting to the heap
        - Update the maximum number of concurrent meetings if necessary
    4. The maximum number of concurrent meetings at any point is the minimum number of days required.

Time Complexity: O(n log n) due to sorting and heap operations, where n is the number of intervals.
Space Complexity: O(n) for the heap in the worst case.
"""

from typing import List
import heapq

class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        # Sort intervals based on start time
        intervals.sort(key=lambda x: x[0])
        
        # Min heap to store end times of ongoing meetings
        heap = []
        max_rooms = 0
        
        for start, end in intervals:
            # Remove all meetings that have ended
            while heap and heap[0] <= start:
                heapq.heappop(heap)
            
            # Add the current meeting
            heapq.heappush(heap, end)
            
            # Update the maximum number of concurrent meetings
            max_rooms = max(max_rooms, len(heap))
        
        return max_rooms
    


"""
Explanation:
    1. Sort start and end times separately.
    2. Use two pointers (s and e) to iterate through start and end times.
    3. If a meeting starts before the earliest ending, increment count (room needed).
    4. If a meeting ends, decrement count (room freed).
    5. Keep track of the maximum count (res) at any point.
    6. The final res is the minimum number of rooms required.

Time Complexity: O(n log n) due to sorting
Space Complexity: O(n) for storing sorted arrays
"""
class AlternativeSolution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        # Sort start times and end times separately
        start = sorted(interval[0] for interval in intervals)
        end = sorted(interval[1] for interval in intervals)

        res, count = 0, 0
        s, e = 0, 0
        
        while s < len(intervals):
            if start[s] < end[e]:
                s += 1
                count += 1
            else:
                e += 1
                count -= 1
            res = max(res, count)
        
        return res



# Test cases
def run_test_case(intervals, case_number):
    solution = Solution()
    alt_solution = AlternativeSolution()
    result = solution.minMeetingRooms(intervals)
    alt_result = alt_solution.minMeetingRooms(intervals)
    print(f"Test case {case_number}:")
    print(f"Input: {intervals}")
    print(f"Output (Heap solution): {result}")
    print(f"Output (Two-pointer solution): {alt_result}")
    print(f"Explanation: Minimum number of days required: {result}\n")

# Run the tests
if __name__ == "__main__":
    run_test_case([(0,40),(5,10),(15,20)], 1)
    run_test_case([(4,9)], 2)
    run_test_case([(0,8),(8,10)], 3)  # Edge case: meetings exactly adjacent
    run_test_case([], 4)  # Edge case: empty schedule
    run_test_case([(1,5),(2,7),(3,9),(4,11),(5,13)], 5)  # Multiple overlapping meetings