"""
Problem Statement:
    Given an array, find the nearest greater element to the left for each element.
    If there is no greater element to the left, use -1.
"""
def nearest_greater_to_left(arr):
    n = len(arr)
    result = [-1] * n
    stack = []
    
    # Traverse the array from left to right
    for i in range(n):  # <-- CHANGE: Left to right traversal
        
        if not stack:
            result[i] = -1
        elif stack[-1] > arr[i]:
            result[i] = stack[-1]
        else:
            while stack and stack[-1] <= arr[i]:
                stack.pop()
            if not stack:
                result[i] = -1
            else:
                result[i] = stack[-1]
        
        stack.append(arr[i])
    
    return result

# Example usage
arr = [4, 5, 2, 25, 7, 8]
print("Original array:", arr)
print("Next greater elements to the left:", nearest_greater_to_left(arr))