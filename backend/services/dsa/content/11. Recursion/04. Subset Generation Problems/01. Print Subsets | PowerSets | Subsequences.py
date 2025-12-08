"""
Problem Statement:
    Given a string, find all possible subsequences of the string.
    A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

Examples:

    Input: str = "abc"
    Output: a, ab, abc, ac, b, bc, c
    Explanation: These are all 7 subsequences for the string "abc".

    Input: str = "aa"
    Output: a, a, aa
    Explanation: These are all 3 subsequences for the string "aa".


The solution uses a recursive approach with backtracking to generate all possible subsequences. Here's how it works:

We define a recursive function generate_subsequences that takes four parameters:

    index: The current index in the input string
    input_str: The original input string
    output: The current subsequence being built
    result: A list to store all subsequences

The base case: When index reaches the end of the input string, we add the current output to the result list if it's not empty.

For each character, we have two choices:

    Include the character: We add it to the output and make a recursive call
    Exclude the character: We make a recursive call without adding it to the output


    We use a wrapper function get_subsequences to initialize the result list and start the recursion.
    The recursion builds all possible subsequences by including and excluding each character.

Space Complexity:

    O(2^n), where n is the length of the input string. In the worst case, we generate 2^n subsequences (for a string with all distinct characters).
    The recursion depth is O(n), which contributes to the space complexity on the call stack.

Time Complexity:

    O(n * 2^n), where n is the length of the input string.
    We have 2^n subsequences, and for each, we may perform O(n) work to create and add the subsequence to the result list.



                     ("abc", "")
                    /           \
           ("bc", "a")          ("bc", "")
           /         \          /         \
    ("c", "ab")  ("c", "a")  ("c", "b")  ("c", "")
    /       \    /       \    /       \    /     \
("", "abc")("", "ab")("", "ac")("", "a")("", "bc")("", "b")("", "c")("")



                          ("abc", "")
                        /           \
                   Include 'a'    Not Include 'a'
                      /               \
               ("bc", "a")          ("bc", "")
              /         \          /         \
        Include 'b'  Not Include 'b'  Include 'b'  Not Include 'b'
        /                \          /                \
  ("c", "ab")          ("c", "a")  ("c", "b")        ("c", "")
   /       \           /       \    /       \        /       \
  Inc 'c' Not Inc 'c' Inc 'c' Not Inc 'c' Inc 'c' Not Inc 'c' Inc 'c' Not Inc 'c'
   |         |         |         |         |         |         |         |
  ("", "abc")("", "ab")("", "ac")("", "a")("", "bc")("", "b")("", "c")   ("")


"""

def generate_subsequences(index, input_str, output, result):
    if index == len(input_str):
        if output:
            result.append(output)
        return
    
    # Include the current character
    generate_subsequences(index + 1, input_str, output + input_str[index], result)
    
    # Exclude the current character
    generate_subsequences(index + 1, input_str, output, result)

# Wrapper function to initialize result and call the recursive function
def get_subsequences(input_str):
    result = []
    generate_subsequences(0, input_str, "", result)
    return result

# Test the function
print(get_subsequences("abc"))
print(get_subsequences("aab"))