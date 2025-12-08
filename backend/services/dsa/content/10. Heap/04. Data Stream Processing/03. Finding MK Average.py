"""
1825. Finding MK Average
Attempted
Hard
Topics
Companies
Hint
You are given two integers, m and k, and a stream of integers. You are tasked to implement a data structure that calculates the MKAverage for the stream.

The MKAverage can be calculated using these steps:

If the number of the elements in the stream is less than m you should consider the MKAverage to be -1. Otherwise, copy the last m elements of the stream to a separate container.
Remove the smallest k elements and the largest k elements from the container.
Calculate the average value for the rest of the elements rounded down to the nearest integer.
Implement the MKAverage class:

MKAverage(int m, int k) Initializes the MKAverage object with an empty stream and the two integers m and k.
void addElement(int num) Inserts a new element num into the stream.
int calculateMKAverage() Calculates and returns the MKAverage for the current stream rounded down to the nearest integer.
 

Example 1:

Input
["MKAverage", "addElement", "addElement", "calculateMKAverage", "addElement", "calculateMKAverage", "addElement", "addElement", "addElement", "calculateMKAverage"]
[[3, 1], [3], [1], [], [10], [], [5], [5], [5], []]
Output
[null, null, null, -1, null, 3, null, null, null, 5]

Explanation
MKAverage obj = new MKAverage(3, 1); 
obj.addElement(3);        // current elements are [3]
obj.addElement(1);        // current elements are [3,1]
obj.calculateMKAverage(); // return -1, because m = 3 and only 2 elements exist.
obj.addElement(10);       // current elements are [3,1,10]
obj.calculateMKAverage(); // The last 3 elements are [3,1,10].
                          // After removing smallest and largest 1 element the container will be [3].
                          // The average of [3] equals 3/1 = 3, return 3
obj.addElement(5);        // current elements are [3,1,10,5]
obj.addElement(5);        // current elements are [3,1,10,5,5]
obj.addElement(5);        // current elements are [3,1,10,5,5,5]
obj.calculateMKAverage(); // The last 3 elements are [5,5,5].
                          // After removing smallest and largest 1 element the container will be [5].
                          // The average of [5] equals 5/1 = 5, return 5
 

Constraints:

3 <= m <= 105
1 <= k*2 < m
1 <= num <= 105
At most 105 calls will be made to addElement and calculateMKAverage.
"""

class MKAverage:
    """
    Thinking about trade-offs
    Yes, using a sorted list or AVL tree could actually be a better approach here! Let me explain why:
    Advantages of Sorted List/AVL Tree:

    Easier to maintain order
    Direct access to k smallest/largest elements
    Simpler removal of elements (just search and remove)
    No need to rebalance multiple heaps

    Example with sorted list:
        pythonCopyclass MKAverage:
            def __init__(self, m: int, k: int):
                self.m = m
                self.k = k
                self.queue = deque()
                self.sorted_list = []  # Keep elements sorted
                self.total = 0  # Track sum of middle elements
                
            def addElement(self, num: int) -> None:
                self.queue.append(num)
                # Insert into sorted list - O(log n) or O(n)
                bisect.insort(self.sorted_list, num)
                
                # Update total of middle elements
                if len(self.sorted_list) >= self.m:
                    self.total = sum(self.sorted_list[self.k:self.m-self.k])
                    
                # Remove oldest if needed
                if len(self.queue) > self.m:
                    old = self.queue.popleft()
                    idx = bisect.bisect_left(self.sorted_list, old)
                    self.sorted_list.pop(idx)
                    
            def calculateMKAverage(self) -> int:
                if len(self.queue) < self.m:
                    return -1
                return self.total // (self.m - 2*self.k)
        Advantages:

        Much simpler code
        More intuitive to understand
        No complex rebalancing needed
        Direct access to elements


    """
    def __init__(self, m: int, k: int):
        self.k = k
        self.m = m
        self.small = [] # max heap with -ve elements for k smallest
        self.middle = [] # min heap remaining m-2k elements
        self.large = [] # minheap K largest
        self.queue = deque([])
        self.middle_sum = 0

    def addElement(self, num: int) -> None:
        self.queue.append(num)
        # check which heap to store in
        if not self.small or -num >= self.small[0]:
            heapq.heappush(self.small, -num)
        elif not self.large or num > self.large[0]:
            heapq.heappush(self.large, num)
        else:
            heapq.heappush(self.middle, num)
            self.middle_sum += num
        
        # if queue length is greater than m then remove and rebalnce
        if len(self.queue) > self.m:
            old = self.queue.popleft()
            self._remove(old)
        # rebalance heaps
        self._rebalance()
        return

    def  _rebalance(self):
        # Small heap rebalance
        while len(self.small) > self.k:
            val = - heapq.heappop(self.small)
            heapq.heappush(self.middle, val)
            self.middle_sum += val
        while len(self.small) < self.k and self.middle:
            val = heapq.heappop(self.middle)
            heapq.heappush(self.small, -val)
            self.middle_sum -= val
        # large heap rebalance
        while len(self.large) > self.k:
            val = heapq.heappop(self.large)
            heapq.heappush(self.middle, val)
            self.middle_sum += val
        while len(self.large) < self.k and self.middle:
            val = heapq.heappop(self.middle)
            heapq.heappush(self.large, val)
            self.middle_sum -= val
        return
    def _remove(self, num: int) -> None:
        if not self.small or not self.large:
            return
        # check where the num number is present at
        if -num in self.small:
            self.small.remove(-num)
            heapq.heapify(self.small)
        elif num in self.large:
            self.large.remove(num)
            heapq.heapify(self.large)
        else:
            self.middle.remove(num)
            self.middle_sum -= num
            heapq.heapify(self.middle)
        return


    def calculateMKAverage(self) -> int:
        if len(self.queue) < self.m:
            return -1
        if self.middle:
            return self.middle_sum // (self.m - 2*self.k)
        return 0


# Your MKAverage object will be instantiated and called as such:
# obj = MKAverage(m, k)
# obj.addElement(num)
# param_2 = obj.calculateMKAverage()