

"""
Book Allocation Problem
# similar to Capacity to ship package 

Problem Statement:
    Given an array 'arr' of integer numbers, 'arr[i]' represents the number of pages in the 'i-th' book.
    There are 'm' number of students, and the task is to allocate all the books to the students.
    Allocate books in such a way that:
        1. Each student gets at least one book.
        2. Each book should be allocated to only one student.
        3. Book allocation should be in a contiguous manner.
            You have to allocate the book to 'm' students such that the maximum number of pages assigned to a student is minimum.
        If the allocation of books is not possible, return -1.

Examples:
    Example 1:
        Input: n = 4, m = 2, arr = [12, 34, 67, 90]
        Output: 113
        Explanation: Allocation can be done in following ways:
                    {12} and {34, 67, 90} Maximum pages = 191
                    {12, 34} and {67, 90} Maximum pages = 157
                    {12, 34, 67} and {90}  Maximum pages = 113
                    Therefore, the minimum of these cases is 113, which is selected as the output.

    Example 2:
    Input: n = 5, m = 4, arr = [25, 46, 28, 49, 24]
    Output: 71
    Explanation: Allocation can be done in following ways:
                {25} {46} {28} {49, 24} Maximum pages = 73
                {25} {46} {28, 49} {24} Maximum pages = 77
                {25} {46, 28} {49} {24} Maximum pages = 74
                {25, 46} {28} {49} {24} Maximum pages = 71
                Therefore, the minimum of these cases is 71, which is selected as the output.

Constraints:
    * 2 <= n <= 10^3
    * 1 <= m <= 10^3
    * 1 <= arr[i] <= 10^9
    * Sum of all arr[i] does not exceed 10^9

Solution Explanation:
    The solution uses a binary search approach to find the minimum maximum number of pages:

    1. We define a helper function 'is_valid_allocation' that checks if it's possible to allocate books to 'm' students with a given maximum page limit.
    2. In the main function 'findPages', we perform a binary search on the possible range of maximum pages:
       - The minimum possible value is the maximum number of pages in a single book.
       - The maximum possible value is the sum of pages of all books.
    3. We keep narrowing down our search range until we find the minimum valid allocation.

Time Complexity: O(n * log(s)), where n is the number of books and s is the sum of all pages.
    - The binary search takes O(log(s)) iterations.
    - In each iteration, we call the 'is_valid_allocation' function which takes O(n) time.

Space Complexity: O(1), as we only use a constant amount of extra space.
"""

from typing import List

class Solution:
    def is_valid_allocation(self, arr: List[int], n: int, m: int, max_pages: int) -> bool:
        students = 1
        pages = 0
        for book in arr:
            if book > max_pages:
                return False
            if pages + book > max_pages:
                students += 1
                pages = book
            else:
                pages += book
            if students > m:
                return False
        return True

    def findPages(self, arr: List[int], n: int, m: int) -> int:
        if m > n:
            return -1

        low = max(arr)
        high = sum(arr)

        result = -1
        while low <= high:
            mid = (low + high) // 2
            if self.is_valid_allocation(arr, n, m, mid):
                result = mid
                high = mid - 1
            else:
                low = mid + 1

        return result



# Example usage
if __name__ == "__main__":
    solution = Solution()

    # Example 1
    arr1 = [12, 34, 67, 90]
    n1, m1 = 4, 2
    result1 = solution.findPages(arr1, n1, m1)
    print(f"Example 1 - Input: arr = {arr1}, n = {n1}, m = {m1}")
    print(f"Output: {result1}")
    print()

    # Example 2
    arr2 = [25, 46, 28, 49, 24]
    n2, m2 = 5, 4
    result2 = solution.findPages(arr2, n2, m2)
    print(f"Example 2 - Input: arr = {arr2}, n = {n2}, m = {m2}")
    print(f"Output: {result2}")