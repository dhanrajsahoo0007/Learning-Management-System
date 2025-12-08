"""
Sort List

Problem Statement:
    Given the head of a linked list, return the list after sorting it in ascending order.

Example 1:
    Input: head = [4,2,1,3]
    Output: [1,2,3,4]

Example 2:
    Input: head = [-1,5,3,4,0]
    Output: [-1,0,3,4,5]

Example 3:
    Input: head = []
    Output: []

Constraints:
- The number of nodes in the list is in the range [0, 5 * 10^4].
- -10^5 <= Node.val <= 10^5

Follow up: Can you sort the linked list in O(n logn) time and O(1) memory (i.e., constant space)

Detailed Explanation:

This solution implements the merge sort algorithm to sort the linked list. Merge sort is chosen because it's efficient for linked lists and achieves the required O(n log n) time complexity. Here's a step-by-step breakdown of the algorithm:

1. Base Case:
   If the list is empty or contains only one node, it's already sorted. We return the head as is.

2. Finding the Middle:
   We use the "slow and fast pointer" technique to find the middle of the list.
   - The slow pointer moves one step at a time.
   - The fast pointer moves two steps at a time.
   - When the fast pointer reaches the end, the slow pointer will be at the middle.
   This is implemented in the getMid function.

3. Splitting the List:
   Once we find the middle, we split the list into two halves.
   - The left half starts from the head and ends at the middle.
   - The right half starts from the node after the middle to the end.
   We need to set the next of the middle node to None to properly split the list.

4. Recursive Sorting:
   We recursively call sortList on both the left and right halves.
   This continues until we reach the base case (lists of size 0 or 1).

5. Merging:
   After the recursive calls return, we merge the two sorted halves.
   The merge function does this by comparing the values of nodes from both lists
   and building a new sorted list.

6. Return:
   The final merged list is returned, which is the complete sorted list.

Key Functions:

    1. sortList(self, head):
    - Main function that implements the merge sort algorithm.
    - Handles the base case, splitting, recursive calls, and merging.

    2. getMid(self, head):
    - Finds and returns the middle node of the list.
    - Uses slow and fast pointers to efficiently find the middle.

    3. merge(self, list1, list2):
    - Merges two sorted linked lists into a single sorted list.
    - Uses a dummy node to simplify the merging process.

Time Complexity Analysis:
    - O(n log n), where n is the number of nodes in the linked list.
    - We're dividing the list in half at each level (log n levels).
    - At each level, we're doing O(n) work to merge the lists.

Space Complexity Analysis:
    - O(log n) due to the recursive call stack.
    - The maximum depth of recursion is log n (as we're halving the list each time).
    - Note: This doesn't meet the O(1) space requirement in the follow-up question.
    Achieving O(1) space would require a more complex bottom-up approach.

Note on In-Place Sorting:
    While we're not creating new nodes, we are modifying the next pointers of existing nodes.
    This is considered in-place for linked lists, as we're not using extra space proportional
    to the input size for storing node values.

"""

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def sortList(self, head: ListNode) -> ListNode:
        if not head or not head.next:
            return head
        
        # Split the list into two halves
        left = head
        right = self.getMid(head)
        tmp = right.next
        right.next = None
        right = tmp
        
        # Recursively sort both halves
        left = self.sortList(left)
        right = self.sortList(right)
        
        # Merge the sorted halves
        return self.merge(left, right)
    
    def getMid(self, head):
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow
    
    def merge(self, list1, list2):
        dummy = ListNode()
        tail = dummy
        
        while list1 and list2:
            if list1.val < list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next
        
        if list1:
            tail.next = list1
        if list2:
            tail.next = list2
        
        return dummy.next

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
head1 = create_linked_list([4, 2, 1, 3])
print("Input:")
print_linked_list(head1)
result1 = solution.sortList(head1)
print("Output:")
print_linked_list(result1)

# Example 2
head2 = create_linked_list([-1, 5, 3, 4, 0])
print("\nInput:")
print_linked_list(head2)
result2 = solution.sortList(head2)
print("Output:")
print_linked_list(result2)

# Example 3
head3 = create_linked_list([])
print("\nInput:")
print_linked_list(head3)
result3 = solution.sortList(head3)
print("Output:")
print_linked_list(result3)