"""
621. Task Scheduler
Solved
Medium
Topics
Companies
Hint
You are given an array of CPU tasks, each labeled with a letter from A to Z, and a number n. Each CPU interval can be idle or allow the completion of one task. Tasks can be completed in any order, but there's a constraint: there has to be a gap of at least n intervals between two tasks with the same label.

Return the minimum number of CPU intervals required to complete all tasks.

 

Example 1:

Input: tasks = ["A","A","A","B","B","B"], n = 2

Output: 8

Explanation: A possible sequence is: A -> B -> idle -> A -> B -> idle -> A -> B.

After completing task A, you must wait two intervals before doing A again. The same applies to task B. In the 3rd interval, neither A nor B can be done, so you idle. By the 4th interval, you can do A again as 2 intervals have passed.

Example 2:

Input: tasks = ["A","C","A","B","D","B"], n = 1

Output: 6

Explanation: A possible sequence is: A -> B -> C -> D -> A -> B.

With a cooling interval of 1, you can repeat a task after just one other task.

Example 3:

Input: tasks = ["A","A","A", "B","B","B"], n = 3

Output: 10

Explanation: A possible sequence is: A -> B -> idle -> idle -> A -> B -> idle -> idle -> A -> B.

There are only two types of tasks, A and B, which need to be separated by 3 intervals. This leads to idling twice between repetitions of these tasks.

 

Constraints:

1 <= tasks.length <= 104
tasks[i] is an uppercase English letter.
0 <= n <= 100"""


class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        """
        One key observation is that tasks with higher frequencies should be prioritized
         because delaying them would increase idle times unnecessarily.
        By using a max heap, we ensure that tasks with the highest frequencies
         are executed as soon as possible when they are allowed, thus minimizing the chance of idle time.

        Sort the tasks based on their frequency count.
        Max heap that keeps track of all the available tasks,
         with the task of the highest frequency (the most "urgent" task) being popped first.
        Cooldown queue - this stores tasks that are in their cooldown phase
         and can’t be executed until a certain number of time intervals (n) have passed.
         The cooldown queue is a deque where each task is stored as a 
         tuple of: (remaining executions, next available time). 
         The next available time is when the task can be added back to the heap for execution.
        A global timer. Every time step (whether a task is executed or idle time occurs).
        """
        min_cpu_intervals = 0
        from collections import Counter, deque
        import heapq

        # calculate the task frequency counter
        task_freq_counter = Counter(tasks)

        heap = []
        cooldown = deque()
        timer = 0

        # max heap
        for key, val in task_freq_counter.items():
            heapq.heappush(heap, -val)
        
        while heap or cooldown:
            timer += 1
            if heap:
                task = -heapq.heappop(heap)
                if task > 1:
                    cooldown.append((task-1, timer+n))
            while cooldown and cooldown[0][1] == timer:
                task_count, next_iteration = cooldown[0]
                cooldown.popleft()
                heapq.heappush(heap, -task_count)
        return timer