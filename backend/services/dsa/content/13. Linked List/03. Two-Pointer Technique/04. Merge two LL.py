"""
Merges two sorted linked lists recursively and returns it as a new sorted list.

Problem Statement:
    You are given the heads of two sorted linked lists list1 and list2.
    Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.
    Return the head of the merged linked list.

Time Complexity: O(n + m), where n and m are the lengths of l1 and l2 respectively.
Space Complexity: O(n + m) due to the recursive call stack.

Examples:
1. Input: l1 = [1,2,4], l2 = [1,3,4]
    Output: [1,1,2,3,4,4]
2. Input: l1 = [], l2 = []
    Output: []
3. Input: l1 = [], l2 = [0]
    Output: [0]
"""


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
        """
       Solution Steps:
            1. Create a dummy node to serve as the head of the merged list.
            2. Initialize a current pointer to the dummy node.
            3. While both lists have nodes:
            - Compare the values of the current nodes of both lists.
            - Append the node with the smaller value to the merged list.
            - Move the pointer of the list that contributed the node.
            4. If any list still has nodes, append all remaining nodes to the merged list.
            5. Return the next of the dummy node (the actual head of the merged list).
        """
        # Create a dummy node to simplify the merging process
        dummy = ListNode(0)
        current = dummy
        
        while l1 and l2:
            if l1.val <= l2.val:
                current.next = l1
                l1 = l1.next
            else:
                current.next = l2
                l2 = l2.next
            current = current.next
        
        # If any list is not empty, append its remaining nodes
        if l1:
            current.next = l1
        if l2:
            current.next = l2
        
        return dummy.next

    def mergeTwoListsRecursive(self, l1: ListNode, l2: ListNode) -> ListNode:
        """
        Solution Steps:
            1. If l1 is None, return l2 (base case).
            2. If l2 is None, return l1 (base case).
            3. If l1's value is less than or equal to l2's value:
            - Set l1's next to the result of merging l1's next with l2.
            - Return l1.
            4. Otherwise:
            - Set l2's next to the result of merging l1 with l2's next.
            - Return l2.
        """
        if not l1:
            return l2
        if not l2:
            return l1
        
        if l1.val <= l2.val:
            l1.next = self.mergeTwoListsRecursive(l1.next, l2)
            return l1
        else:
            l2.next = self.mergeTwoListsRecursive(l1, l2.next)
            return l2

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

    # Example 1: l1 = [1,2,4], l2 = [1,3,4]
    l1 = solution.createLinkedList([1, 2, 4])
    l2 = solution.createLinkedList([1, 3, 4])
    print("List 1:")
    solution.printLinkedList(l1)
    print("List 2:")
    solution.printLinkedList(l2)
    
    print("Merged List (Iterative):")
    merged_iterative = solution.mergeTwoLists(l1, l2)
    solution.printLinkedList(merged_iterative)
    
    # Recreate the lists as the previous merge modified them
    l1 = solution.createLinkedList([1, 2, 4])
    l2 = solution.createLinkedList([1, 3, 4])
    print("Merged List (Recursive):")
    merged_recursive = solution.mergeTwoListsRecursive(l1, l2)
    solution.printLinkedList(merged_recursive)

    # Example 2: l1 = [], l2 = []
    print("\nExample 2:")
    l1 = solution.createLinkedList([])
    l2 = solution.createLinkedList([])
    merged_recursive = solution.mergeTwoListsRecursive(l1, l2)
    print("Merged List (Recursive):")
    solution.printLinkedList(merged_recursive)

    # Example 3: l1 = [], l2 = [0]
    print("\nExample 3:")
    l1 = solution.createLinkedList([])
    l2 = solution.createLinkedList([0])
    merged_recursive = solution.mergeTwoListsRecursive(l1, l2)
    print("Merged List (Recursive):")
    solution.printLinkedList(merged_recursive)