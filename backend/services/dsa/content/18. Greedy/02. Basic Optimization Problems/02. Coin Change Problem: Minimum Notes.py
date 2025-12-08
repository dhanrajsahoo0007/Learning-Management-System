"""
Note Change Problem: Minimum Notes

Problem Statement:
Given an amount of money and a set of note denominations, find the minimum number of notes required to make up that amount. Also, provide a breakdown of which notes to use.

For example:
    Input: 
    - Amount: 655
    - Available note denominations: 5, 10, 20, 100, 200

    Output:
    - Minimum number of notes needed
    - Breakdown of which notes to use

Constraints:
    - The note denominations are given in a way that a greedy approach will always yield the optimal solution.
    (In real-world currency systems, each denomination is typically a multiple of smaller denominations.)
    - The amount and note denominations are positive integers.
    - It's always possible to make up the given amount with the provided denominations.

Approach:
    We'll use a greedy algorithm, always choosing the largest possible denomination first. This approach works
    correctly for standard currency systems and is more efficient than dynamic programming for this specific scenario.

Time Complexity: O(len(denominations))
Space Complexity: O(len(denominations))
"""

def get_used_notes(amount, denominations):
    # Sort denominations in descending order
    denominations.sort(reverse=True)
    
    used_notes = {}
    
    for note in denominations:
        if amount >= note:
            count = amount // note
            used_notes[note] = count
            amount -= count * note
    
    # If there's still some amount left, it's not possible to make the exact change
    if amount > 0:
        return None
    
    return used_notes

# Example usage
amount = 655
denominations = [5, 10, 20, 100, 200]

result = get_used_notes(amount, denominations)

if result:
    print(f"Notes needed to make {amount}:")
    for note, count in result.items():
        print(f"{count} note(s) of {note}")
    print(f"Total notes: {sum(result.values())}")
else:
    print(f"It's not possible to make exactly {amount} with the given denominations.")

"""
Explanation of the solution:

1. We start by sorting the denominations in descending order to consider the largest notes first.

2. We iterate through each denomination:
   - If the current amount is greater than or equal to the note value, we calculate how many of this note we can use.
   - We add this to our used_notes dictionary and subtract from the remaining amount.

3. If there's any amount left after considering all denominations, it means we can't make the exact change (which shouldn't happen given our problem constraints), so we return None.

4. Otherwise, we return the dictionary of used notes.

This greedy approach is optimal for standard currency systems where each denomination is typically a multiple
of smaller denominations. It's simpler and more efficient than dynamic programming for this specific scenario.

The time complexity is O(len(denominations)) for sorting and iterating through the denominations.
The space complexity is O(len(denominations)) for storing the used notes.

This solution efficiently solves the Note Change Problem, providing both the minimum number of notes
and a breakdown of which notes to use.
"""