"""
Problem Statement: Find the Next Alphabetical Element

Given a sorted array of lowercase letters and a target letter, find the smallest element in the array that is larger than the target. 
The letters wrap around, so if there's no letter larger than the target, return the first element in the array.

Examples:

1. Input: letters = ['a', 'c', 'f', 'h'], target = 'f'
   Output: 'h'
   Explanation: The smallest letter greater than 'f' is 'h'.

2. Input: letters = ['a', 'c', 'f', 'h'], target = 'b'
   Output: 'c'
   Explanation: The smallest letter greater than 'b' is 'c'.

3. Input: letters = ['a', 'c', 'f', 'h'], target = 'h'
   Output: 'a'
   Explanation: There's no letter greater than 'h', so we wrap around and return 'a'.

Explanation of the approach:

    1. Reusing the Ceiling Function:
        - We use the provided find_ceiling function as the core of our solution.
        - This function finds the smallest element in the array that is greater than or equal to the target.

    2. ASCII Conversion:
        - To use the ceiling function with characters, we convert the letters to their ASCII values.
        - This allows us to perform numerical comparisons while maintaining alphabetical order.

    3. Handling Wrapping Around:
        - If find_ceiling returns -1 (no ceiling found), we return the first element of the array.
        - This handles the case where the target is greater than all elements in the array.

    4. Result Conversion:
        - We convert the ceiling ASCII value back to a character before returning.

"""

def find_ceiling(arr: list[int], target: int) -> int:
    """
    Find the ceiling of the target element in the sorted array.
    
    Args:
    arr (list[int]): The sorted array to search in
    target (int): The element to find the ceiling for
    
    Returns:
    int: The ceiling of the target element, or -1 if no ceiling exists
    """
    left, right = 0, len(arr) - 1
    ceiling = -1

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return arr[mid]
        elif arr[mid] < target:
            left = mid + 1
        else:
            ceiling = arr[mid]  # Update ceiling
            right = mid - 1     # Search in the left half

    return ceiling

def next_alphabetical_element(letters: list[str], target: str) -> str:
    """
    Find the smallest element in the sorted array that is larger than the target.
    
    Args:
    letters (list[str]): The sorted array of lowercase letters
    target (str): The target letter
    
    Returns:
    str: The next alphabetical element, wrapping around if necessary
    """
    # Convert letters to their ASCII values
    ascii_letters = [ord(ch) for ch in letters]
    target_ascii = ord(target)
    
    # Find the ceiling
    ceiling = find_ceiling(ascii_letters, target_ascii)
    
    # Handle wrapping around
    if ceiling == -1:
        return letters[0]
    
    # Convert back to character
    return chr(ceiling)

# Test cases
test_cases = [
    (['a', 'c', 'f', 'h'], 'f'),
    (['a', 'c', 'f', 'h'], 'b'),
    (['a', 'c', 'f', 'h'], 'h'),
    (['a', 'c', 'f', 'h'], 'm'),
    (['a', 'c', 'f', 'h'], 'a'),
    (['b', 'c', 'd', 'e', 'f', 'g'], 'a'),
    (['b', 'c', 'd', 'e', 'f', 'g'], 'g'),
    (['c'], 'a'),
    (['c'], 'c'),
    (['c'], 'z')
]

for letters, target in test_cases:
    result = next_alphabetical_element(letters, target)
    print(f"Letters: {letters}")
    print(f"Target: '{target}'")
    print(f"Next alphabetical element: '{result}'")
    print()

