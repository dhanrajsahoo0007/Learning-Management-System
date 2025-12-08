"""
The main function sort_stack:
Base case: If the stack is empty or has only one element, it's already sorted, so we return it.
Recursive case:
    We remove the top element.
    We recursively sort the remaining stack.
    We insert the removed element back into its correct position using the insert_sorted function.

The insert_sorted function:
    Base case: If the stack is empty or the top element is smaller than the current element, we insert the element at the top.
    Recursive case:
        We remove the top element.
        We recursively insert the current element.
        We put back the removed top element.
"""

def sort_stack(stack):
    # Base case: if the stack is empty or has only one element, it's already sorted
    if not stack or len(stack) == 1:
        return stack
    
    # Remove the top element
    top = stack.pop()
    
    # Sort the remaining stack
    sort_stack(stack)
    # print(stack)
    # Insert the top element in the correct position
    insert_sorted(stack, top)
    
    return stack

def insert_sorted(stack, element):
    # Base case: if the stack is empty or the top element is smaller than the current element
    if not stack or element > stack[-1]:
        stack.append(element)
        return
    
    # Remove the top element
    top = stack.pop()
    
    # Recursively insert the element
    insert_sorted(stack, element)
    
    # Put back the top element
    stack.append(top)

# Test the function
stack = [34, 3, 31, 98, 92, 23]
print("Original stack:", stack)
sorted_stack = sort_stack(stack)
print("Sorted stack:", sorted_stack)
# Original stack: [34, 3, 31, 98, 92, 23]
# Sorted stack: [3, 23, 31, 34, 92, 98]