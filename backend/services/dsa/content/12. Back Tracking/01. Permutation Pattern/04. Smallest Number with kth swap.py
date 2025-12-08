"""
Problem Statement:
    Given a number n and a value k, find the smallest number that can be formed by 
    performing at most k swaps on the digits of n.

Explanation:

Backtracking Approach:
    The backtracking approach tries all possible swaps recursively.
    It starts from the leftmost position and finds the minimum digit from that position to the end.
    If the current digit is not the minimum, it swaps with the rightmost occurrence of the minimum digit.
    This process is repeated for the next position with the remaining swaps.

Recursion Tree for Backtracking (simplified for num = 324 and k = 2):

                   324
                  /   \
               234    324
              /  \    /  \
            234  243 314 324

Note: The actual recursion tree would be much larger for the given example (7654321, k=4).


Time Complexity: O(n! / (n-k)!), where n is the length of the string and k is the number of swaps.
Space Complexity: O(n) for the recursion stack and to store the current and maximum number.

"""


# Corrected Backtracking Solution
class BackTrackingSolution:
    def findSmallestNum(self, num_str, k):
        def swap(num, i, j):
            num[i], num[j] = num[j], num[i]

        def backtrack(num, k, index):
            # Base case: if no more swaps left or reached end of number
            if k == 0 or index == len(num):
                return
            
            # Find the minimum digit from the current index to the end
            min_digit = min(num[index:])
            
            # If current digit is not the min, try swapping
            if num[index] != min_digit:
                for i in range(index + 1, len(num)):
                    if num[i] == min_digit:
                        # Swap the current digit with the min digit
                        swap(num, index, i)
                        self.min_num = min(self.min_num, ''.join(num))
                        backtrack(num, k - 1, index + 1)
                        swap(num, index, i)
                        break
            
            # Move to the next index without making a swap
            backtrack(num, k, index + 1)

        # Convert input string to list for easy manipulation
        num_list = list(num_str)
        # Initialize min_num with the original number
        self.min_num = num_str
        
        # Start the backtracking process
        backtrack(num_list, k, 0)
        return self.min_num

# Time Complexity: O(n^k) in the worst case, where n is the number of digits in num
# Space Complexity: O(n) for the recursion stack and to store the digits as a list

# Example usage and testing
num = "7654321"
k = 4

print(f"Original number: {num}")
print(f"Smallest number after at most {k} swaps (Backtracking): {BackTrackingSolution().findSmallestNum(num, k)}")

