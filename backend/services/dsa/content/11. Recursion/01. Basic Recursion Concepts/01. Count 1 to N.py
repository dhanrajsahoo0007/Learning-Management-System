## printing 1 to n 
# Base case: If n == 0, we return (do nothing).
# Recursive case:

#     First, we recursively call print_1_to_n(n - 1). This will print all numbers from 1 to n-1.
#     After the recursive call returns, we print the current number n.

# This recursive approach has:

#     Time complexity: O(n)
#     Space complexity: O(n) due to the call stack

def print_n_to_1(n):
    if n == 0:
        return
    print_n_to_1(n - 1)
    print(n, end=' ')
    

# Test the function
n = 10
print(f"Printing numbers from  1 to {n}:")
print_n_to_1(n)
print()



## printing n to 1
# Base case: If n == 0, we return (do nothing).
# Recursive case:

# First, we print the current number n.
# Then, we recursively call print_n_to_1(n - 1). This will print all numbers from n-1 to 1.
# This recursive approach has:
#     Time complexity: O(n)
#     Space complexity: O(n) due to the call stack

def print_n_to_1(n):
    if n == 0:
        return
    print(n, end=' ')
    print_n_to_1(n - 1)

# Test the function
n = 10
print(f"Printing numbers from {n} to 1:")
print_n_to_1(n)
print()  