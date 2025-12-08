"""
Problem Statement:
    Given the head of a linked list, return the node where the cycle begins. 
    If there is no cycle, return None.


Time Complexity: O(n), where n is the number of nodes in the linked list.
                    - In the worst case, we traverse the list twice.

Space Complexity: O(1)- We only use two pointers, regardless of the input size.


Examples:
    1. Input: head = [3,2,0,-4], pos = 1 (cycle starts at index 1)
        Output: Node with value 2
    2. Input: head = [1,2], pos = 0 (cycle starts at index 0)
        Output: Node with value 1
    3. Input: head = [1], pos = -1 (no cycle)
        Output: None
"""


class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def detectCycle(self, head: ListNode) -> ListNode:
        """
        Solution Explanation (Floyd's Cycle-Finding Algorithm):
        1. Use two pointers: 'slow' and 'fast'. 
        2. Move 'slow' one step at a time and 'fast' two steps at a time.
        3. If there's a cycle, they will meet at some point inside the cycle.
        4. After they meet, reset one pointer to the head and move both pointers one step at a time.
        5. The point where they meet again is the start of the cycle.
        """
        if not head or not head.next:
            return None

        # Phase 1: Detect cycle
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                # Cycle detected
                break
        else:
            # No cycle
            return None

        # Phase 2: Find the start of the cycle
        slow = head
        while slow != fast:
            slow = slow.next
            fast = fast.next

        return slow

    def createLinkedList(self, nums, pos):
        """Helper function to create a linked list with a cycle."""
        dummy = ListNode(0)
        current = dummy
        nodes = []
        for num in nums:
            current.next = ListNode(num)
            current = current.next
            nodes.append(current)
        
        if pos >= 0:
            current.next = nodes[pos]
        
        return dummy.next

    def printLinkedList(self, head, limit=10):
        """Helper function to print a linked list, with cycle detection."""
        current = head
        visited = set()
        count = 0
        while current and count < limit:
            if current in visited:
                print(f"({current.val})", end=" -> ")
                print("Cycle detected!")
                return
            print(current.val, end=" -> ")
            visited.add(current)
            current = current.next
            count += 1
        print("None" if count < limit else "...")

# Example usage
if __name__ == "__main__":
    solution = Solution()

    # Example 1: Cycle starts at index 1
    list1 = solution.createLinkedList([3,2,0,-4], 1)
    print("List 1 (cycle at index 1):")
    solution.printLinkedList(list1)
    result1 = solution.detectCycle(list1)
    print(f"Cycle starts at node with value: {result1.val if result1 else 'No cycle'}")

    # Example 2: Cycle starts at index 0
    list2 = solution.createLinkedList([1,2], 0)
    print("\nList 2 (cycle at index 0):")
    solution.printLinkedList(list2)
    result2 = solution.detectCycle(list2)
    print(f"Cycle starts at node with value: {result2.val if result2 else 'No cycle'}")

    # Example 3: No cycle
    list3 = solution.createLinkedList([1], -1)
    print("\nList 3 (no cycle):")
    solution.printLinkedList(list3)
    result3 = solution.detectCycle(list3)
    print(f"Cycle starts at node with value: {result3.val if result3 else 'No cycle'}")