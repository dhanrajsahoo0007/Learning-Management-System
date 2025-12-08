"""
Problem Statement:
    Given the head of a linked list with even length, return the maximum twin sum of the linked list.
    The twin sum is defined as the sum of a node and its twin.
    In a linked list of size n, where n is even, the ith node (0-indexed) of the linked list is known as the twin of the (n-1-i)th node, if 0 <= i <= (n / 2) - 1.

Example:
    if n = 4, then node 0 is the twin of node 3, and node 1 is the twin of node 2. These are the only nodes with twins for n = 4.


Explanation:
    The solution follows these steps:
    1. Find the middle of the linked list using slow and fast pointers.
    2. Reverse the second half of the list.
    3. Traverse both halves simultaneously, calculating twin sums and keeping track of the maximum.

Time Complexity: O(n), where n is the number of nodes in the list.
    - Finding the middle: O(n/2)
    - Reversing the second half: O(n/2)
    - Calculating max twin sum: O(n/2)
    Overall, these operations sum up to O(n).

Space Complexity: O(1)
    - We only use a constant amount of extra space for pointers and variables.
    - The reversal is done in-place, without using any extra data structures that grow with input size.
"""

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def findMaxTwinSum(self, head: ListNode) -> int:
        # Step 1: Find the middle of the list
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        
        # Step 2: Reverse the second half of the list
        prev = None
        curr = slow
        while curr:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        
        # Step 3: Calculate max twin sum
        max_twin_sum = 0
        first_half = head
        second_half = prev
        while second_half:
            twin_sum = first_half.val + second_half.val
            max_twin_sum = max(max_twin_sum, twin_sum)
            first_half = first_half.next
            second_half = second_half.next
        
        return max_twin_sum

# Helper function to create a linked list from a list of values
def create_linked_list(values):
    dummy = ListNode(0)
    current = dummy
    for val in values:
        current.next = ListNode(val)
        current = current.next
    return dummy.next

# Test cases
def test_max_twin_sum():
    # Test case 1: [5,4,2,1]
    head1 = create_linked_list([5,4,2,1])
    solution = Solution()
    result1 = solution.findMaxTwinSum(head1)
    print(f"Test case 1 result: {result1}")  # Expected output: 6

    # Test case 2: [4,2,2,3]
    head2 = create_linked_list([4,2,2,3])
    result2 = solution.findMaxTwinSum(head2)
    print(f"Test case 2 result: {result2}")  # Expected output: 7

    # Test case 3: [1,100000]
    head3 = create_linked_list([1,100000])
    result3 = solution.findMaxTwinSum(head3)
    print(f"Test case 3 result: {result3}")  # Expected output: 100001

# Run the test cases
test_max_twin_sum()

"""
Output:
Test case 1 result: 6
Test case 2 result: 7
Test case 3 result: 100001
"""