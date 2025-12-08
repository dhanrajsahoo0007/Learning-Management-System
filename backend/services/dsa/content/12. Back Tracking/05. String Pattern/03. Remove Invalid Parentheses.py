"""
Problem Statement:
    Given a string s that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid.
    Return all possible results in a list.

    A string is valid if it has:
        1. Equal number of opening and closing parentheses
        2. Every closing parenthesis has a corresponding opening parenthesis that comes before it

Time Complexity: O(2^N) where N is the length of the string
    - In worst case, we might have to try all possible combinations of parentheses to remove

Space Complexity: O(N) 
    - The recursion stack can go up to the length of the string
    - Additional space is used to store the results

Example:
    Input: s = "()())()"
    Output: ["()()()", "(())()"]

    Input: s = "(a)())()"
    Output: ["(a)()()", "(a())()"]

    Input: s = ")("
    Output: [""]


Detailed Explanation:

1. The algorithm uses DFS (Depth-First Search) to explore all possible combinations of parentheses.

2. For each character in the string:
   - If it's a letter, we always include it
   - If it's an opening parenthesis "(", we can either include or exclude it
   - If it's a closing parenthesis ")", we can include it only if we have more opening parentheses,
     or we can exclude it

3. We keep track of:
   - The longest valid string found so far
   - A set of all valid strings with the maximum length
   - Count of left and right parentheses in current combination

4. Key Implementation Details:
   - We use a set to avoid duplicate results
   - We only store results that have the maximum possible length
   - We maintain balance by tracking left and right parenthesis counts
   - We use backtracking to try different combinations

5. The solution ensures:
   - Minimum number of removals (by keeping only max length results)
   - All possible valid combinations are found
   - No duplicate results
   - Maintains original order of characters
"""

class Solution:
    def removeInvalidParentheses(self, s: str) -> list[str]:
        # Initialize longest valid string length to -1
        self.longest_string = -1
        # Initialize result set to store unique valid strings
        self.res = set()
        
        # Start DFS with initial parameters
        self.dfs(s, 0, [], 0, 0)
        
        return self.res

    def dfs(self, string, cur_idx, cur_res, l_count, r_count):
        """
        DFS function to explore all possible combinations
        
        Args:
        string: Input string
        cur_idx: Current index in string
        cur_res: Current result being built
        l_count: Count of left parentheses
        r_count: Count of right parentheses
        """
        
        # Base case: reached end of string
        if cur_idx >= len(string):
            # If we have equal number of left and right parentheses
            if l_count == r_count:
                # If current result is longer than previous longest
                if len(cur_res) > self.longest_string:
                    self.longest_string = len(cur_res)
                    self.res = set()
                    self.res.add("".join(cur_res))
                # If current result is equal to longest found so far
                elif len(cur_res) == self.longest_string:
                    self.res.add("".join(cur_res))
            return
            
        # Get current character
        cur_char = string[cur_idx]
        
        # If current character is opening parenthesis
        if cur_char == "(":
            # Try including it
            cur_res.append(cur_char)
            self.dfs(string, cur_idx + 1, cur_res, l_count + 1, r_count)
            cur_res.pop()
            
            # Try excluding it
            self.dfs(string, cur_idx + 1, cur_res, l_count, r_count)
            
        # If current character is closing parenthesis
        elif cur_char == ")":
            # Try excluding it
            self.dfs(string, cur_idx + 1, cur_res, l_count, r_count)
            
            # Only include if we have more left parentheses than right
            if l_count > r_count:
                cur_res.append(cur_char)
                self.dfs(string, cur_idx + 1, cur_res, l_count, r_count + 1)
                cur_res.pop()
                
        # If current character is a letter
        else:
            # Always include letters
            cur_res.append(cur_char)
            self.dfs(string, cur_idx + 1, cur_res, l_count, r_count)
            cur_res.pop()

# Example usage:
if __name__ == "__main__":
    solution = Solution()
    
    # Test Case 1
    s1 = "()())()"
    print(f"\nTest Case 1:")
    print(f"Input: {s1}")
    print(f"Output: {solution.removeInvalidParentheses(s1)}")
    
    # Test Case 2
    s2 = "(a)())()"
    print(f"\nTest Case 2:")
    print(f"Input: {s2}")
    print(f"Output: {solution.removeInvalidParentheses(s2)}")
    
    # Test Case 3
    s3 = ")("
    print(f"\nTest Case 3:")
    print(f"Input: {s3}")
    print(f"Output: {solution.removeInvalidParentheses(s3)}")
    
    # Test Case 4
    s4 = "((())"
    print(f"\nTest Case 4:")
    print(f"Input: {s4}")
    print(f"Output: {solution.removeInvalidParentheses(s4)}")
