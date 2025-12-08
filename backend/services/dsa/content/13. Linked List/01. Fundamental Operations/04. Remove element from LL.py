"""
Problem Statement:
    Given the head of a linked list and an integer val, remove all the nodes of the linked list
    that have Node.val == val, and return the new head.

Time Complexity: O(n), where n is the number of nodes in the linked list.
Space Complexity: O(1)

Examples:
    1. Input: head = [1,2,6,3,4,5,6], val = 6
        Output: [1,2,3,4,5]
    2. Input: head = [], val = 1
        Output: []
    3. Input: head = [7,7,7,7], val = 7
        Output: []
"""


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def removeElements(self, head: ListNode, val: int) -> ListNode:
        """
        Solution Explanation:
            1. Create a dummy node to handle the case where the head needs to be removed.
            2. Traverse the list, skipping nodes with the given value.
            3. Return the next node of the dummy node as the new head.
        """
        # Create a dummy node
        dummy = ListNode(0)
        dummy.next = head
        current = dummy

        while current.next:
            if current.next.val == val:
                # Skip the node with the given value
                current.next = current.next.next
            else:
                current = current.next

        return dummy.next

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

    # Example 1: Remove 6 from [1,2,6,3,4,5,6]
    list1 = solution.createLinkedList([1,2,6,3,4,5,6])
    print("Original List 1:")
    solution.printLinkedList(list1)
    result1 = solution.removeElements(list1, 6)
    print("After removing 6:")
    solution.printLinkedList(result1)

    # Example 2: Remove 1 from an empty list
    list2 = solution.createLinkedList([])
    print("\nOriginal List 2 (empty):")
    solution.printLinkedList(list2)
    result2 = solution.removeElements(list2, 1)
    print("After removing 1:")
    solution.printLinkedList(result2)

    # Example 3: Remove 7 from [7,7,7,7]
    list3 = solution.createLinkedList([7,7,7,7])
    print("\nOriginal List 3:")
    solution.printLinkedList(list3)
    result3 = solution.removeElements(list3, 7)
    print("After removing 7:")
    solution.printLinkedList(result3)