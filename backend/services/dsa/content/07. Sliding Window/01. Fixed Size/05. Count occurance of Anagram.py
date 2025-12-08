"""
Problem Statement:
    Given a word and a text, return the count of occurrences of anagrams of the word in the text.
    An anagram of a word is a rearrangement of its letters to form a new word.

Explanation:
    1. Create a frequency map of characters in the pattern.
    2. Use a count variable to track distinct characters in the pattern.
    3. Slide the window through the text:
        - Decrement frequency for characters in the window.
        - When a character's frequency becomes 0, decrement count.
        - If count becomes 0, we've found an anagram.
        - Slide the window and adjust the frequency map and count.

Time Complexity: O(n), where n is the length of the text.
Space Complexity: O(k), where k is the number of unique characters in the pattern.

"""

from collections import Counter

def count_anagram_occurrences(text, pattern):
    pattern_freq = Counter(pattern)
    distinct_char_count = len(pattern_freq)  # Count of distinct characters in pattern
    anagram_count = 0  # Answer: count of anagram occurrences
    n, k = len(text), len(pattern)
    
    i, j = 0, 0  # Window pointers
    
    while j < n:
        # Process the current character
        if text[j] in pattern_freq:
            pattern_freq[text[j]] -= 1
            if pattern_freq[text[j]] == 0:
                distinct_char_count -= 1
        
        # If window size is less than pattern length, expand window
        if j - i + 1 < k:
            j += 1
        # If window size equals pattern length
        elif j - i + 1 == k:
            # Check if we found an anagram
            if distinct_char_count == 0:
                anagram_count += 1
            
            # Slide the window
            if text[i] in pattern_freq:
                pattern_freq[text[i]] += 1
                if pattern_freq[text[i]] == 1:
                    distinct_char_count += 1
            
            i += 1
            j += 1
    
    return anagram_count

# Example usage
text = "forxxorfxdofr"
pattern = "for"
result = count_anagram_occurrences(text, pattern)
print(f"Number of occurrences of anagrams of '{pattern}' in '{text}': {result}")