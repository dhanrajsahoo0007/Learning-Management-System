"""
Problem Statement:
    Maximum Odd Binary Number
        You are given a binary string s that contains at least one '1'.
        You have to rearrange the bits in such a way that the resulting binary number is the maximum odd binary number that can be created from this combination.
        Return a string representing the maximum odd binary number that can be created from the given combination.
        Note that the resulting string can have leading zeros.

Explanation:
    1. Count the number of '1's in the input string.
    2. To create the maximum odd binary number:
       - Place one '1' at the end to ensure the number is odd.
       - Place the remaining '1's at the beginning of the string.
       - Fill the rest with '0's.
    3. This arrangement ensures the highest possible value while keeping the number odd.
    4. Construct the result string based on this arrangement.

Time Complexity: O(n), where n is the length of the input string.
We iterate through the string once to count '1's and then construct the result string.

Space Complexity: O(n)
We create a new string of the same length as the input string.
"""

class Solution:
    def maximumOddBinaryNumber(self, s: str) -> str:
        # Count the number of '1's in the string
        count_ones = s.count('1')
        
        # Calculate the number of '0's
        count_zeros = len(s) - count_ones
        
        # Construct the result string
        # Place (count_ones - 1) '1's at the beginning
        # Then place all '0's
        # Finally, place the last '1' at the end
        result = '1' * (count_ones - 1) + '0' * count_zeros + '1'
        
        return result
    

"""
Explanation:
    1. Convert the input string to a list of characters.
    2. Initialize a 'left' pointer to keep track of where to place '1's.
    3. Iterate through the string, moving all '1's to the left side.
    4. Finally, ensure the last digit is '1' by swapping the rightmost '1' with the last character.

Time Complexity: O(n), where n is the length of the input string.We iterate through the string once.
Space Complexity: O(n) ,We create a list of the same length as the input string.
"""

class Solution:
    def maximumOddBinaryNumber(self, s: str) -> str:
        # Convert string to list of characters
        s = [c for c in s]
        left = 0
        
        # Move all '1's to the left side
        ## for the example 010101 , the output after the above code block in 111000
        for i in range(len(s)):
            if s[i] == "1":
                s[i], s[left] = s[left], s[i]
                left += 1
        
        #move the last 1 from 111000 to the last element
        # After the above operation the left pointer will be at 111(<-here)000       
        # Ensure the last digit is '1' by swapping
        s[left - 1], s[len(s) - 1] = s[len(s) - 1], s[left - 1]
        
        # Convert back to string and return
        return "".join(s)


# Test the solution
if __name__ == "__main__":
    solution = Solution()
    
    # Test case 1
    s1 = "010"
    print(f"Input: {s1}")
    print(f"Output: {solution.maximumOddBinaryNumber(s1)}")
    
    # Test case 2
    s2 = "0101"
    print(f"Input: {s2}")
    print(f"Output: {solution.maximumOddBinaryNumber(s2)}")