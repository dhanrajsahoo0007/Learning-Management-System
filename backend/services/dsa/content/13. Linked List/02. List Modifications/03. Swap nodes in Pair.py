"""
Swap Nodes in Pairs

Problem Statement:
Given a linked list, swap every two adjacent nodes and return its head. 
You must solve the problem without modifying the values in the list's nodes 
(i.e., only nodes themselves may be changed.)

Example 1:
Input: head = [1,2,3,4]
Output: [2,1,4,3]

Example 2:
Input: head = []
Output: []

Example 3:
Input: head = [1]
Output: [1]

Explanation:
    1. We start by creating a dummy node and setting its next to the head. This helps us handle the case of swapping the first two nodes easily.
    2. We use two pointers:
        prev: Points to the node before the pair to be swapped
        curr: Points to the first node of the pair

    3. In each iteration of the while loop:
        We save pointers to the next pair (nxtPair) and the second node of the current pair (second).
        We perform the swap:
            second.next is set to curr
            curr.next is set to nxtPair
            prev.next is set to second
        We update our pointers:
            prev becomes curr (which is now the second node in the swapped pair)
            curr becomes nxtPair (the start of the next pair)

    4. After the loop ends, we return dummy.next, which is the new head of the swapped list.
    
Time Complexity: O(n), where n is the number of nodes in the linked list.
Space Complexity: O(1), as we only use a constant amount of extra space.
"""

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def swapPairs(self, head: ListNode) -> ListNode:
        dummy = ListNode(0, head)
        prev, curr = dummy, head

        while curr and curr.next:
            # save ptrs
            nxtPair = curr.next.next
            second = curr.next

            # reverse this pair
            second.next = curr
            curr.next = nxtPair
            prev.next = second

            # update ptrs
            prev = curr
            curr = nxtPair

        return dummy.next

# Example usage:
def create_linked_list(values):
    dummy = ListNode(0)
    current = dummy
    for val in values:
        current.next = ListNode(val)
        current = current.next
    return dummy.next

def print_linked_list(head):
    values = []
    while head:
        values.append(str(head.val))
        head = head.next
    print(" -> ".join(values))

# Test the solution
solution = Solution()

# Example 1
head1 = create_linked_list([1, 2, 3, 4])
print("Input:")
print_linked_list(head1)
result1 = solution.swapPairs(head1)
print("Output:")
print_linked_list(result1)

# Example 2
head2 = create_linked_list([])
print("\nInput:")
print_linked_list(head2)
result2 = solution.swapPairs(head2)
print("Output:")
print_linked_list(result2)

# Example 3
head3 = create_linked_list([1])
print("\nInput:")
print_linked_list(head3)
result3 = solution.swapPairs(head3)
print("Output:")
print_linked_list(result3)