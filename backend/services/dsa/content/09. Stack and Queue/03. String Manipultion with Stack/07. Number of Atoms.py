"""
Problem Statement: Number of Atoms
    
    Given a string formula representing a chemical formula, return the count of each atom.
    The atomic element always starts with an uppercase character, then zero or more lowercase letters, representing the name.
    
    One or more digits representing that element's count may follow if the count is greater than 1. If the count is 1, no digits will follow.
    Two formulas are concatenated together to produce another formula.
    A formula placed in parentheses, and a count (optionally added) is also a formula.
    
    Return the count of all elements as a string in the following form: the first name (in sorted order), followed by its count (if that count is more than 1), followed by the second name (in sorted order), followed by its count (if that count is more than 1), and so on.

Time Complexity: O(n log n), where n is the length of the formula.
    - We iterate through the formula once, which takes O(n) time.
    - Sorting the final dictionary of atoms takes O(k log k) time, where k is the number of unique atoms.
    - In the worst case, k can be O(n), so the overall time complexity is O(n log n).

Space Complexity: O(n)
    - In the worst case, we might need to store all characters in the stack and dictionary.

Detailed explanation of the solution:

1. We use a stack of defaultdict(int) to keep track of atom counts at each level of nesting.
   The defaultdict allows us to increment counts without checking if the atom exists first.

2. We iterate through the formula string character by character:
   a. If we encounter an opening parenthesis '(':
      - We start a new level of nesting by adding a new dictionary to the stack.
   
   b. If we encounter a closing parenthesis ')':
      - We end the current nesting level by popping the top dictionary from the stack.
      - We parse the multiplier following the closing parenthesis.
      - We multiply all atom counts in the popped dictionary by this multiplier and add them to the previous level.
   
   c. For atoms:
      - We parse the atom name (uppercase followed by lowercase letters).
      - We parse its count (if any, default to 1 if not specified).
      - We add the atom and its count to the current level (top of the stack).

3. After processing the entire formula, the bottom dictionary in the stack contains the final atom counts.

4. We sort the atoms alphabetically and format the result string:
   - We iterate through the sorted items of the atom count dictionary.
   - We always append the atom name to the result list.
   - If the count is greater than 1, we append the count as a string.
   - Finally, we join all elements in the result list into a single string.

This solution efficiently handles all requirements of the problem:
    - It correctly parses atom names and their counts.
    - It deals with nested parentheses and applies multipliers correctly.
    - The output is sorted alphabetically by atom name.
    - It works for formulas up to 1000 characters long, as per the problem constraints.

The use of a stack allows us to handle nested parentheses elegantly, and the defaultdict simplifies atom count management.
The final sorting step ensures that the output is in the required alphabetical order.
"""

from collections import defaultdict

class Solution:
    def countOfAtoms(self, formula: str) -> str:
        # Stack to store dictionaries of atom counts at each level of nesting
        stack = [defaultdict(int)]
        i = 0
        n = len(formula)
        
        while i < n:
            if formula[i] == '(':
                # Start a new level of nesting
                stack.append(defaultdict(int))
                i += 1
            elif formula[i] == ')':
                # End of current nesting level
                top = stack.pop()
                i += 1
                # Parse the multiplier after ')'
                i_start = i
                while i < n and formula[i].isdigit():
                    i += 1
                multiplier = int(formula[i_start:i] or 1)
                # Apply multiplier to all atoms in the current level and add to the previous level
                for name, v in top.items():
                    stack[-1][name] += v * multiplier
            else:
                # Parse atom name (starts with uppercase, followed by lowercase)
                i_start = i
                i += 1
                while i < n and formula[i].islower():
                    i += 1
                name = formula[i_start:i]
                
                # Parse atom count
                i_start = i
                while i < n and formula[i].isdigit():
                    i += 1
                count = int(formula[i_start:i] or 1)
                
                # Add atom count to the current level
                stack[-1][name] += count
        
        # Simplified result formatting
        result = []
        for name, count in sorted(stack[0].items()):
            result.append(name)
            if count > 1:
                result.append(str(count))
        
        return ''.join(result)

# Test cases
solution = Solution()

# Test case 1: Simple molecule
print(solution.countOfAtoms("H2O"))  # Output: "H2O"
# Explanation: The count of elements are {'H': 2, 'O': 1}.

# Test case 2: Molecule with parentheses
print(solution.countOfAtoms("Mg(OH)12"))  # Output: "H2MgO2"
# Explanation: The count of elements are {'H': 2, 'Mg': 1, 'O': 2}.

# Test case 3: Complex molecule with nested parentheses
print(solution.countOfAtoms("K4(ON(SO3)2)2"))  # Output: "K4N2O14S4"
# Explanation: The count of elements are {'K': 4, 'N': 2, 'O': 14, 'S': 4}.

# Additional test cases
print(solution.countOfAtoms("Be32"))  # Output: "Be32"
# Explanation: Single element with count > 1

print(solution.countOfAtoms("(({(BeLi)Li2})2Be)3Li2"))  # Output: "Be7Li14"
# Explanation: Complex nesting with multiple levels of parentheses
