# Problem Statement:
#     Given a string, generate all unique subsequences of that string using backtracking.
#     A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

# Approach:
#     We'll use backtracking to generate all possible subsequences. Here's how we'll approach this:
#     1. Start with an empty subsequence.
#     2. For each character in the string, we have two choices:
#         a. Include the character in the subsequence
#         b. Exclude the character from the subsequence
#     3. We'll use a set to store the subsequences to ensure uniqueness.
#     4. We'll use recursion to explore all possible combinations.

def generate_unique_subsequences(index, input_str, output, result):
    # Base case: when we reach the end of the string
    if index == len(input_str):
        result.add(output)
        return
    
    # Include the current character
    generate_unique_subsequences(index + 1, input_str, output + input_str[index], result)
    
    # Exclude the current character
    generate_unique_subsequences(index + 1, input_str, output, result)

def get_unique_subsequences(input_str):
    result = set()
    generate_unique_subsequences(0, input_str, "", result)
    return sorted(list(result))

# Test the function
print(get_unique_subsequences("abc"))
print(get_unique_subsequences("aa"))
print(get_unique_subsequences("aab"))

# Recursive Tree:
#     For the string "abc", the recursive tree would look like this:
#                         ""
#                      /      \
#                     a        ""
#                   /   \    /    \
#                 ab    a   b      ""
#                / \   / \ / \    / \
#               abc ab ac a bc b  c  ""

# Time Complexity:
#     In the worst case, we generate 2^n subsequences, where n is the length of the string.
#     For each subsequence, we perform O(n) work to create the string.
#     Therefore, the time complexity is O(n * 2^n).

# Space Complexity:
#     The recursion depth can go up to n, so the stack space is O(n).
#     We store all unique subsequences. In the worst case (all characters are unique), we store 2^n subsequences.
#     Each subsequence can be up to n characters long.
#     Therefore, the space complexity is O(n * 2^n).