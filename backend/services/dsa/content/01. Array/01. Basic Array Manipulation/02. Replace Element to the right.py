

"""
Problem statement:
    Replace Elements with Greatest Element on Right Side
Example 1:

Input: arr = [17,18,5,4,6,1]
Output: [18,6,6,6,1,-1]

"""
from typing import List
class Solution:
    def replaceElements(self, arr: List[int]) -> List[int]:
        n = len(arr)
        max_right = -1
        
        # Iterate through the array from right to left
        for i in range(n - 1, -1, -1):
            current = arr[i]  # Store the current element
            arr[i] = max_right  # Replace current element with max_right
            max_right = max(max_right, current)  # Update max_right
        
        return arr