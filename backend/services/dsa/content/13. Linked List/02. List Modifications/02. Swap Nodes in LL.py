"""
Problem Statement:
    You are given the head of a linked list, and an integer k.
    Return the head of the linked list after swapping the values of the kth node from the beginning 
    and the kth node from the end (the list is 1-indexed).

Constraints:
    * The number of nodes in the list is n.
    * 1 <= k <= n <= 10^5
    * 0 <= Node.val <= 100

Time Complexity: O(n), where n is the number of nodes in the linked list.
        - We traverse the list twice: once to find the length and kth node from start, and once to find the kth node from end.

Space Complexity: O(1)
        - We only use a constant amount of extra space for pointers and variables.
"""

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def swapNodes(self, head: ListNode, k: int) -> ListNode:
        """
        Solution - 1
        Explanation:
            The solution uses a two-pass approach:
            1. First pass: Find the kth node from the beginning and the length of the list.
            2. Second pass: Find the kth node from the end and swap its value with the kth node from the beginning.
        """

        # Find the length of the list and kth node from start
        length = 0
        current = head
        kth_from_start = None
        while current:
            length += 1
            if length == k:
                kth_from_start = current
            current = current.next
        
        # Find the kth node from end
        kth_from_end = head
        for _ in range(length - k):
            kth_from_end = kth_from_end.next
        
        # Swap values
        kth_from_start.val, kth_from_end.val = kth_from_end.val, kth_from_start.val
        
        return head
    
    def swapNodes(self, head,k):
        """
        Explanation:

            This solution efficiently swaps the kth node from the beginning with the kth node from the end 
            in a single pass through the linked list. Here's how it works:

            1. Initial positioning:
            - We start with 'cur' at the head of the list.
            - We move 'cur' k-1 steps forward. Now 'cur' is at the kth node from the beginning.

            2. Two-pointer technique:
            - We set 'left' to the current position of 'cur' (kth node from beginning).
            - We set 'right' to the head of the list.
            - We continue moving 'cur' until it reaches the end of the list.
            - Simultaneously, we move 'right' at the same pace.

            3. Final positions:
            - When 'cur' reaches the end, 'right' will be at the kth node from the end.
            - 'left' is still at the kth node from the beginning.

            4. Swapping:
            - We swap the values of 'left' and 'right'.

            5. Return:
            - We return the head of the list, as the overall structure hasn't changed.

            Time Complexity: O(n), where n is the number of nodes in the linked list.
            - We traverse the list only once.

            Space Complexity: O(1)
            - We only use a constant amount of extra space for the pointers.

            This solution is more efficient than the previous two-pass solution as it only requires
            a single pass through the list.
        """
        cur = head
        for i in range(k - 1):
            cur = cur.next
        
        left = cur
        right = head
        while cur.next:
            cur = cur.next
            right = right.next
        
        left.val, right.val = right.val, left.val
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
def test_swap_nodes():
    solution = Solution()

    # Test case 1: [1,2,3,4,5], k = 2
    head1 = create_linked_list([1,2,3,4,5])
    result1 = solution.swapNodes(head1, 2)
    print(f"Test case 1 result: {linked_list_to_list(result1)}")  # Expected: [1,4,3,2,5]

    # Test case 2: [7,9,6,6,7,8,3,0,9,5], k = 5
    head2 = create_linked_list([7,9,6,6,7,8,3,0,9,5])
    result2 = solution.swapNodes(head2, 5)
    print(f"Test case 2 result: {linked_list_to_list(result2)}")  # Expected: [7,9,6,6,8,7,3,0,9,5]

    # Test case 3: [1], k = 1
    head3 = create_linked_list([1])
    result3 = solution.swapNodes(head3, 1)
    print(f"Test case 3 result: {linked_list_to_list(result3)}")  # Expected: [1]

# Run the test cases
test_swap_nodes()

"""
Output:
Test case 1 result: [1, 4, 3, 2, 5]
Test case 2 result: [7, 9, 6, 6, 8, 7, 3, 0, 9, 5]
Test case 3 result: [1]
"""