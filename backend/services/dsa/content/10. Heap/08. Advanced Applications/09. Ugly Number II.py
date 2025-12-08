"""
1201. Ugly Number III
Solved
Medium
Topics
Companies
Hint
An ugly number is a positive integer that is divisible by a, b, or c.

Given four integers n, a, b, and c, return the nth ugly number.

 

Example 1:

Input: n = 3, a = 2, b = 3, c = 5
Output: 4
Explanation: The ugly numbers are 2, 3, 4, 5, 6, 8, 9, 10... The 3rd is 4.
Example 2:

Input: n = 4, a = 2, b = 3, c = 4
Output: 6
Explanation: The ugly numbers are 2, 3, 4, 6, 8, 9, 10, 12... The 4th is 6.
Example 3:

Input: n = 5, a = 2, b = 11, c = 13
Output: 10
Explanation: The ugly numbers are 2, 4, 6, 8, 10, 11, 12, 13... The 5th is 10.
 

Constraints:

1 <= n, a, b, c <= 109
1 <= a * b * c <= 1018
It is guaranteed that the result will be in range [1, 2 * 109].
Seen this question in a real interview before?
1/5
"""



class Solution:
    def nthUglyNumber(self, n: int, a: int, b: int, c: int) -> int:
        # Linear approach too slow, N
        # ugly_number = 0
        # ia = ib = ic = 1
        # counter = 0 
        # while counter < n:
        #     counter += 1
        #     num_a = ia*a
        #     num_b = ib*b
        #     num_c = ic*c

        #     next_num = min(num_a, num_b, num_c)
        #     ugly_number = next_num

        #     if next_num == num_a:
        #         ia += 1
        #     if next_num == num_b:
        #         ib += 1
        #     if next_num == num_c:
        #         ic += 1
        # return ugly_number
        """
        Using the inclusion and exclusion principle
        [A U B U C] = [A] + [B] + [C] - [A n B] - [A n C] - [B n C] + [A U B U C]
        [A] number of elements that are divisible by A
        [B] number of elements that are divisible by B
        [C] number of elements that are divisible by C
        """
        from math import gcd

        def lcm(a, b):
            return (a * b) // gcd(a, b)

        def count_divisible_numbers(x, a, b, c):
            lcm_ab = lcm(a, b)
            lcm_ac = lcm(a, c)
            lcm_bc = lcm(b, c)
            lcm_abc = lcm(lcm_ab, c)
            return (x // a) + (x // b) + (x // c) - (x // lcm_ab) - (x // lcm_ac) - (x // lcm_bc) + (x // lcm_abc)
        def get_next_ugly_number( n, a, b, c):
            left = 1
            right = n*min(a,b,c)
            while left < right:
                mid = (left + right)//2

                if count_divisible_numbers(mid, a, b, c) < n:
                    left = mid + 1
                else:
                    right = mid 
            return left
        # def count_divisible_numbers(x, a, b, c ):
        #     return (x // a) + (x // b) + (x // c) - (x//(a*b)) - (x//(a*c)) - (x//b*c) + (x//(a*b*c))
        nth_ugly = get_next_ugly_number(n, a,b, c)
        return nth_ugly