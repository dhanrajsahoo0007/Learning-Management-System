"""
Problem Statement:
    Design a queue-like data structure that moves the most recently used element to the end of the queue.
    Implement the MRUQueue class:
        * MRUQueue(int n) constructs the MRUQueue with n elements: [1,2,3,...,n].
        * int fetch(int k) moves the kth element (1-indexed) to the end of the queue and returns it.

Time Complexity:
    - Initialization: O(n)
    - Fetch operation: O(n)

Space Complexity:
    - O(n) where n is the number of elements in the queue.


Example 1:

Input:
    ["MRUQueue", "fetch", "fetch", "fetch", "fetch"]
    [[8], [3], [5], [2], [8]]
Output:
    [null, 3, 6, 2, 2]

Explanation:
    MRUQueue mRUQueue = new MRUQueue(8); // Initializes the queue to [1,2,3,4,5,6,7,8].
    mRUQueue.fetch(3); // Moves the 3rd element (3) to the end of the queue to become [1,2,4,5,6,7,8,3] and returns it.
    mRUQueue.fetch(5); // Moves the 5th element (6) to the end of the queue to become [1,2,4,5,7,8,3,6] and returns it.
    mRUQueue.fetch(2); // Moves the 2nd element (2) to the end of the queue to become [1,4,5,7,8,3,6,2] and returns it.
    mRUQueue.fetch(8); // The 8th element (2) is already at the end of the queue so just return it.

"""

class MRUQueue:
    def __init__(self, n: int):
        # Initialize the queue with numbers from 1 to n
        self.queue = list(range(1, n + 1))

    def fetch(self, k: int) -> int:
        # Get the kth element (1-indexed)
        value = self.queue[k - 1]
        # Remove the element from its original position
        del self.queue[k - 1]
        # Add the element to the end of the queue
        self.queue.append(value)
        return value

