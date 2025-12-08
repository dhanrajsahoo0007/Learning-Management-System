"""
Partition List

Problem Statement:
    Given the head of a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x.
    You should preserve the original relative order of the nodes in each of the two partitions.

Example 1:
    Input: head = [1,4,3,2,5,2], x = 3
    Output: [1,2,2,4,3,5]

Example 2:
    Input: head = [2,1], x = 2
    Output: [1,2]

Constraints:
    * The number of nodes in the list is in the range [0, 200].
    * -100 <= Node.val <= 100
    * -200 <= x <= 200

Detailed Explanation:

    To solve this problem, we'll use a two-pointer approach to create two separate lists:
        1. A list for nodes with values less than x
        2. A list for nodes with values greater than or equal to x

Here's the step-by-step approach:

1. Initialize two dummy nodes: 
   - 'before_dummy' for the list of nodes with values less than x
   - 'after_dummy' for the list of nodes with values greater than or equal to x

2. Initialize two pointers:
   - 'before' pointing to 'before_dummy'
   - 'after' pointing to 'after_dummy'

3. Traverse the original list:
   - If the current node's value is less than x:
     * Append it to the 'before' list
     * Move the 'before' pointer
   - If the current node's value is greater than or equal to x:
     * Append it to the 'after' list
     * Move the 'after' pointer

4. After traversal:
   - Connect the end of the 'before' list to the start of the 'after' list
   - Set the end of the 'after' list to None (to avoid cycles)

5. Return the start of the partitioned list (which is before_dummy.next)

This approach ensures that we maintain the relative order of nodes in each partition
while separating them based on the value x.

Time Complexity: O(n), where n is the number of nodes in the linked list
Space Complexity: O(1), as we only use a constant amount of extra space

"""

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def partition(self, head: ListNode, x: int) -> ListNode:
        # Initialize dummy nodes for both partitions
        before_dummy = ListNode(0)
        after_dummy = ListNode(0)
        
        # Initialize pointers for both partitions
        before = before_dummy
        after = after_dummy
        
        # Traverse the original list
        while head:
            if head.val < x:
                # Append to the 'before' list
                before.next = head
                before = before.next
            else:
                # Append to the 'after' list
                after.next = head
                after = after.next
            head = head.next
        
        # Connect the two partitions
        before.next = after_dummy.next
        after.next = None  # Set the end of the list to None
        
        return before_dummy.next

# Helper functions for testing
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
head1 = create_linked_list([1,4,3,2,5,2])
print("Input:")
print_linked_list(head1)
result1 = solution.partition(head1, 3)
print("Output:")
print_linked_list(result1)

# Example 2
head2 = create_linked_list([2,1])
print("\nInput:")
print_linked_list(head2)
result2 = solution.partition(head2, 2)
print("Output:")
print_linked_list(result2)

# Additional test case
head3 = create_linked_list([1,4,3,2,5,2,7,8,1,3])
print("\nInput:")
print_linked_list(head3)
result3 = solution.partition(head3, 4)
print("Output:")
print_linked_list(result3)