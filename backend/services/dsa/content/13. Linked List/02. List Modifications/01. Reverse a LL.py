"""
Reverses a singly linked list.

Solution Steps:
    1. Initialize three pointers: prev as None, current as head, and next as None.
    2. Traverse the list:
        - Store the next node.
        - Reverse the current node's pointer.
        - Move prev and current one step forward.
    3. Return prev as the new head of the reversed list.

Time Complexity: O(n), where n is the number of nodes in the linked list.
Space Complexity: O(1), as we only use a constant amount of extra space.

Examples:
1. Input: 1 -> 2 -> 3 -> 4 -> 5 -> NULL
    Output: 5 -> 4 -> 3 -> 2 -> 1 -> NULL

2. Input: 1 -> 2 -> NULL
    Output: 2 -> 1 -> NULL

3. Input: NULL
    Output: NULL

"""

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        """
        Solution Steps:
        1. Initialize three pointers: prev as None, current as head, and next as None.
        2. Traverse the list:
           - Store the next node.
           - Reverse the current node's pointer.
           - Move prev and current one step forward.
        3. Return prev as the new head of the reversed list.

    
        """
        prev = None
        current = head
        
        while current:
            next_temp = current.next  # Store next node
            current.next = prev       # Reverse current node's pointer
            prev = current            # Move prev one step forward
            current = next_temp       # Move current one step forward
        
        return prev  # prev is now the head of the reversed list
    
    def reverseList(self, head: ListNode) -> ListNode:
        """
        Solution Explanation:
            1. Base case: If the list is empty or has only one node, return the head as is.
            2. Recursive case:
            a. Recursively call reverseList on the rest of the list (head.next).
            b. Set the next node's 'next' pointer to the current node.
            c. Set the current node's 'next' pointer to None to avoid cycles.
            3. Return the new head (which will be the last node of the original list).
        """
        # Base case: empty list or single node
        if not head or not head.next:
            return head

        # Recursive case
        new_head = self.reverseList(head.next)
        
        # Reverse the link
        head.next.next = head
        head.next = None

        return new_head

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

    # Example 1: 1 -> 2 -> 3 -> 4 -> 5 -> NULL
    list1 = solution.createLinkedList([1, 2, 3, 4, 5])
    print("Original List 1:")
    solution.printLinkedList(list1)
    reversed_list1 = solution.reverseList(list1)
    print("Reversed List 1:")
    solution.printLinkedList(reversed_list1)

    # Example 2: 1 -> 2 -> NULL
    list2 = solution.createLinkedList([1, 2])
    print("\nOriginal List 2:")
    solution.printLinkedList(list2)
    reversed_list2 = solution.reverseList(list2)
    print("Reversed List 2:")
    solution.printLinkedList(reversed_list2)

    # Example 3: NULL
    list3 = None
    print("\nOriginal List 3:")
    solution.printLinkedList(list3)
    reversed_list3 = solution.reverseList(list3)
    print("Reversed List 3:")
    solution.printLinkedList(reversed_list3)