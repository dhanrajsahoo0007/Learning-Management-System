"""
23. Merge k Sorted Lists
Solved
Hard
Topics
Companies
You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

 

Example 1:

Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
Explanation: The linked-lists are:
[
  1->4->5,
  1->3->4,
  2->6
]
merging them into one sorted list:
1->1->2->3->4->4->5->6
Example 2:

Input: lists = []
Output: []
Example 3:

Input: lists = [[]]
Output: []
 

Constraints:

k == lists.length
0 <= k <= 104
0 <= lists[i].length <= 500
-104 <= lists[i][j] <= 104
lists[i] is sorted in ascending order.
The sum of lists[i].length will not exceed 104.
"""



# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
	"""
	Initial:    [k elements]           O(k log k)
	Processing: [N total operations]   O(N log k)
	So yes, overall time complexity is O(N log k) where:

	N is total number of nodes across all lists
	k is number of lists

	Space Complexity:

	Heap never contains more than k elements
	So space complexity is O(k)
	"""
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        k = len(lists)
        curr_elements = [] # heap containing the values of LL and the node

        for list_node in lists:
            if list_node:
                element = (list_node.val, id(list_node), list_node)
                heapq.heappush(curr_elements, element)

        dummy =  prev = ListNode()
        while curr_elements :
            val, _, list_node = heapq.heappop(curr_elements)
            prev.next = list_node
            prev = list_node

            if list_node.next:
                heapq.heappush(curr_elements, (list_node.next.val, id(list_node.next), list_node.next))
        return dummy.next