"""
Problem Statement:
    Given an array, find the nearest greater element to the right for each element.
    If there is no greater element to the right, use -1.
"""


def nearest_greater_to_right(arr):
    n = len(arr)
    result = [-1] * n
    stack = []
    # Traverse the array from right to left
    for i in range(n - 1, -1, -1):
        
        if not stack:
            # If stack is empty, there's no greater element to the right
            result[i] = -1
        elif stack[-1] > arr[i]:
            # If top of stack is greater than current element, it's the next greater
            result[i] = stack[-1]
        else:
            # Pop elements from stack until we find a greater element or stack becomes empty
            while stack and stack[-1] <= arr[i]:
                stack.pop()
            if not stack:
                # If stack is empty after popping, no greater element exists
                result[i] = -1
            else:
                # Top of stack is the next greater element
                result[i] = stack[-1]
        
        # Push current element to stack for future comparisons
        stack.append(arr[i])
    
    return result

# Example usage
arr = [4, 5, 2, 25, 7, 8]
print("Original array:", arr)
print("Next greater elements:", nearest_greater_to_right(arr))

"""
Time Complexity:
     O(n)- Each element is pushed and popped at most once, resulting in O(n) operations.

Space Complexity: O(n)
    - In the worst case (descending order array), we might store all elements in the stack.
    - The result array also uses O(n) space.

"""
