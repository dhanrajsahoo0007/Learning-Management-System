"""
Problem Statement:

    Given an array of characters chars, compress it using the following algorithm:

    1. Begin with an empty string s. For each group of consecutive repeating characters in chars:
        - If the group's length is 1, append the character to s.
        - Otherwise, append the character followed by the group's length.
    2. The compressed string s should not be returned separately, but instead, be stored in the input character array chars.
    3. Note that group lengths that are 10 or longer will be split into multiple characters in chars.
    4. After you are done modifying the input array, return the new length of the array.
    You must write an algorithm that uses only constant extra space.

Example:
    Input: chars = ["a","a","b","b","c","c","c"]
    Output: Return 6, and the first 6 characters of the input array should be: ["a","2","b","2","c","3"]
    Explanation: The groups are "aa", "bb", and "ccc". This compresses to "a2b2c3".

Time Complexity: O(n), where n is the length of the input array.
Space Complexity: O(1), as we're modifying the input array in-place and using only a constant amount of extra space.
"""

class Solution:
    def compress(self, chars: list[str]) -> int:

        """
        Solve with 2 pointers , when one pointer points to the index and the other through the loop 
        """
        n = len(chars)
        
        i = 0
        index = 0
        
        while i < n:
            curr = chars[i]
            
            count = 0
            # Find count of duplicates
            while i < n and chars[i] == curr:
                i += 1
                count += 1
            
            # Assign it to chars and move index ahead to add the count
            chars[index] = curr
            index += 1
            
            # Add the count and handle the cases where the count is more than a single digit .
            if count > 1:
                count_str = str(count)
                for ch in count_str:
                    chars[index] = ch
                    index += 1
        
        return index

# Test cases
def test_compress():
    solution = Solution()
    
    # Test case 1: Basic compression
    chars1 = ["a","a","b","b","c","c","c"]
    print("Test case 1:")
    print("Input:", chars1)
    result1 = solution.compress(chars1)
    print("Output length:", result1)
    print("Compressed array:", chars1[:result1])
    print()
    
    # Test case 2: No compression needed
    chars2 = ["a"]
    print("Test case 2:")
    print("Input:", chars2)
    result2 = solution.compress(chars2)
    print("Output length:", result2)
    print("Compressed array:", chars2[:result2])
    print()
    
    # Test case 3: Long sequence of same character
    chars3 = ["a","b","b","b","b","b","b","b","b","b","b","b","b"]
    print("Test case 3:")
    print("Input:", chars3)
    result3 = solution.compress(chars3)
    print("Output length:", result3)
    print("Compressed array:", chars3[:result3])
    print()

# Run the tests
test_compress()