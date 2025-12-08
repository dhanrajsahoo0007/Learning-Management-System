"""
Problem Statement:
    You are given two linked lists: list1 and list2 of sizes n and m respectively.
    Remove list1's nodes from the ath node to the bth node, and put list2 in their place.

Approach:
    1. Traverse list1 to find the (a-1)th and (b+1)th nodes.
    2. Connect the (a-1)th node to the head of list2.
    3. Find the last node of list2.
    4. Connect the last node of list2 to the (b+1)th node of list1.

Example:
    Input: list1 = [0,1,2,3,4,5], a = 3, b = 4, list2 = [1000000,1000001,1000002]
    Output: [0,1,2,1000000,1000001,1000002,5]
    Explanation: We remove the nodes 3 and 4 and put the entire list2 in their place.
"""

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeInBetween(self, list1: ListNode, a: int, b: int, list2: ListNode) -> ListNode:
        """
        Approach:
            1. Traverse list1 to find the (a-1)th and (b+1)th nodes.
            2. Connect the (a-1)th node to the head of list2.
            3. Find the last node of list2.
            4. Connect the last node of list2 to the (b+1)th node of list1.

        Detailed Explanation:
            1. Finding the (a-1)th node:
                - We start at the head of list1 and move forward (a-1) steps.
                - This node (let's call it 'prev') is where we'll attach the start of list2.
                - We use (a-1) because list indices are 0-based, and we want the node just before 'a'.

            2. Finding the (b+1)th node:
                - We continue from 'prev' and move forward (b-a+2) steps.
                - This node (let's call it 'curr') is where we'll attach the end of list2.
                - We use (b-a+2) because:
                    * (b-a) is the number of nodes between 'a' and 'b' inclusive
                    * +1 to include the 'b'th node
                    * +1 more to get to the node after 'b'

            3. Connecting list2:
                - We set prev.next to the head of list2. This effectively "cuts out" the nodes from 'a' to 'b' in list1.
                - We then traverse list2 to find its last node.
                - We connect the last node of list2 to 'curr' (the (b+1)th node of list1).

            4. Return value:
                - We return the head of list1, as it remains unchanged (we're modifying the list in-place)
        """
        # Find the (a-1)th node
        prev = list1
        for _ in range(a - 1):
            prev = prev.next

        # Find the (b+1)th node
        curr = prev
        for _ in range(b - a + 2):
            curr = curr.next

        # Connect (a-1)th node to the head of list2
        prev.next = list2

        # Find the last node of list2
        while list2.next:
            list2 = list2.next

        # Connect the last node of list2 to the (b+1)th node of list1
        list2.next = curr

        return list1

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

    # Example 1
    list1 = solution.createLinkedList([0, 1, 2, 3, 4, 5])
    list2 = solution.createLinkedList([1000000, 1000001, 1000002])
    a, b = 3, 4

    print("Original List 1:")
    solution.printLinkedList(list1)
    print("List 2 to be merged:")
    solution.printLinkedList(list2)

    result = solution.mergeInBetween(list1, a, b, list2)
    print(f"Result after merging list2 between indices {a} and {b} of list1:")
    solution.printLinkedList(result)

    # Example 2
    list1 = solution.createLinkedList([0, 1, 2, 3, 4, 5, 6])
    list2 = solution.createLinkedList([1000000, 1000001, 1000002, 1000003])
    a, b = 2, 5

    print("\nOriginal List 1:")
    solution.printLinkedList(list1)
    print("List 2 to be merged:")
    solution.printLinkedList(list2)

    result = solution.mergeInBetween(list1, a, b, list2)
    print(f"Result after merging list2 between indices {a} and {b} of list1:")
    solution.printLinkedList(result)