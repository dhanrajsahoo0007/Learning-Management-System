"""
Remove all duplicates from a sorted linked list.

Problem Statement:
    Given the head of a sorted linked list, delete all duplicates such that each element appears only once.
    Return the linked list sorted as well.

Solution Explanation:
    1. If the list is empty or has only one node, return the head as is.
    2. Use two pointers: 'current' to traverse the list and 'runner' to find the next distinct element.
    3. When a distinct element is found, update the 'next' pointer of 'current' to skip duplicates.
    4. Move 'current' to the next distinct element and repeat until the end of the list.

Time Complexity: O(n), where n is the number of nodes in the linked list.
Space Complexity: O(1)

Examples:
1. Input: head = [1,1,2]
    Output: [1,2]
2. Input: head = [1,1,2,3,3]
    Output: [1,2,3]
"""


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def deleteDuplicates(self, head: ListNode) -> ListNode:
        """
        Solution Explanation:
        1. If the list is empty or has only one node, return the head as is.
        2. Use two pointers: 'current' to traverse the list and 'runner' to find the next distinct element.
        3. When a distinct element is found, update the 'next' pointer of 'current' to skip duplicates.
        4. Move 'current' to the next distinct element and repeat until the end of the list.
        """
        if not head or not head.next:
            return head

        current = head
        while current and current.next:
            if current.val == current.next.val:
                # Skip the duplicate
                current.next = current.next.next
            else:
                # Move to the next distinct element
                current = current.next

        return head

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

    # Example 1: [1,1,2]
    list1 = solution.createLinkedList([1,1,2])
    print("Original List 1:")
    solution.printLinkedList(list1)
    result1 = solution.deleteDuplicates(list1)
    print("After removing duplicates:")
    solution.printLinkedList(result1)

    # Example 2: [1,1,2,3,3]
    list2 = solution.createLinkedList([1,1,2,3,3])
    print("\nOriginal List 2:")
    solution.printLinkedList(list2)
    result2 = solution.deleteDuplicates(list2)
    print("After removing duplicates:")
    solution.printLinkedList(result2)

    # Example 3: [1,1,1]
    list3 = solution.createLinkedList([1,1,1])
    print("\nOriginal List 3:")
    solution.printLinkedList(list3)
    result3 = solution.deleteDuplicates(list3)
    print("After removing duplicates:")
    solution.printLinkedList(result3)