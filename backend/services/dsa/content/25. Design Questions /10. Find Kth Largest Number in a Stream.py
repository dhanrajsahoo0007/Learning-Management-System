"""
Finding the k-th Largest Unique Number in a Large Stream
Write a program that processes a stream of integers, which is too large to fit into memory all at once. The task is to find the k-th largest unique number in this stream. You can access the stream through the function getNum(), which retrieves the next number from the stream each time it's called. Additionally, you can use isNum(value) to check if a specific number exists in the data structure that you've used to store seen numbers.
Details:
Assume getNum() returns None when the stream has ended.
The stream may contain duplicate numbers, 
but the task is to find the k-th largest unique number.
It is guaranteed that there are at least k unique numbers
in the stream.
Example Function Signatures:
python
def getNum() -> int:
    # Implementation hidden; called to fetch the next number from the stream
def isNum(value: int) -> bool:
    # Implementation hidden; checks if the number exists in your data structure
Example Test Cases:
Input Stream: [5, 1, 5, 2, 3, 2, 4] , k=3
Expected Output: 3
Explanation: The unique numbers sorted are [1, 2, 3, 4, 5]. The 3rd largest is 3.
Input Stream: [10, 20, 20, 10, 30] , k=2
Expected Output: 20
Explanation: The unique numbers sorted are [10, 20, 30]. The 2nd largest is 20.
Input Stream: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5] , k=4
Expected Output: 3
Explanation: The unique numbers sorted are [1, 2, 3, 4, 5, 6, 9]. The 4th largest is 3.

"""