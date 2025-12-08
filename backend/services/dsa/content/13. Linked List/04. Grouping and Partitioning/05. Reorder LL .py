"""
Problem Statement:
    You are given the head of a singly linked-list. The list can be represented as:
    L0 → L1 → … → Ln - 1 → Ln

    Reorder the list to be on the following form:
    L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …

You may not modify the values in the list's nodes. Only nodes themselves may be changed.


Time Complexity: O(n), where n is the number of nodes in the list.
- We traverse the list once to find the middle.
- We reverse the second half of the list, which takes O(n/2).
- We merge the two halves, which takes O(n/2).
Overall, these operations sum up to O(n).

Space Complexity: O(1)
- We only use a constant amount of extra space for pointers.
- The reordering is done in-place, without using any extra data structures that grow with input size.
"""

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reorderList(self, head: ListNode) -> None:
        """
        Do not return anything, modify head in-place instead.
        Explanation:
            The solution follows three main steps:
            1. Find the middle of the list using slow and fast pointers.
            2. Reverse the second half of the list.
            3. Merge the first half with the reversed second half.

        """
        if not head or not head.next:
            return
        
        # Step 1: Find the middle of the list
        slow = fast = head
        while fast.next and fast.next.next:
            slow = slow.next
            fast = fast.next.next
        
        # Step 2: Reverse the second half of the list
        second = slow.next
        slow.next = None
        prev = None
        while second:
            temp = second.next
            second.next = prev
            prev = second
            second = temp
        
        # Step 3: Merge the first half with the reversed second half
        first, second = head, prev
        while second:
            temp1, temp2 = first.next, second.next
            first.next = second
            second.next = temp1
            first, second = temp1, temp2

# Helper function to print the list
def printList(head):
    current = head
    while current:
        print(current.val, end=" -> ")
        current = current.next
    print("None")

# Test cases
# Example 1: [1,2,3,4] -> [1,4,2,3]
head1 = ListNode(1)
head1.next = ListNode(2)
head1.next.next = ListNode(3)
head1.next.next.next = ListNode(4)

print("Example 1:")
print("Before reordering:")
printList(head1)
Solution().reorderList(head1)
print("After reordering:")
printList(head1)

# Example 2: [1,2,3,4,5] -> [1,5,2,4,3]
head2 = ListNode(1)
head2.next = ListNode(2)
head2.next.next = ListNode(3)
head2.next.next.next = ListNode(4)
head2.next.next.next.next = ListNode(5)

print("\nExample 2:")
print("Before reordering:")
printList(head2)
Solution().reorderList(head2)
print("After reordering:")
printList(head2)

"""
Output:
Example 1:
Before reordering:
1 -> 2 -> 3 -> 4 -> None
After reordering:
1 -> 4 -> 2 -> 3 -> None

Example 2:
Before reordering:
1 -> 2 -> 3 -> 4 -> 5 -> None
After reordering:
1 -> 5 -> 2 -> 4 -> 3 -> None
"""