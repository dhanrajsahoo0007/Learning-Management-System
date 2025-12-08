class NumArray:

    def __init__(self, nums: list[int]):
        self.prefix_sum = [0]  # Start with 0 to handle sumRange starting from index 0
        prev_sum=0
        for num in nums:
            prev_sum +=num  
            self.prefix_sum.append(prev_sum)

    def sumRange(self, left: int, right: int) -> int:
        return self.prefix_sum[right+1] - self.prefix_sum[left]