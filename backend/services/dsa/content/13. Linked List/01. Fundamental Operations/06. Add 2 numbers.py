"""
Problem Statement:
    Given the heads of two non-empty linked lists representing two non-negative integers.
    The digits are stored in reverse order, and each of their nodes contains a single digit.
    Add the two numbers and return the sum as a linked list.

Example:
    Input: l1 = [2,4,3], l2 = [5,6,4]
    Output: [7,0,8]
    Explanation: 342 + 465 = 807

Solution Steps:
    1. Initialize a dummy head node for the result linked list 
       * do this in any case where you create a new list
       * dummy node helps to get rid of the edge case of inserting in to an empty list 
    2. Initialize a temporary pointer and a carry variable.
    3. Traverse both input lists and the carry:
        a. Calculate the sum of current digits and carry.
        b. Update the carry for the next iteration.
        c. Create a new node with the ones digit of the sum.
        d. Move to the next nodes in both input lists.
    4. Return the next node of the dummy head (the actual head of the result list).

Time Complexity: O(max(n, m)), where n and m are the lengths of l1 and l2 respectively.
Space Complexity: O(max(n, m)) for the new linked list to store the result.
"""


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:

        dummy = ListNode()
        temp = dummy
        carry = 0
        while (l1 != None or l2 != None) or carry:
            sum = 0
            if l1 != None:
                sum += l1.val
                l1 = l1.next
            if l2 != None:
                sum += l2.val
                l2 = l2.next
            sum += carry
            carry = sum // 10
            node = ListNode(sum % 10)
            temp.next = node
            temp = temp.next
        return dummy.next

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

    # Create two linked lists: 2 -> 4 -> 3 and 5 -> 6 -> 4
    # Representing numbers 342 and 465
    l1 = solution.createLinkedList([2, 4, 3])
    l2 = solution.createLinkedList([5, 6, 4])

    print("Number 1:")
    solution.printLinkedList(l1)
    print("Number 2:")
    solution.printLinkedList(l2)

    result = solution.addTwoNumbers(l1, l2)
    print("Sum:")
    solution.printLinkedList(result)