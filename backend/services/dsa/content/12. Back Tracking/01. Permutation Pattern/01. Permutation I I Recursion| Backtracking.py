"""
Problem: Generate all permutations of a given string using recursion.

Approach: We use a recursive algorithm to generate all permutations by fixing one character 
and permuting the rest of the string.

Time Complexity: O(n!), where n is the length of the string.
Space Complexity: O(n) for the recursion stack.

Explanation:
1. We use a recursive function that fixes one character and permutes the rest.
2. For each character in the input string, we make it the first character of the output 
   and recursively permute the remaining characters.
3. We use a set to store permutations to handle cases with duplicate characters in the input string.


For example, given the string "abc", the permutations are:
    ["abc", "acb", "bac", "bca", "cab", "cba"]

Recursive Tree for input "abc":
                    abc
                /   |   \
                abc  bac  cba
            /  \  /  \  /  \
            abc acb bac bca cba cab
"""

def permute_string(initial_input):
    # Inner recursive function to generate permutations
    def recurse(output, input):
        # Base case: if input is empty, we have a complete permutation
        if len(input) == 0:
            permutations.add(output)
            return
        
        # Recursive case: try each character as the next character in the permutation
        for i in range(len(input)):
            # Add current character to output
            new_output = output + input[i]
            # Create new input string without the current character
            new_input = input[:i] + input[i+1:]
            # Recursive call with updated output and input
            recurse(new_output, new_input)

    # Set to store unique permutations
    permutations = set()
    # Start recursion with empty output and full initial input
    recurse("", initial_input)
    # Convert set to list before returning
    return list(permutations)

# Example usage
input_string = "abc"
result = permute_string(input_string)
print(f"Permutations of '{input_string}': {result}")

# Test with duplicate characters
input_string_with_duplicates = "aba"
result_with_duplicates = permute_string(input_string_with_duplicates)
print(f"Permutations of '{input_string_with_duplicates}': {result_with_duplicates}")




"""
Problem Statement:
    Given a string of length n, generate all possible permutations of its characters.
    A permutation is an arrangement of all the characters in different orders.

    For example, given the string "abc", the permutations are:
    ["abc", "acb", "bac", "bca", "cab", "cba"]

Approach:

    We use a backtracking algorithm to generate all permutations:
    1. Start with the entire string.
    2. For each position from left to right:
    a. Swap the character at the current position with each character to its right (including itself).
    b. Recursively generate permutations for the rest of the string.
    c. Backtrack by undoing the swap.
    3. When we reach the end of the string, we've generated a complete permutation.

Time Complexity: O(n * n!)
    - We generate n! permutations (n choices for first position, n-1 for second, etc.)
    - Each permutation takes O(n) time to construct

Space Complexity: O(n * n!)
    - We store n! permutations
    - Each permutation is of length n
    - The recursion stack can go up to depth n

Recursive Tree for input "abc":

                    abc
                /   |   \
                abc  bac  cba
            /  \  /  \  /  \
            abc acb bac bca cba cab

Explanation of the Recursive Tree:
    - Root: The initial string "abc"
    - Level 1: Represents choices for the first position
        - abc: 'a' stays in place
        - bac: 'b' is swapped to first position
        - cba: 'c' is swapped to first position
    - Level 2: Represents choices for the second position
        - For "abc": 'b' stays, or 'c' is swapped
        - For "bac": 'a' stays, or 'c' is swapped
        - For "cba": 'b' stays, or 'a' is swapped
    - Level 3 (Leaves): Final permutations

Key Points:
    1. Each level in the tree represents fixing a character at a specific position.
    2. Branches represent different choices for each position.
    3. The number of branches decreases by 1 at each level.
    4. Leaf nodes (bottom level) represent complete permutations.
    5. The depth of the tree is equal to the length of the string.
    6. Total number of leaf nodes = n! (all possible permutations)

Backtracking Process:
    - Moving down the tree: Making a choice (swapping characters)
    - Moving up the tree: Undoing a choice (backtracking)
    - This process ensures we explore all possible combinations efficiently.

"""

def swap(arr, i, j):
    arr[i], arr[j] = arr[j], arr[i]

def backtrack(s, start, permutations):
    if start == len(s):
        permutations.append(''.join(s))
        return

    used = set()
    for i in range(start, len(s)):
        # so that we don't use a multiple times in case of aab
        if s[i] not in used:
            # store the char in the set 
            used.add(s[i])
            swap(s, start, i)  # swap
            backtrack(s, start + 1, permutations)  # recurse
            swap(s, start, i)  # undo swap (backtrack)

def generate_permutations(s):
    s = list(s)
    permutations = []
    backtrack(s, 0, permutations)
    return permutations

# Example usage
print(generate_permutations("abc"))
print(generate_permutations("aab"))