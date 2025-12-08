"""
Problem Statement: 

    Check if the Sentence Is Pangram
    A pangram is a sentence where every letter of the English alphabet appears at least once.
    Given a string sentence containing only lowercase English letters, return true if sentence is a pangram, or false otherwise.

Example 1:
    Input: sentence = "thequickbrownfoxjumpsoverthelazydog"
    Output: true
    Explanation: sentence contains at least one of every letter of the English alphabet.

Example 2:
    Input: sentence = "leetcode"
    Output: false
"""
class Solution:
    def checkIfPangram(self, sentence: str) -> bool:
        
        arr = [0] * 26

        for char in sentence:
            arr[ord(char)-ord("a")] += 1
        
        for i in range(len(arr)) :
            if arr[i] == 0 :
                return False 
        return True 
