"""
Problem Statement:
    Given an integer, convert it to a roman numeral.
    Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

    Symbol       Value
    I            1
    V            5
    X            10
    L            50
    C            100
    D            500
    M            1000

    Roman numerals are usually written largest to smallest from left to right. 
    However, the numeral for four is not IIII. Instead, the number four is written as IV. 
    Because the one is before the five we subtract it making four. 
    The same principle applies to the number nine, which is written as IX.

There are six instances where subtraction is used:
    - I can be placed before V (5) and X (10) to make 4 and 9. 
    - X can be placed before L (50) and C (100) to make 40 and 90. 
    - C can be placed before D (500) and M (1000) to make 400 and 900.

Constraints:
    1 <= num <= 3999

Time Complexity: O(1)
    The algorithm always iterates through a fixed number of digit-symbol pairs (13 in this case),
    regardless of the input number. Each iteration performs constant-time operations.

Space Complexity: O(1)
    The space used is constant and does not depend on the input size. 
    The `digits` list has a fixed size, and the `roman` string has a maximum length 
    bounded by the largest possible input (3999), which results in at most 15 characters.
"""
class Solution:

    def intToRoman(self, num: int) -> str:
        digits = [
            (1000, "M"),
            (900, "CM"),
            (500, "D"),
            (400, "CD"),
            (100, "C"),
            (90, "XC"),
            (50, "L"),
            (40, "XL"),
            (10, "X"),
            (9, "IX"),
            (5, "V"),
            (4, "IV"),
            (1, "I"),
        ]
        roman = ""  
        for digit, symbol in digits:
            count = 0 
            if num == 0: break 
            count = num // digit
            num -= count * digit
            roman += symbol * count 
        return roman 


def test_int_to_roman():
    solution = Solution()
    
    def run_test(num, expected):
        result = solution.intToRoman(num)
        print(f"Input: {num}, Got: {result}")

    print("Testing single digit numbers:")
    run_test(1, "I")
    run_test(5, "V")
    run_test(9, "IX")

    print("\nTesting double digit numbers:")
    run_test(27, "XXVII")
    run_test(49, "XLIX")
    run_test(99, "XCIX")

    print("\nTesting triple digit numbers:")
    run_test(500, "D")
    run_test(798, "DCCXCVIII")
    run_test(999, "CMXCIX")

    print("\nTesting four digit numbers:")
    run_test(1994, "MCMXCIV")
    run_test(2023, "MMXXIII")
    run_test(3999, "MMMCMXCIX")

    print("\nTesting edge cases:")
    run_test(4, "IV")
    run_test(40, "XL")
    run_test(400, "CD")
    run_test(900, "CM")

    print("\nTesting consecutive symbols:")
    run_test(3000, "MMM")
    run_test(300, "CCC")
    run_test(30, "XXX")
    run_test(3, "III")

if __name__ == '__main__':
    test_int_to_roman()