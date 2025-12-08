"""
Problem: Expression Add Operators

Given a string num that contains only digits and an integer target, return all possibilities 
to insert the binary operators '+', '-', and/or '*' between the digits of num so that the 
resultant expression evaluates to the target value.

Note: Operands in the returned expressions should not contain leading zeros.

Time Complexity: O(4^N * N) where N is the length of num string
- For each position between digits, we have 4 choices: no operator, +, -, *
- Each expression evaluation takes O(N)

Space Complexity: O(N)
- Recursion stack can go up to depth N
- Space needed to store current expression being built


Detailed Explanation:

1. Algorithm Approach:
   - Use DFS (Depth-First Search) to try all possible combinations
   - At each step, try different length numbers and different operators
   - Handle multiplication precedence carefully

2. Key Implementation Details:
   a) Base case: 
      - When we've used all digits, check if sum equals target
   
   b) For each position:
      - Try different length numbers (handle leading zeros)
      - Try different operators (+, -, *)
      - Special handling for first number (no operator)
   
   c) Multiplication handling:
      - Need to maintain previous operand
      - Adjust current sum by removing previous operation and adding new product

3. Example Walkthrough for "123" target=6:
   Start: cur_idx=0, cur_res=[], cur_sum=0, prev=0
   - Take "1": 
     cur_sum=1, prev=1
     - Take "2": Try operators
       "1+2": cur_sum=3, prev=2
       "1-2": cur_sum=-1, prev=-2
       "1*2": cur_sum=2, prev=2
     - Continue with each branch...

4. Important Edge Cases:
   - Leading zeros not allowed in operands
   - Single digit numbers
   - No possible solutions
   - Multiple valid solutions
   - Operator precedence (especially for multiplication)
"""

class Solution:
    def addOperators(self, num: str, target: int) -> list[str]:
        # Initialize result list to store valid expressions
        res = []
        
        def dfs(cur_idx: int, cur_res: list[str], cur_sum: int, prev: int):
            """
            DFS helper function to build expressions
            
            Args:
                cur_idx: Current index in num string
                cur_res: Current expression segments list
                cur_sum: Current value of expression
                prev: Previous operand (needed for multiplication precedence)
            """
            # Base case: if we've processed all digits
            if cur_idx >= len(num):
                # If current sum equals target, we found a valid expression
                if cur_sum == target:
                    res.append("".join(cur_res))
                return
            
            # Try different lengths for current number and different operators
            for i in range(cur_idx, len(num)):
                # Get current number segment
                cur_str = num[cur_idx: i + 1]
                cur_num = int(cur_str)
                
                # Handle leading zeros - break if current digit is '0' and length > 1
                if num[cur_idx] == '0' and i > cur_idx:
                    break
                
                # If this is the first number (no operators yet)
                if not cur_res:
                    dfs(i + 1, [cur_str], cur_num, cur_num)
                else:
                    # Try addition
                    dfs(i + 1, cur_res + ["+"] + [cur_str], cur_sum + cur_num, cur_num)
                    
                    # Try subtraction
                    dfs(i + 1, cur_res + ["-"] + [cur_str], cur_sum - cur_num, -cur_num)
                    
                    # Try multiplication
                    # Need to handle operator precedence
                    # For example: if we have "1+2*3", we need:
                    # cur_sum = 1+2 = 3, prev = 2
                    # To get 1+(2*3), we: subtract prev (3-2=1), add (prev*cur_num) = 1+6 = 7
                    dfs(i + 1, cur_res + ["*"] + [cur_str], 
                        cur_sum - prev + (prev * cur_num), 
                        prev * cur_num)
        
        # Start DFS with initial values
        dfs(0, [], 0, 0)
        return res


def test_add_operators():
    solution = Solution()
    
    # Test Case 1: Basic case with multiple solutions
    num1, target1 = "123", 6
    print(f"\nTest Case 1:")
    print(f"Input: num = '{num1}', target = {target1}")
    result1 = solution.addOperators(num1, target1)
    print(f"Output: {result1}")
    # Expected: ["1*2*3","1+2+3"]
    
    # Test Case 2: Multiple solutions with same digits
    num2, target2 = "232", 8
    print(f"\nTest Case 2:")
    print(f"Input: num = '{num2}', target = {target2}")
    result2 = solution.addOperators(num2, target2)
    print(f"Output: {result2}")
    # Expected: ["2*3+2","2+3*2"]
    
    # Test Case 3: Leading zeros case
    num3, target3 = "105", 5
    print(f"\nTest Case 3:")
    print(f"Input: num = '{num3}', target = {target3}")
    result3 = solution.addOperators(num3, target3)
    print(f"Output: {result3}")
    # Expected: ["1*0+5","10-5"]
    
    # Test Case 4: Single digit case
    num4, target4 = "5", 5
    print(f"\nTest Case 4:")
    print(f"Input: num = '{num4}', target = {target4}")
    result4 = solution.addOperators(num4, target4)
    print(f"Output: {result4}")
    # Expected: ["5"]
    
    # Test Case 5: No solution exists
    num5, target5 = "99", 100
    print(f"\nTest Case 5:")
    print(f"Input: num = '{num5}', target = {target5}")
    result5 = solution.addOperators(num5, target5)
    print(f"Output: {result5}")
    # Expected: []

if __name__ == "__main__":
    test_add_operators()

