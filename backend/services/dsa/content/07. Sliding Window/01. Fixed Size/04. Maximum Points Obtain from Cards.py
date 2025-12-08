"""
1423. Maximum Points You Can Obtain from Cards

There are several cards arranged in a row, and each card has an associated number of points. The points are given in the integer array cardPoints.
In one step, you can take one card from the beginning or from the end of the row. You have to take exactly k cards.
Your score is the sum of the points of the cards you have taken.
Given the integer array cardPoints and the integer k, return the maximum score you can obtain.

Example 1:

Input: cardPoints = [1,2,3,4,5,6,1], k = 3
Output: 12
Explanation: After the first step, your score will always be 1. However, choosing the rightmost card first will maximize your total score. The optimal strategy is to take the three cards on the right, giving a final score of 1 + 6 + 5 = 12.
Example 2:

Input: cardPoints = [2,2,2], k = 2
Output: 4
Explanation: Regardless of which two cards you take, your score will always be 4.
Example 3:

Input: cardPoints = [9,7,7,9,7,7,9], k = 7
Output: 55
Explanation: You have to take all the cards. Your score is the sum of points of all cards.
 
Constraints:

1 <= cardPoints.length <= 105
1 <= cardPoints[i] <= 104
1 <= k <= cardPoints.length
"""
class Solution(object):
    def maxScore(self, cardPoints, k):
        """
        :type cardPoints: List[int]
        :type k: int
        :rtype: int
        """
        # if lenght of the array is quual to k 
        if (len(cardPoints) == k ): sum(cardPoints) 

        l_sum = 0 
        r_sum =0 
        max_sum = 0 

        # inital left sum 
        for i in range(k):
            l_sum = l_sum + cardPoints[i]

        max_sum = l_sum 

        r_pointer = len(cardPoints)-1

        for i in range(k-1 , -1 ,-1):
            l_sum = l_sum - cardPoints[i]
            r_sum = r_sum + cardPoints[r_pointer]
            r_pointer = r_pointer -1 
            max_sum = max(max_sum,l_sum+ r_sum)   

        return max_sum      

    def maxScore_cleaner_version(cardPoints, k):
        """
        Cleaner version of the same algorithm
        """
        n = len(cardPoints)
        
        if k == n:
            return sum(cardPoints)
        
        # Start with all k cards from left
        current_sum = sum(cardPoints[:k])
        max_sum = current_sum
        
        # Try removing cards from left and adding from right
        for i in range(k):
            # Remove the (k-1-i)th card from left
            current_sum -= cardPoints[k - 1 - i]
            # Add the (n-1-i)th card from right  
            current_sum += cardPoints[n - 1 - i]
            # Update maximum
            max_sum = max(max_sum, current_sum)
        
        return max_sum

sol = Solution()

# Example 1
print(sol.maxScore([1,2,3,4,5,6,1], 3))  # Expected 12
# Example 3
print(sol.maxScore([9,7,7,9,7,7,9], 7))  # Expected 55
