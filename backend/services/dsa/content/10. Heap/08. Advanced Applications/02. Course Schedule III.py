"""
630. Course Schedule III
Solved
Hard
Topics
Companies
Hint
There are n different online courses numbered from 1 to n. You are given an array courses where courses[i] = [durationi, lastDayi] indicate that the ith course should be taken continuously for durationi days and must be finished before or on lastDayi.

You will start on the 1st day and you cannot take two or more courses simultaneously.

Return the maximum number of courses that you can take.

 

Example 1:

Input: courses = [[100,200],[200,1300],[1000,1250],[2000,3200]]
Output: 3
Explanation: 
There are totally 4 courses, but you can take 3 courses at most:
First, take the 1st course, it costs 100 days so you will finish it on the 100th day, and ready to take the next course on the 101st day.
Second, take the 3rd course, it costs 1000 days so you will finish it on the 1100th day, and ready to take the next course on the 1101st day. 
Third, take the 2nd course, it costs 200 days so you will finish it on the 1300th day. 
The 4th course cannot be taken now, since you will finish it on the 3300th day, which exceeds the closed date.
Example 2:

Input: courses = [[1,2]]
Output: 1
Example 3:

Input: courses = [[3,2],[4,3]]
Output: 0
 

Constraints:

1 <= courses.length <= 104
1 <= durationi, lastDayi <= 104

"""
class Solution:
    def scheduleCourse(self, courses: List[List[int]]) -> int:
        """
                courses = [[100,200], [200,1300], [1000,1250], [2000,3200]]

        Step by step:
        1. Sort by lastDay:
        [[100,200], [1000,1250], [200,1300], [2000,3200]]

        2. Course [100,200]:
        time = 0 + 100 = 100
        heap = [-100]
        Can take ✓

        3. Course [1000,1250]:
        time = 100 + 1000 = 1100
        heap = [-1000, -100]
        Can take ✓

        4. Course [200,1300]:
        time = 1100 + 200 = 1300
        heap = [-1000, -200, -100]
        Can take ✓

        5. Course [2000,3200]:
        time + 2000 = 3300 > 3200
        BUT longest = 1000 > duration
        Replace 1000 with 2000:
        time = 1300 - 1000 + 2000 = 2300
        heap = [-2000, -200, -100]
        Can take ✓
        Time Complexity: O(n log n)

        Sorting: O(n log n)
        Heap operations: O(log n) for each course

        Space Complexity: O(n)

        Heap can store at most n courses
        """
        import heapq
        # sort by the last day
        courses.sort(key=lambda x: x[1])

        duration_heap = []
        current_time = 0

        for duration, last_day in courses:
            if current_time + duration <= last_day:
                current_time += duration
                heapq.heappush(duration_heap, -duration)
            elif duration_heap and -duration_heap[0] > duration:
                longest_duration = - heapq.heappop(duration_heap)
                current_time = current_time - longest_duration + duration
                heapq.heappush(duration_heap, -duration)
        return len(duration_heap)