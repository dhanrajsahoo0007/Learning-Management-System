"""
Problem: Merge Strings Alternately

    You are given two strings word1 and word2. Merge the strings by adding letters in alternating order, starting with word1. 
    If a string is longer than the other, append the additional letters onto the end of the merged string.

    Return the merged string.

Example 1:
    Input: word1 = "abc", word2 = "pqr"
    Output: "apbqcr"
    Explanation: The merged string will be merged as so:
    word1:  a   b   c
    word2:    p   q   r
    merged: a p b q c r

"""

class Solution:
    def mergeAlternately(self, word1: str, word2: str) -> str:
        i = j = 0  # Initialize pointers for word1 and word2
        res = []   # List to store merged string characters

        # Merge characters alternately while both strings have characters left
        while i < len(word1) and j < len(word2):
            res.append(word1[i])  # Add character from word1
            res.append(word2[j])  # Add character from word2
            i += 1
            j += 1

        # Append any remaining characters from word1
        res.append(word1[i:])

        # Append any remaining characters from word2
        res.append(word2[j:])

        # Join the characters to form the final string
        return ''.join(res)

# Test the solution
if __name__ == "__main__":
    solution = Solution()

    # Test case 1
    word1 = "abc"
    word2 = "pqr"
    print(f"Test case 1: {solution.mergeAlternately(word1, word2)}")
    # Expected: "apbqcr"

    # Test case 2
    word1 = "ab"
    word2 = "pqrs"
    print(f"Test case 2: {solution.mergeAlternately(word1, word2)}")
    # Expected: "apbqrs"