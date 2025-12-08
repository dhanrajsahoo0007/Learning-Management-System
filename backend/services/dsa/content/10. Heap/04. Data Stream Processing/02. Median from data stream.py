"""
Problem Statement:
    Design a data structure that supports the following two operations:
        1. addNum(int num) - Add an integer number from the data stream to the data structure.
        2. findMedian() - Return the median of all elements so far.

    The median is the middle value in an ordered integer list. If the size of the list is even, the median is the average of the two middle values.

Algorithm Steps:
    1. Maintain two heaps:
        - small: A max heap containing the smaller half of the numbers.
        - large: A min heap containing the larger half of the numbers.

    2. In the addNum method:
        - Push the new number to small (as a negative number to simulate a max heap).
        - Move the largest number from small to large.
        - If large becomes larger than small, move one number back to small.
        - This ensures that small always has either the same number of elements as large, or one more.

    3. In the findMedian method:
        - If small has more elements, the median is the top of small.
        - If they have the same number of elements, the median is the average of the tops of both heaps.

Time Complexity:
    addNum: O(log n) for heap operations.
    findMedian: O(1) as we're just accessing the tops of the heaps.

Space Complexity: O(n) to store all the numbers.
"""
import heapq

class MedianFinder:
    def __init__(self):
        self.lower_half = []  # max heap for the smaller half
        self.upper_half = []  # min heap for the larger half

    def addNum(self, num: int) -> None:
        # Push to the max heap and then move the largest to the min heap
        heapq.heappush(self.lower_half, -num)
        heapq.heappush(self.upper_half, -heapq.heappop(self.lower_half))
        
        # Balance the heaps
        if len(self.upper_half) > len(self.lower_half):
            heapq.heappush(self.lower_half, -heapq.heappop(self.upper_half))

    def findMedian(self) -> float:
        # Check if the number of elements is odd
        if len(self.lower_half) > len(self.upper_half):
            # If odd, the median is the top of the lower_half (max heap)
            # We negate it because lower_half stores negated values
            return -self.lower_half[0]
        else:
            # If even, the median is the average of the two middle elements
            # The middle elements are:
                # 1. The top of the upper_half (min heap)
                # 2. The negated top of the lower_half (max heap)
            return (self.upper_half[0] + (-self.lower_half[0])) / 2

# Example usage
if __name__ == "__main__":
    mf = MedianFinder()
    
    # Add numbers and find median
    numbers = [1, 2, 4, 6, 9, 4, 30, 31, 32, 37, 48, 58]
    for i, num in enumerate(numbers, 1):
        mf.addNum(num)
        print(f"After adding {num}, median is: {mf.findMedian()}")

    print("\nFinal median:", mf.findMedian())