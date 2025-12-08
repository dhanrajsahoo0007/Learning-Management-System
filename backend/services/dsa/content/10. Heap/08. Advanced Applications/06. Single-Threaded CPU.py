"""
1834. Single-Threaded CPU
Solved
Medium
Topics
Companies
Hint
You are given n​​​​​​ tasks labeled from 0 to n - 1 represented by a 2D integer array tasks, where tasks[i] = [enqueueTimei, processingTimei] means that the i​​​​​​th​​​​ task will be available to process at enqueueTimei and will take processingTimei to finish processing.

You have a single-threaded CPU that can process at most one task at a time and will act in the following way:

If the CPU is idle and there are no available tasks to process, the CPU remains idle.
If the CPU is idle and there are available tasks, the CPU will choose the one with the shortest processing time. If multiple tasks have the same shortest processing time, it will choose the task with the smallest index.
Once a task is started, the CPU will process the entire task without stopping.
The CPU can finish a task then start a new one instantly.
Return the order in which the CPU will process the tasks.


"""
class Solution:
    def getOrder(self, tasks: List[List[int]]) -> List[int]:
        """
        tasks labeled - 0 - n-1
        tasks[i] [ enqueue time, processing time]
        Time Complexity: O(N log N) where N is number of tasks
            Sorting tasks: O(N log N)
            Heap operations: O(log N) for each push/pop
            While loop processes N tasks, each potentially involving heap operations
            Total heap operations contribute O(N log N)
            Overall complexity is dominated by O(N log N)


        Space Complexity: O(N)

            indexed_tasks array: O(N)
            task_processing_queue heap: O(N) worst case
            task_processed_order result array: O(N)
        """
        import heapq
        task_processing_queue = [] # (processing_time, index)
        # task_processing_queue.append( (tasks[0][1], 0) )
        indexed_tasks = [(task[0], task[1], i) for i, task in enumerate(tasks)]
        indexed_tasks.sort()

        task_index = 0
        current_time = indexed_tasks[0][0]
        task_processed_order = []

        while len(task_processed_order) < len(tasks):
            while task_index < len(tasks) and indexed_tasks[task_index][0] <= current_time:
                enque_time, process_time, original_idx = indexed_tasks[task_index]
                heapq.heappush(task_processing_queue, (process_time, original_idx) )
                task_index += 1
            if task_processing_queue:
                # process task
                task_time, task_idx  = heapq.heappop(task_processing_queue)
                task_processed_order.append(task_idx)
                # processing task
                current_time += task_time
            else:
                current_time = indexed_tasks[task_index][0]
        return task_processed_order