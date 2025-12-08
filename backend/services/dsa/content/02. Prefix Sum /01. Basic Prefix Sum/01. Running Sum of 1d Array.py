


class Solution(object):
    def runningSum(self, nums):
        """
        :type nums: List[int]
        :rtype: List[int]
        """
        prev_sum = 0
        result=[] 
        for i in nums:
            prev_sum += i 
            result.append(prev_sum)
        return result 