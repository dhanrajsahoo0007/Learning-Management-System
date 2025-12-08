"""
Problem Statement:
   Given an array representing a queue of customers and the value of bills they hold, 
   determine if it is possible to provide correct change to each customer. 
   Customers can only pay with 5$, 10$ or 20$ bills and we initially do not have any change at hand. 
   Return true if it is possible to provide correct change for each customer, otherwise return false.

Examples:
   Example 1:
   Input: bills = [5, 5, 5, 10, 20]
   Output: True
   Explanation: 
        Initially we have 0 change and the queue of customers is [5, 5, 5, 10, 20].
        First Customer pays 5$, no change required.
        Second Customer pays 5$, no change required.
        Third Customer pays 5$, no change required.
        The Fourth Customer pays 10$, out of the three 5$ bills we have, we pay a 5$ bill and accept the 10$ bill.
        Fifth Customer pays 20$, out of the two 5$ bills and one 10$ bill we have, we pay 15$ in change and have one 5$ bill left.
        Hence, it is possible to provide change to all customers.

   Example 2:
   Input: bills = [5, 5, 10, 10, 20]
   Output: False
   Explanation:
        Initially, we have 0 change and the queue of customers is [5,5,10,10,20].
        The first customer pays 5$, no change required.
        The second customer pays 5$, no change required.
        The third customer pays 10$, we collect a 5$ bill and give back a 5$ bill.
        The fourth customer pays 10$, we collect a 5$ bill and give back a 5$ bill.
        The fifth customer pays 20$, we cannot give the change of $15 back because we only have two $10 bills.
        Since not every customer received the correct change, the answer is false.

Explanation:
   1. Initialize counters for 5$ and 10$ bills.
   2. Iterate through the bills:
      - If it's a 5$ bill, increment the 5$ counter.
      - If it's a 10$ bill, check if we have a 5$ bill to give as change. If yes, decrement 5$ counter and increment 10$ counter.
      - If it's a 20$ bill, check if we have either one 10$ and one 5$ bill, or three 5$ bills to give as change.
   3. If at any point we can't provide change, return False.
   4. If we successfully process all bills, return True.

Time Complexity: O(n), where n is the number of bills.
We iterate through the bills array once.

Space Complexity: O(1)
We only use two counters regardless of the input size.
"""
from typing import List
class Solution:
   def lemonadeChange(self, bills: List[int]) -> bool:
       five = ten = 0
       
       for bill in bills:
           if bill == 5:
               five += 1
           elif bill == 10:
               if not five:
                   return False
               five -= 1
               ten += 1
           else:  # bill == 20
               if ten and five:
                   ten -= 1
                   five -= 1
               elif five >= 3:
                   five -= 3
               else:
                   return False
       
       return True

# Test the solution
if __name__ == "__main__":
   solution = Solution()
   
   # Test case 1
   bills1 = [5, 5, 5, 10, 20]
   print(f"Input: {bills1}")
   print(f"Output: {solution.lemonadeChange(bills1)}")
   
   # Test case 2
   bills2 = [5, 5, 10, 10, 20]
   print(f"Input: {bills2}")
   print(f"Output: {solution.lemonadeChange(bills2)}")