"""
Problem Statement:
    Given an array of points in a 2D plane, find the K closest points to the origin (0, 0).
    
Explanation:
    We use a max heap to keep track of the K closest points. The heap stores tuples of (-distance, point).
    We iterate through all points:
        Calculate the squared distance from the origin (x^2 + y^2). We use squared distance to avoid the computationally expensive square root operation.
        If we have less than K points in our heap, we add the current point.
        If we have K points and the current point is closer than the furthest point in our heap, we remove the furthest point and add the current one.

    The negative of the distance is used in the heap so that the point with the largest distance is at the top of the max heap.
    Finally, we extract and return the points from the heap.

Time complexity: O(n * log(k)), where n is the number of points
Space complexity: O(k) for the heap

Example:
Input: points = [[1,3],[-2,2],[5,8],[0,1]], K = 2
Output: [[0,1],[-2,2]]
"""

import heapq

def k_closest_points(points, k):
    # Use a max heap to keep track of the k closest points
    maxHeap = []

    for point in points:
        # Extract x and y coordinates from the point
        x, y = point
        
        # Calculate the negative squared distance from the origin
        # We use negative distance to turn min-heap into max-heap
        dist = -(x*x + y*y)
        
        if len(maxHeap) < k:
            # If we have less than k points, add to the heap
            heapq.heappush(maxHeap, (dist, point))
        elif dist > maxHeap[0][0]:
            # If this point is closer than the furthest in our heap, remove the furthest and add this one
            heapq.heapreplace(maxHeap, (dist, point))
    
    # Extract the points from the heap, discarding the distances
    return [point for _, point in maxHeap]

# Example usage
points = [[1,3],[-2,2],[5,8],[0,1]]
k = 2

result = k_closest_points(points, k)
print(f"The {k} closest points to the origin are: {result}")

# Additional test cases
test_cases = [
    ([[3,3],[5,-1],[-2,4]], 2),
    ([[1,1],[-1,-1],[3,4],[4,5],[2,-1]], 3),
    ([[0,0],[1,1],[-1,-1]], 2)
]

for i, (pts, k) in enumerate(test_cases, 1):
    result = k_closest_points(pts, k)
    print(f"Test case {i}: Points = {pts}, K = {k}")
    print(f"Result: {result}\n")