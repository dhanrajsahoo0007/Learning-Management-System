"""
Problem Statement:
    Given the head of a singly linked list, return the middle node of the linked list.
    If there are two middle nodes, return the second middle node.

Solution Steps:
    1. Use two pointers: slow and fast.
    2. Move slow one step at a time and fast two steps at a time.
    3. When fast reaches the end or goes beyond, slow will be at the middle.

Time Complexity: O(n), where n is the number of nodes in the linked list.
Space Complexity: O(1), as we only use a constant amount of extra space.

Examples:
1. Input: 1 -> 2 -> 3 -> 4 -> 5
    Output: 3 -> 4 -> 5 (Node with value 3)
2. Input: 1 -> 2 -> 3 -> 4 -> 5 -> 6
    Output: 4 -> 5 -> 6 (Node with value 4)
3. Input: 1
    Output: 1 (Node with value 1)
"""


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def middleNode(self, head: ListNode) -> ListNode:

        if not head or not head.next:
            return head

        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

        return slow

    def createLinkedList(self, nums):
        """Helper function to create a linked list from a list of numbers."""
        dummy = ListNode(0)
        current = dummy
        for num in nums:
            current.next = ListNode(num)
            current = current.next
        return dummy.next

    def printLinkedList(self, head):
        """Helper function to print a linked list."""
        current = head
        while current:
            print(current.val, end=" -> ")
            current = current.next
        print("None")

# Example usage
if __name__ == "__main__":
    solution = Solution()

    # Example 1: Odd number of nodes
    list1 = solution.createLinkedList([1, 2, 3, 4, 5])
    print("List 1:")
    solution.printLinkedList(list1)
    middle1 = solution.middleNode(list1)
    print("Middle of List 1:")
    solution.printLinkedList(middle1)

    # Example 2: Even number of nodes
    list2 = solution.createLinkedList([1, 2, 3, 4, 5, 6])
    print("\nList 2:")
    solution.printLinkedList(list2)
    middle2 = solution.middleNode(list2)
    print("Middle of List 2:")
    solution.printLinkedList(middle2)

    # Example 3: Single node
    list3 = solution.createLinkedList([1])
    print("\nList 3:")
    solution.printLinkedList(list3)
    middle3 = solution.middleNode(list3)
    print("Middle of List 3:")
    solution.printLinkedList(middle3)
