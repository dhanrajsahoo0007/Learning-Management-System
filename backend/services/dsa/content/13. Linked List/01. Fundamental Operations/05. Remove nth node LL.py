"""
Problem Statement:
    Given the head of a linked list, remove the nth node from the end of the list and return its head.

Example:
    Input: head = [1,2,3,4,5], n = 2
    Output: [1,2,3,5]

Time Complexity: O(L), where L is the length of the linked list.
    - We traverse the list once with the fast pointer, and then once more with both pointers.

Space Complexity: O(1)
    - We only use a constant amount of extra space for the two pointers.
"""

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def removeNthFromEnd(self, head: ListNode, n: int) -> ListNode:
        """
        Explanation:
            The solution uses the two-pointer technique:
            1. Initialize two pointers, 'fast' and 'slow', to the head of the list.
            2. Move the 'fast' pointer n nodes ahead.
            3. If 'fast' becomes None, it means we need to remove the head. Return head.next.
            4. Move both 'fast' and 'slow' pointers until 'fast' reaches the last node.
            5. Remove the next node of 'slow' (which is the nth node from the end).
        
        Create a dummy node to handle edge cases (e.g., removing the head)
        The dummy node simplifies edge cases, especially removing the head.
        """
        dummy = ListNode(0)
        dummy.next = head
        fast = slow = dummy

        # Move fast pointer n nodes ahead
        for _ in range(n):
            fast = fast.next

        # Move both pointers until fast reaches the end
        while fast.next:
            fast = fast.next
            slow = slow.next

        # Remove the nth node from the end
        slow.next = slow.next.next

        return dummy.next

# Helper function to create a linked list from a list of values
def create_linked_list(values):
    dummy = ListNode(0)
    current = dummy
    for val in values:
        current.next = ListNode(val)
        current = current.next
    return dummy.next

# Helper function to convert linked list to list for easy printing
def linked_list_to_list(head):
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result

# Test cases
def test_remove_nth_from_end():
    solution = Solution()

    # Test case 1: [1,2,3,4,5], n = 2
    head1 = create_linked_list([1,2,3,4,5])
    result1 = solution.removeNthFromEnd(head1, 2)
    print(f"Test case 1 result: {linked_list_to_list(result1)}")  # Expected: [1,2,3,5]

    # Test case 2: [1], n = 1
    head2 = create_linked_list([1])
    result2 = solution.removeNthFromEnd(head2, 1)
    print(f"Test case 2 result: {linked_list_to_list(result2)}")  # Expected: []

    # Test case 3: [1,2], n = 1
    head3 = create_linked_list([1,2])
    result3 = solution.removeNthFromEnd(head3, 1)
    print(f"Test case 3 result: {linked_list_to_list(result3)}")  # Expected: [1]

# Run the test cases
test_remove_nth_from_end()

"""
Output:
Test case 1 result: [1, 2, 3, 5]
Test case 2 result: []
Test case 3 result: [1]
"""