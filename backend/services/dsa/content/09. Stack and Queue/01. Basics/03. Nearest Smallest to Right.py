def nearest_smallest_element_to_right(arr):
    n = len(arr)
    result = [-1] * n 
    stack = []
    for i in range(n-1, -1, -1):
        if not stack:
            result[i] = -1
        elif stack[-1] < arr[i]:
            result[i] = stack[-1] 
        else:
            while stack and stack[-1] >= arr[i]:  # Changed > to >=
                stack.pop()
            if stack:
                result[i] = stack[-1]
            else:
                result[i] = -1 
        stack.append(arr[i])    
    return result

# Example usage
arr = [4, 5, 2, 10, 8]
print("Original array:", arr)
print("Nearest smallest elements to the right:", nearest_smallest_element_to_right(arr))