class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    
    def getIntersectionNode_hashSet(self, headA: ListNode, headB: ListNode) -> ListNode:
        """
        Solution 1: Hash Set Technique
        
        Approach:
            - Store all nodes of list A in a set.
            - Traverse list B and check if any node is in the set.
            - not optimtimal solution as it uses hashset with has space complexity O(N)
        
        Time Complexity: O(N + M)
        Space Complexity: O(N), where N is the length of list A
        """
        if not headA or not headB:
            return None
        
        node_set = set()
        
        while headA:
            node_set.add(headA)
            headA = headA.next
        
        while headB:
            if headB in node_set:
                return headB
            headB = headB.next
        
        return None
    
    def getIntersectionNode_lengthDifference(self, headA: ListNode, headB: ListNode) -> ListNode:
        """
        Solution 2: Length Difference Technique
        
        Approach:
            - Calculate the length of both lists.
            - Move the pointer of the longer list by the difference in lengths.
            - Move both pointers together until they meet.
        
        Explanation:
            This method aligns the two lists so that we start comparing nodes at the same distance from the end of each list. 
            By moving the pointer of the longer list forward, we ensure that if there's an intersection, both pointers will
            reach it at the same time.
        
        Time Complexity: O(N + M)
        Space Complexity: O(1)
        """
        def getLength(node):
            length = 0
            while node:
                length += 1
                node = node.next
            return length
        
        lenA, lenB = getLength(headA), getLength(headB)
        
        # Align the starting points
        while lenA > lenB:
            headA = headA.next
            lenA -= 1
        while lenB > lenA:
            headB = headB.next
            lenB -= 1
        
        # Move both pointers until they meet
        while headA != headB:
            headA = headA.next
            headB = headB.next
        
        return headA  # Will be None if no intersection

    
    def getIntersectionNode_twoPointers(self, headA: ListNode, headB: ListNode) -> ListNode:
        """
        Solution 3: Two Pointers Technique
        
        Approach:
            - Use two pointers, one for each list.
            - When a pointer reaches the end of its list, redirect it to the head of the other list.
            - If there's an intersection, the pointers will meet at the intersection node.
        
        Explanation:
            This method works because it ensures both pointers travel the same distance.
            If list A has length a+c and list B has length b+c, where c is the length of the 
            shared part, then both pointers will travel a+b+c steps before meeting.
        
        Time Complexity: O(N + M)
        Space Complexity: O(1)
        """
        if not headA or not headB:
            return None
        
        ptrA, ptrB = headA, headB
        
        while ptrA != ptrB:
            ptrA = headB if ptrA is None else ptrA.next
            ptrB = headA if ptrB is None else ptrB.next
        
        return ptrA  # Will be None if no intersection


    # Helper methods for testing
    def createLinkedList(self, nums):
        dummy = ListNode(0)
        current = dummy
        for num in nums:
            current.next = ListNode(num)
            current = current.next
        return dummy.next

    def printLinkedList(self, head):
        current = head
        while current:
            print(current.val, end=" -> ")
            current = current.next
        print("None")

# Example usage
if __name__ == "__main__":
    solution = Solution()

    # Create two intersecting lists
    # List A: 4 -> 1 -> 8 -> 4 -> 5
    #                    ^
    # List B:      5 -> 6 |
    listA = solution.createLinkedList([4, 1])
    listB = solution.createLinkedList([5, 6])
    intersectionPart = solution.createLinkedList([8, 4, 5])
    
    listA.next.next = intersectionPart
    listB.next.next = intersectionPart

    print("List A:")
    solution.printLinkedList(listA)
    print("List B:")
    solution.printLinkedList(listB)

    # Test all three solutions
    result1 = solution.getIntersectionNode_twoPointers(listA, listB)
    result2 = solution.getIntersectionNode_hashSet(listA, listB)
    result3 = solution.getIntersectionNode_lengthDifference(listA, listB)

    print("\nIntersection node value:")
    print(f"Two Pointers Solution: {result1.val if result1 else 'No intersection'}")
    print(f"Hash Set Solution: {result2.val if result2 else 'No intersection'}")
    print(f"Length Difference Solution: {result3.val if result3 else 'No intersection'}")