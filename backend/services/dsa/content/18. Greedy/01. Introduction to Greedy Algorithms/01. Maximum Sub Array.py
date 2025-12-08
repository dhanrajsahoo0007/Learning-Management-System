# Input: nums = [2,-3,4,-2,2,1,-1,4]

# Output: 8

def maxSubArray(nums) -> int:
        res = nums[0]

        total = 0
        for n in nums:
            total += n
            res = max(res, total)
            if total < 0:
                total = 0
        return res
    
    

nums = [2,-3,4,-2,2,1,-1,4]

print(maxSubArray(nums))