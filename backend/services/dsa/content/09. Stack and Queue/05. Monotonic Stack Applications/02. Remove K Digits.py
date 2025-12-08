"""
Problem Statement: Remove K Digits

Given string num representing a non-negative integer num, and an integer k, return the smallest possible integer after removing k digits from num.

Example 1:
    Input: num = "1432219", k = 3
    Output: "1219"
    Explanation: Remove the three digits 4, 3, and 2 to form the new number 1219 which is the smallest.

Example 2:
    Input: num = "10200", k = 1
    Output: "200"
    Explanation: Remove the leading 1 and the number is 200. Note that the output must not contain leading zeroes.

Example 3:
    Input: num = "10", k = 2
    Output: "0"
    Explanation: Remove all the digits from the number and it is left with nothing which is 0.

Constraints:
    * 1 <= k <= num.length <= 10^5
    * num consists of only digits.
    * num does not have any leading zeros except for the zero itself.

Answer Explanation:
    1. We iterate through each digit in the input number.
    2. For each digit, we compare it with the last digit in our result:
        - If the current digit is smaller and we still have removals left (k > 0),
          we remove digits from the end of our result until we find a smaller digit or run out of removals.
    3. We add the current digit to our result if it's not a leading zero.
    4. After processing all digits, if we still have removals left, we remove them from the end.
    5. If our result is empty, we return "0".

This approach ensures that we keep the smallest possible number by always removing larger digits when possible.

Time Complexity: O(n), where n is the length of the input string num.
    - We iterate through each digit once, and each digit is added and removed at most once.

Space Complexity: O(n)
    - In the worst case, we might need to store all digits in our result string.
"""

class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        result = ""  # This will act like a stack
        
        for digit in num:
            # Remove digits from the end of result if they are larger than the current digit
            # and we still have removals left
            while result and result[-1] > digit and k > 0:
                result = result[:-1]  # Remove the last digit
                k -= 1
            
            # Add the current digit if it's not a leading zero
            # to avoid the case when we have preceeding zeros
            if result or digit != '0':
                result += digit
        
        # If we still have removals left, remove from the end
        # for case where the numbers are in sorted order like 13456 , no element would have been deleted  
        if k > 0:
            result = result[:-k]
        
        # If we've removed all digits, return "0"
        return result if result else "0"

# Test the function
if __name__ == "__main__":
    solution = Solution()
    
    test_cases = [
        ("1432219", 3),
        ("10200", 1),
        ("10", 2),
        ("112", 1)
    ]
    
    for num, k in test_cases:
        result = solution.removeKdigits(num, k)
        print(f"Input: num = {num}, k = {k}")
        print(f"Output: {result}")
        print()