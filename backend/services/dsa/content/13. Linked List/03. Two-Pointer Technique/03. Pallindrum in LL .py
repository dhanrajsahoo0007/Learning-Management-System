"""
Problem Statement:
    Given the head of a singly linked list, return true if it is a palindrome, false otherwise.

Time Complexity: O(n), where n is the number of nodes in the linked list.
    - Finding the middle: O(n/2)
    - Reversing the second half: O(n/2)
    - Comparing the halves: O(n/2)
    - Total: O(n)

Space Complexity: O(1), as we only use a constant amount of extra space.
                - We modify the list in-place and use only a few pointers.


Examples:
    1. Input: 1 -> 2 -> 2 -> 1
        Output: True
    2. Input: 1 -> 2
        Output: False
    3. Input: 1
        Output: True
"""


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:

    def findMiddle(self, head: ListNode) -> ListNode:
        """
        Finds the middle node of a linked list using the slow and fast pointer technique.
        """
        slow = fast = head
        while fast.next and fast.next.next:
            slow = slow.next
            fast = fast.next.next
        return slow

    def reverseList(self, head: ListNode) -> ListNode:
        """Helper function to reverse a linked list."""
        prev = None
        current = head
        while current:
            next_temp = current.next
            current.next = prev
            prev = current
            current = next_temp
        return prev
    
    def isPalindrome(self, head: ListNode) -> bool:
        """
        Solution Explanation:
            1. Find the middle of the linked list using the slow and fast pointer technique.
            2. Reverse the second half of the linked list.
            3. Compare the first half with the reversed second half.
            4. (Optional) Restore the original linked list by reversing the second half again.

        """
        if not head or not head.next:
            return True

        # Step 1: Find the middle of the linked list
        middle = self.findMiddle(head)

        # Step 2: Reverse the second half of the linked list
        second_half = self.reverseList(middle.next)

        # Step 3: Compare the first half with the reversed second half
        first_half = head
        while second_half:
            if first_half.val != second_half.val:
                return False
            first_half = first_half.next
            second_half = second_half.next

        # Optional: Restore the original linked list
        # middle.next = self.reverseList(middle.next)

        return True

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

    # Example 1: 1 -> 2 -> 2 -> 1 (Palindrome)
    list1 = solution.createLinkedList([1, 2, 2, 1])
    print("List 1:")
    solution.printLinkedList(list1)
    print("Is Palindrome:", solution.isPalindrome(list1))

    # Example 2: 1 -> 2 (Not a Palindrome)
    list2 = solution.createLinkedList([1, 2])
    print("\nList 2:")
    solution.printLinkedList(list2)
    print("Is Palindrome:", solution.isPalindrome(list2))

    # Example 3: 1 (Palindrome)
    list3 = solution.createLinkedList([1])
    print("\nList 3:")
    solution.printLinkedList(list3)
    print("Is Palindrome:", solution.isPalindrome(list3))

    # Example 4: 1 -> 2 -> 3 -> 2 -> 1 (Palindrome)
    list4 = solution.createLinkedList([1, 2, 3, 2, 1])
    print("\nList 4:")
    solution.printLinkedList(list4)
    print("Is Palindrome:", solution.isPalindrome(list4))