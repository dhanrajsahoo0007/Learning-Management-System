"""
Problem Statement:
    Given a string and an integer K, find the length of the longest substring that contains exactly K unique characters.


Time Complexity: O(n), where n is the length of the string.
Space Complexity: O(K), where K is the number of unique characters we're looking for.
"""

# Test cases
def run_test_case(s, k):
    result = longest_k_unique_substring(s, k)
    print(f"String: {s}")
    print(f"K: {k}")
    print(f"Output: {result}")
    print()

# Test cases
run_test_case("aabacbebebe", 3)
run_test_case("abcdefg", 3)
run_test_case("aaabbb", 3)
run_test_case("aabbcc", 3)
run_test_case("", 2)
run_test_case("aaabbbccc", 1)
run_test_case("abcbdbdbbdcdabd", 2)
