"""
Given strings s1 and s2, return the minimum contiguous substring part of s1, so that s2 is a subsequence of the part.

If there is no such window in s1 that covers all characters in s2, return the empty string "".
If there are multiple such minimum-length windows, return the one with the left-most starting index.



Example 1:

Input: s1 = "abcdebdde", s2 = "bde"
Output: "bcde"
Explanation:
"bcde" is the answer because it occurs before "bdde" which has the same length.
"deb" is not a smaller window because the elements of s2 in the window must occur in order.

"""
def minWindow(self, S, T):
   """
   Time complexity of On^2
   Space Complexity of O(1)
   """
    def find_subseq(s):
        t = 0
        while s < len(S):
            if S[s] == T[t]:
                t += 1
                if t == len(T):
                    break
            s += 1
        # Ensure last character of T was found before loop ended
        return s if t == len(T) else None

    # Improve - Get best starting point of subsequence ending at S[s]
    def improve_subseq(s):
        t = len(T) - 1
        while t >= 0:
            if S[s] == T[t]:
                t -= 1
            s -= 1
		return s+1

    s, min_len, min_window = 0, float('inf'), ''

    while s < len(S):
        # Find end-point of subsequence
        end = find_subseq(s)
        if end == None:
            break

        # Improve start-point of subsequence
        start = improve_subseq(end)

        # Track min length
		if end-start+1 < min_len:       

            min_len = end-start+1
            min_window = S[start:end+1]
        # Start next subsequence search
        s = start+1
    return min_window
