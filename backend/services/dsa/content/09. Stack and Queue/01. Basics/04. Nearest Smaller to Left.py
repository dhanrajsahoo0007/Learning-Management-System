def nearest_smallest_element_to_left(arr):
    n = len(arr)
    result = [-1] * n  # Initialize with -1, using list multiplication
    stack = []
    
    for i in range(n):
        if not stack:
            result[i] = -1
        elif stack[-1] < arr[i]:
            result[i] = stack[-1]
        else:
            while stack and stack[-1] >= arr[i]:
                stack.pop()
            if stack:
                result[i] = stack[-1]
            else:
                result[i] = -1
        
        stack.append(arr[i])
    
    return result

# Example usage
arr = [4, 3, 2, 10, 8]
print("Original array:", arr)
print("Nearest smallest elements to the left:", nearest_smallest_element_to_left(arr))



def nearest_smallest_element_to_left(arr):
    n = len(arr)
    result = [-1] * n  # Initialize with -1, using list multiplication
    stack = []
    
    for i in range(n):
        while stack and stack[-1] >= arr[i]:
            stack.pop()
        
        if stack:
            result[i] = stack[-1]
        # No need for an else statement here, as result[i] is already -1
        
        stack.append(arr[i])
    
    return result