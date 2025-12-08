"""
3. Vertical Line Divider for Balanced Rectangle Areas
You are provided with a list of rectangles, where each rectangle is defined by its bottom-left and top-right coordinates. Write a function to determine a vertical line (parallel to the y-axis) that divides all the rectangles into two equal halves. The vertical line's x-coordinate should ideally ensure that the total area of the rectangles on its left is as close as possible to the total area of the rectangles on its right.
Definitions:
Each rectangle is specified by two points: (x1, y1) for the bottom-left corner and (x2, y2) for the top-right corner.
The vertical line can touch the sides of rectangles but should aim to balance the areas on both sides.
Objective:
Find the x-coordinate of the vertical line that best balances the areas of the rectangles on its left and right.
Function Signature:
python
def find_dividing_line(rectangles: List[Tuple[int, int, int, int]]) -> float:
    pass
Input:
rectangles: A list of tuples. Each tuple consists of four integers (x1, y1, x2, y2), representing the coordinates of the bottom-left and top-right corners of a rectangle.
Output:
Return the x-coordinate of the vertical line as a float.
Constraints:
The rectangles do not overlap.
Each rectangle's area is greater than 0 (x2 > x1 and y2 > y1).
Test Cases:
Test Case 1:
Input:
rectangles = [(1, 1, 4, 4)]
Output:
2.5
Explanation: Here, a vertical line at x = 2.5 will divide the rectangle exactly into two halves, each with an area of 4.5.
Test Case 2:
Input:
rectangles = [(1, 1, 3, 3), (4, 1, 6, 3)]
Output:
3.5
Explanation: A vertical line at x = 3.5 divides the area such that the total area on both sides is equal (each side has an area of 4).
Test Case 3:
Input:
rectangles = [(1, 1, 3, 3), (3, 1, 6, 3)]
Output:
3.0
Explanation: The line at x = 3.0 touches the right side of the first rectangle and the left side of the second rectangle, effectively dividing the total area into equal halves (each side has an area of 4).

"""