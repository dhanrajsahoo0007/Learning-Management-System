"""
Problem Statement:
    Given an array of strings strs, group the anagrams together. You can return the answer in any order.

    An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase,
    typically using all the original letters exactly once.

Time Complexity: O(n * k), where n is the number of strings and k is the maximum length of a string in strs
Space Complexity: O(n * k) to store the grouped anagrams

Explanation:
    This solution uses a hash map approach to group anagrams. For each string, we create a count
    of its characters and use this count as a key in our hash map. All anagrams will have the same
    character count, so they'll be grouped together under the same key.

Examples:
1. Input: strs = ["eat","tea","tan","ate","nat","bat"]
   Output: [["bat"],["nat","tan"],["ate","eat","tea"]]

2. Input: strs = [""]
   Output: [[""]]

3. Input: strs = ["a"]
   Output: [["a"]]
"""

import collections

class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        str_map = collections.defaultdict(list)
        
        for string in strs :
            counts = [0]*26
            for c in string:
                counts[ord(c)-ord("a")] += 1
            str_map[tuple(counts)].append(string)
        return str_map.values()
    
input = ["act","pots","tops","cat","stop","hat"]   

print(Solution().groupAnagrams(strs=input))

# (1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0):['act', 'cat']
# (0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0):['pots', 'tops', 'stop']
# (1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0):['hat']

# output =  dict_values([['act', 'cat'], ['pots', 'tops', 'stop'], ['hat']])


