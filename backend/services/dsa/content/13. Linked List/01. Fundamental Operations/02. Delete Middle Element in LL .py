"""
Problem Statement:
    You are given the head of a linked list. Delete the middle node, and return the head of the modified linked list.
    The middle node of a linked list of size n is the ⌊n / 2⌋th node from the start using 0-based indexing, where ⌊x⌋ denotes the largest integer less than or equal to x.
    For n = 1, 2, 3, 4, and 5, the middle nodes are 0, 1, 1, 2, and 2, respectively.

Time Complexity: O(n), where n is the number of nodes in the linked list.
Space Complexity: O(1), as we only use a constant amount of extra space.
"""

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def deleteMiddle(self, head: ListNode) -> ListNode:
        """
        Explanation:
            We'll use the two-pointer technique (slow and fast pointers) to find the middle node.
            The fast pointer moves twice as fast as the slow pointer.
            When the fast pointer reaches the end, the slow pointer will be at the middle.
            We'll also keep track of the node before the slow pointer to facilitate deletion.
        """
        # Edge case: if the list is empty or has only one node
        if not head or not head.next:
            return None
        
        # Initialize pointers
        slow = fast = head
        prev = None
        
        # Find the middle node
        while fast and fast.next:
            fast = fast.next.next
            prev = slow
            slow = slow.next
        
        # Delete the middle node
        prev.next = slow.next
        
        return head

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
def test_delete_middle():
    solution = Solution()

    # Test case 1: [1,3,4,7,1,2,6]
    head1 = create_linked_list([1,3,4,7,1,2,6])
    result1 = solution.deleteMiddle(head1)
    print(f"Test case 1 result: {linked_list_to_list(result1)}")  # Expected: [1,3,4,1,2,6]

    # Test case 2: [1,2,3,4]
    head2 = create_linked_list([1,2,3,4])
    result2 = solution.deleteMiddle(head2)
    print(f"Test case 2 result: {linked_list_to_list(result2)}")  # Expected: [1,2,4]

    # Test case 3: [2,1]
    head3 = create_linked_list([2,1])
    result3 = solution.deleteMiddle(head3)
    print(f"Test case 3 result: {linked_list_to_list(result3)}")  # Expected: [2]

    # Test case 4: [1]
    head4 = create_linked_list([1])
    result4 = solution.deleteMiddle(head4)
    print(f"Test case 4 result: {linked_list_to_list(result4)}")  # Expected: []

# Run the test cases
test_delete_middle()