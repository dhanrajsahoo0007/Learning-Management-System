"""
451. Sort Characters By Frequency
Solved
Medium
Topics
Companies
Given a string s, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string.

Return the sorted string. If there are multiple answers, return any of them.

 

Example 1:

Input: s = "tree"
Output: "eert"
Explanation: 'e' appears twice while 'r' and 't' both appear once.
So 'e' must appear before both 'r' and 't'. Therefore "eetr" is also a valid answer.
Example 2:

Input: s = "cccaaa"
Output: "aaaccc"
Explanation: Both 'c' and 'a' appear three times, so both "cccaaa" and "aaaccc" are valid answers.
Note that "cacaca" is incorrect, as the same characters must be together.
Example 3:

Input: s = "Aabb"
Output: "bbAa"
Explanation: "bbaA" is also a valid answer, but "Aabb" is incorrect.
Note that 'A' and 'a' are treated as two different characters.
 

Constraints:

1 <= s.length <= 5 * 105
s consists of uppercase and lowercase English letters and digits.
"""

class Solution:
    def frequencySort(self, s: str) -> str:
        import heapq
        from collections import defaultdict
        
        frequency_map = defaultdict(int) # char_freq
        for char in s:
            frequency_map[char] += 1
        
        freq_heap = []
        for char,char_freq in frequency_map.items():
            heapq.heappush(freq_heap, (-char_freq, char))
        results = []
        while freq_heap:  
            char_freq,char = heapq.heappop(freq_heap)
            results.append(char*abs(char_freq))
        return "".join(results)
"""
Current Time & Space Complexity:

Time: O(N log k) where N is string length and k is number of unique characters

Building frequency map: O(N)
Heap operations: O(k log k) where k is unique chars
Building result: O(N)


Space: O(N)

frequency_map: O(k)
freq_heap: O(k)
results: O(N)



Here are a few alternative approaches with different trade-offs:

Using Counter and sorted (more concise):

pythonCopyclass Solution:
    def frequencySort(self, s: str) -> str:
        from collections import Counter
        # One-liner using Counter and sorted
        return ''.join(char * freq for char, freq in 
                      sorted(Counter(s).items(), key=lambda x: (-x[1], x[0])))

Using bucket sort (optimal for ASCII characters):

pythonCopyclass Solution:
    def frequencySort(self, s: str) -> str:
        from collections import Counter
        
        # Count frequencies
        counts = Counter(s)
        
        # Create frequency buckets
        max_freq = max(counts.values())
        buckets = [[] for _ in range(max_freq + 1)]
        
        # Put characters in frequency buckets
        for char, freq in counts.items():
            buckets[freq].append(char)
        
        # Build result from highest to lowest frequency
        result = []
        for freq in range(max_freq, 0, -1):
            for char in buckets[freq]:
                result.append(char * freq)
                
        return ''.join(result)

Most efficient approach (optimized for space):

pythonCopyclass Solution:
    def frequencySort(self, s: str) -> str:
        # Count using array for ASCII chars
        freq = [[0, chr(i)] for i in range(128)]
        
        # Count frequencies
        for char in s:
            freq[ord(char)][0] -= 1  # Negative for default max heap
            
        # Remove unused characters
        freq = [f for f in freq if f[0] < 0]
        
        # Sort by frequency
        freq.sort()
        
        # Build result
        return ''.join(char * -count for count, char in freq)
Comparison of approaches:

Your Heap Solution:

Pros:

Good for streaming data
Works well with any character set


Cons:

Extra heap operations
More complex implementation




Counter + Sorted:

Pros:

Most concise
Very readable


Cons:

Creates intermediate lists
Not ideal for streaming




Bucket Sort:

Pros:

O(N) time complexity if max frequency is bounded
No sorting required


Cons:

Extra space for buckets
Not as efficient if frequency range is large




ASCII Array:

Pros:

Most memory efficient for ASCII
Fast for ASCII strings


Cons:

Limited to ASCII
Less flexible





For most practical cases, the Counter + sorted approach might be preferred due to:
pythonCopyclass Solution:
    def frequencySort(self, s: str) -> str:
        from collections import Counter
        counts = Counter(s)
        return ''.join(c * f for c, f in sorted(counts.items(), 
                                              key=lambda x: (-x[1], x[0])))
Key benefits:

More readable
Uses Python's optimized sorting
Less prone to errors
Easy to modify for different requirements

However, if you're working with:

Streaming data → Use your heap solution
ASCII only → Use array solution
Bounded frequencies → Use bucket sort
General case → Use Counter + sorted

Your original solution is perfectly valid and has good complexity. The choice between these approaches depends on:

Character set requirements
Memory constraints
Whether data is streaming
Need for maintainability
"""