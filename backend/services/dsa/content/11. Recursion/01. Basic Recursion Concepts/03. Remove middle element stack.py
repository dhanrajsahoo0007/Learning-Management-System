# The delete_middle function:
# Parameters:
    # stack: the input stack
    # current: keeps track of the current position (starts from 0)

# Base case: If the stack is empty, we return.
# We calculate the middle position as len(stack) // 2.
# If the current position is the middle, we simply pop and return.
# If not at the middle:
#     We remove the top element and store it.
#     We recursively call delete_middle for the next position.
#     After the recursive call returns, we put back the stored element.

# The recursion ensures that we reach the middle element while preserving the order of elements above it.



def delete_middle(stack, current=0):
    # Base case: if the stack is empty
    if not stack:
        return
    
    # Find the middle position
    middle = len(stack) // 2
    
    # If we've reached the middle element
    if current == middle:
        stack.pop()
        return
    
    # Remove the top element
    temp = stack.pop()
    
    # Recursively call for the next element
    delete_middle(stack, current + 1)
    
    # Put back the top element
    stack.append(temp)


# def delete_middle(stack, current_index=0):
#     # If stack is empty or all items are traversed
#     if len(stack) == 0 or current_index == len(stack) // 2:
#         stack.pop()  # Remove the middle element
#         return

#     # Pop the top element to reach the middle
#     top = stack.pop()

#     # Recursive call to reach the middle
#     delete_middle(stack, current_index + 1)

#     # Push the elements back after deleting the middle
#     stack.append(top)


# Helper function to print the stack
def print_stack(stack):
    print("Stack:", stack)

# Test the function
stack = [1, 2, 3, 4, 5, 6, 7, 8, 9]
print("Original stack:")
print_stack(stack)

delete_middle(stack)
print("Stack after deleting middle element:")
print_stack(stack)

# Test with even number of elements
stack = [1, 2, 3, 4, 5, 6, 7, 8, 9]
print("\nOriginal stack:")
print_stack(stack)

delete_middle(stack)
print("Stack after deleting middle element:")
print_stack(stack)