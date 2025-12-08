"""
Problem Statement:
    You are given the head of a linked list.
    Remove every node which has a node with a strictly greater value anywhere to the right side of it.
    Return the head of the modified linked list.
"""

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def removeNodesRecursive(self, head: ListNode) -> ListNode:
        """
        Explanation of recursive solution:
            1. The base case handles empty lists or single-node lists.
            2. We recursively process the list from right to left.
            3. After processing the rest of the list, we compare the current node with its next node.
            4. If the next node has a greater value, we "remove" the current node by returning the next node.
            5. Otherwise, we keep the current node.
        
        Time complexity: O(n), where n is the number of nodes in the list.
        Space complexity: O(n) due to the recursive call stack.
        """
        # Base case: if the list is empty or has only one node
        if not head or not head.next:
            return head
        
        # Recursively process the rest of the list
        head.next = self.removeNodesRecursive(head.next)
        
        # If the next node has a greater value, return the next node
        # This effectively removes the current node
        if head.next and head.val < head.next.val:
            return head.next
        
        # Otherwise, keep the current node
        return head

    def removeNodes(self, head: ListNode) -> ListNode:
        """
        Explanation of iterative solution:
            1. We first reverse the linked list to process nodes from right to left.
            2. We traverse the reversed list, keeping track of the maximum value seen so far.
            3. If a node's value is less than the current maximum, we remove it.
            4. Otherwise, we update the maximum and move to the next node.
            5. Finally, we reverse the list again to restore the original order.

        Time complexity: O(n), where n is the number of nodes in the list.
        Space complexity: O(1), as we only use a constant amount of extra space.
    
        """
        def reverse(head):
            prev, cur = None, head
            while cur:
                tmp = cur.next
                cur.next = prev
                prev, cur = cur, tmp
            return prev

        head = reverse(head)
        cur = head
        cur_max = cur.val
        while cur.next:
            if cur.next.val < cur_max:
                cur.next = cur.next.next
            else:
                cur_max = cur.next.val
                cur = cur.next
        
        return reverse(head)

# Test cases
def printList(head):
    current = head
    while current:
        print(current.val, end=" -> ")
        current = current.next
    print("None")

# Test case 1: [5,2,13,3,8] -> [13,8]
head1 = ListNode(5)
head1.next = ListNode(2)
head1.next.next = ListNode(13)
head1.next.next.next = ListNode(3)
head1.next.next.next.next = ListNode(8)

print("Test case 1:")
print("Original:")
printList(head1)
solution = Solution()
result1 = solution.removeNodes(head1)
print("After removal:")
printList(result1)

# Test case 2: [1,1,1,1] -> [1,1,1,1]
head2 = ListNode(1)
head2.next = ListNode(1)
head2.next.next = ListNode(1)
head2.next.next.next = ListNode(1)

print("\nTest case 2:")
print("Original:")
printList(head2)
result2 = solution.removeNodes(head2)
print("After removal:")
printList(result2)