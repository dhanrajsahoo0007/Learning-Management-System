"""
Given a string, dna, that represents a DNA subsequence, and a number k, return all the contiguous subsequences (substrings) of length k
that occur more than once in the string.
The order of the returned subsequences does not matter.
If no repeated substring is found, the function should return an empty set.
"""
def findRepeatedDnaSequences(self, s: str) -> list[str]:
        """
        Time complexity O(nK)
        Space Complexity (nK)
        # Not optimal solution. Use the Rabin Karp algorithm to create rolling hashes and compare that
        # Todo Implement RabinKarp algo and use that
        """
        from collections import defaultdict
        k = 10       
        pattern_counter = defaultdict(int)
        result_list = list()
        if len(s) < k:
            return set()
        window_start_pos = 0
        window_end_pos = k-1
        while window_end_pos < len(s):
            current_word = s[window_start_pos: window_end_pos+1]
            pattern_counter[current_word] += 1
            window_end_pos += 1
            window_start_pos += 1
        for pattern in pattern_counter:
            if pattern_counter[pattern] > 1:
                result_list.append(pattern)
        return result_list


def findRepeatedDnaSequencesRabinKarp(self, s: str) -> list[str]:
    """
    Complexity Analysis

    Time complexity : O(N−L), that is O(N) for the constant L=10.
                        In the loop executed N−L+1 one builds a hash in a constant time, that results in O(N−L) time complexity.

    Space complexity : O(N−L) to keep the hashset, that results in O(N) for the constant L=10.
    """
    k = 10
    L, n = k, len(s)
    if n <= L:
        return []


    # rolling hash parameters: base a
    a = 4
    aL = pow(a, L)

    # convert string to array of integers
    to_int = {"A": 0, "C": 1, "G": 2, "T": 3}
    nums = [to_int.get(s[i]) for i in range(n)]

    h = 0
    seen, output = set(), set()
    # iterate over all sequences of length L
    for start in range(n - L + 1):
        # compute hash of the current sequence in O(1) time
        if start != 0:
            h = h * a - nums[start - 1] * aL + nums[start + L - 1]

        # compute hash of the first sequence in O(L) time
        else:
            for i in range(L):
                h = h * a + nums[i]

        # update output and hashset of seen sequences
        if h in seen:
            output.add(s[start : start + L])
        seen.add(h)
    return output
