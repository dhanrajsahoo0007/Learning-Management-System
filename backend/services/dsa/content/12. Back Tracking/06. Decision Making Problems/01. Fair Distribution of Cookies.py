"""
Problem Statement:
    You are given an integer array cookies, where cookies[i] denotes the number of cookies in the ith bag. 
    You are also given an integer k that denotes the number of children to distribute the cookies to. 
    All the cookies in the same bag must go to the same child and cannot be split up.

    The unfairness of a distribution is defined as the maximum total cookies obtained by a single child in the distribution.

    Your goal is to distribute the cookies to the k children such that the unfairness of the distribution is minimized.

Time Complexity: O(k^n), where k is the number of children and n is the number of cookie bags.
    In the worst case, we try all possible distributions of cookies to children.

Space Complexity: O(n + k), where n is the depth of the recursion (number of cookie bags) 
    and k is the space needed for the children list.

Explanation:
This solution uses a backtracking approach to try all possible distributions of cookies to children:
    1. We use a recursive function 'solve' to distribute cookies one by one.
    2. For each cookie, we try giving it to each child and recursively solve for the next cookie.
    3. We keep track of the cookies each child has in the 'children' list.
    4. After distributing all cookies, we calculate the maximum cookies any child has and update our result if it's smaller.
    5. We use backtracking to undo each distribution and try other possibilities.


1. Input: cookies = [8,15,10,20,8], k = 2
   Output: 31
   Explanation: One optimal distribution is [8,15,8] and [10,20].
    - The 1st child receives [8,15,8] which sums to 31 cookies.
    - The 2nd child receives [10,20] which sums to 30 cookies.
   The unfairness is max(31,30) = 31.

2. Input: cookies = [6,1,3,2,2,4,1,2], k = 3
   Output: 7
   Explanation: One optimal distribution is [6,1], [3,2,2], and [4,1,2].
    - The 1st child receives [6,1] which sums to 7 cookies.
    - The 2nd child receives [3,2,2] which sums to 7 cookies.
    - The 3rd child receives [4,1,2] which sums to 7 cookies.
   The unfairness is max(7,7,7) = 7.


"""

from typing import List

class Solution:
    def distributeCookies(self, cookies: List[int], k: int) -> int:
        n = len(cookies)
        children = [0] * k  # Initialize each child with 0 cookies
        self.result = float('inf')  # Store the minimum unfairness

        def solve(idx: int):
            # Base case: all cookies distributed
            if idx == n:
                # Calculate the maximum cookies any child has
                ans = max(children)
                # Update the result if this distribution is fairer
                self.result = min(self.result, ans)
                return

            # If there are more empty children than remaining cookies, 
            # we must give a cookie to an empty child
            if children.count(0) > n - idx:
                return
            
            candy = cookies[idx]  # Current cookie bag
            # Try giving this bag to each child
            for i in range(k):
                children[i] += candy  # Give cookie to child i
                
                # Recursively distribute next cookie
                solve(idx + 1)
                
                children[i] -= candy  # Backtrack: take cookie back from child i

        solve(0)
        return int(self.result)  # Convert result to int before returning


# Example usage
if __name__ == "__main__":
    sol = Solution()
    cookies = [8, 15, 10, 20, 8]
    k = 2
    min_unfairness = sol.distributeCookies(cookies, k)
    print(f"Minimum unfairness: {min_unfairness}")

