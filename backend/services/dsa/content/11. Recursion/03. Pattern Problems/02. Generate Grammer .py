# Problem Statement:
    # We construct a table of n rows (1-indexed). We start by writing 0 in the 1st row. Now in every subsequent row,
    #  we look at the previous row and replace each occurrence of 0 with 01, and each occurrence of 1 with 10.
# For example:
    # Row 1: 0
    # Row 2: 01
    # Row 3: 0110
    # Row 4: 01101001


# Solution 

#    step-1:  We introduce mid = (1 << (n - 2)). This calculates 2^(n-2), which is half the length of the current row. We use bitwise left shift for efficiency.
#    step-2:  We then check if k <= mid:

#    step-3: If true, k is in the first half of the row. In this case, the symbol is the same as the kth symbol in the previous row.
#            If false, k is in the second half of the row. In this case, the symbol is the complement of the (k - mid)th symbol in the previous row.


#    step-4: For the second case, we return 1 - self.kthGrammar(n - 1, k - mid). This flips the bit (0 becomes 1, 1 becomes 0) of the corresponding symbol in the previous row.

# Time Complexity: O(n), as we make at most n recursive calls.
# Space Complexity: O(n) due to the recursion stack.

class Solution:
    def kthGrammar(self, n: int, k: int) -> int:
        if n == 1:
            return 0
        
        mid = (1 << (n - 2))  # Equivalent to 2^(n-2) ->  2**(n-2)
        
        if k <= mid:
            return self.kthGrammar(n - 1, k)
        else:
            # compliment of the input 
            return 1 - self.kthGrammar(n - 1, k - mid)
    
    
    def printGrammar(self, n: int):
        def generate_row(prev_row):
            return ''.join('01' if c == '0' else '10' for c in prev_row)
        
        row = '0'
        print(f"Row 1: {row}")
        
        for i in range(2, n + 1):
            row = generate_row(row)
            print(f"Row {i}: {row}")

# Example usage
sol = Solution()
n = 4
k = 3

print(f"Grammar up to row {n}:")
sol.printGrammar(n)

result = sol.kthGrammar(n, k)
print(f"\nThe {k}th symbol in row {n} is: {result}")