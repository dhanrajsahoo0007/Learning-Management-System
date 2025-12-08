"""
Problem: Insert Interval
    Given a sorted list of non-overlapping intervals and a new interval,
    insert the new interval and merge if necessary, keeping the list sorted.

Example 1:
    Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
    Output: [[1,5],[6,9]]

Example 2:
    Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
    Output: [[1,2],[3,10],[12,16]]
    Explanation: Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].

Explanation:


    res = []: Initialize an empty list to store the result.
    for i in range(len(intervals)):: Iterate through each interval in the input list.
    
    Case 1: if newInterval[1] < intervals[i][0]:
        This checks if the new interval ends before the current interval starts.
        If true, it means we've found the correct position to insert the new interval.
        We append the new interval to the result and return the result concatenated with all remaining intervals.
        This early return optimizes the case where we don't need to process all intervals.


    Case 2: elif newInterval[0] > intervals[i][1]:

        This checks if the new interval starts after the current interval ends.
        If true, there's no overlap, so we simply add the current interval to the result.
        The new interval might still overlap with future intervals, so we continue the loop.


    Case 3: else:

        If neither of the above conditions is true, we have an overlap.
        We merge the new interval with the current interval by:

        Taking the minimum of the start points.
        Taking the maximum of the end points.

        We update newInterval with this merged interval.
        We don't add to res here because this merged interval might overlap with the next interval.


    After the loop, res.append(newInterval):
        Add the final new interval (which might have been merged multiple times) to the result.
    return res: Return the final list of intervals.

Time Complexity: O(n), where n is the number of intervals.
We iterate through the intervals once.

Space Complexity: O(n) for the result list.
In the worst case, we might need to store all intervals plus the new one.

"""
from typing import List


class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        res = []  # Initialize the result list to store the final intervals

        for i in range(len(intervals)):
            # Case 1: newInterval comes before current interval
            if newInterval[1] < intervals[i][0]:
                res.append(newInterval)  # Add newInterval to result
                return res + intervals[i:]  # Return result + all remaining intervals
            
            # Case 2: newInterval comes after current interval
            elif newInterval[0] > intervals[i][1]:
                res.append(intervals[i])  # Add current interval to result
            
            # Case 3: newInterval overlaps with current interval
            else:
                # Merge newInterval with current interval
                newInterval = [
                    min(newInterval[0], intervals[i][0]),  # Take the smaller start
                    max(newInterval[1], intervals[i][1])   # Take the larger end
                ]
                # Note: We don't add to res here as we might need to merge with next interval
        
        # Add the final newInterval (which might have been merged multiple times)
        res.append(newInterval)
        return res


# Test cases
def run_test_case(intervals, newInterval, case_number):
    solution = Solution()
    result = solution.insert(intervals, newInterval)
    print(f"Test case {case_number}:")
    print(f"Intervals: {intervals}")
    print(f"New Interval: {newInterval}")
    print(f"Result: {result}\n")

# Run the tests
if __name__ == "__main__":
    # Test case 1: Example from the problem statement
    run_test_case([[1,3],[6,9]], [2,5], 1)

    # Test case 2: Another example from the problem statement
    run_test_case([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8], 2)

    # Test case 3: New interval at the beginning
    run_test_case([[3,5],[6,9]], [1,2], 3)

    # Test case 4: New interval at the end
    run_test_case([[1,2],[3,5]], [6,8], 4)

    # Test case 5: New interval encompassing all existing intervals
    run_test_case([[1,2],[3,4],[5,6]], [0,7], 5)

    # Test case 6: Empty intervals list
    run_test_case([], [1,2], 6)

    # Test case 7: No overlap, insert in the middle
    run_test_case([[1,2],[5,6]], [3,4], 7)