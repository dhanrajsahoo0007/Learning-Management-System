"""
Problem Statement:
    Given a directed acyclic graph (DAG) of n nodes labeled from 0 to n-1, find all possible paths from node 0 to node n-1 and return them in any order.

    The graph is given as follows: graph[i] is a list of all nodes you can visit from node i (i.e., there is a directed edge from node i to node graph[i][j]).

Time Complexity: O(2^N * N), where N is the number of nodes.
- In the worst case, we might have 2^N paths (if every node is connected to every other node).
- Each path can be up to N nodes long.

Space Complexity: O(2^N * N), as we might need to store all possible paths in the queue.

Explanation:
    This solution uses a Breadth-First Search (BFS) approach to find all paths from the source (node 0) to the target (node n-1). 
    The BFS method explores paths level by level, using a queue to keep track of partial paths.

Examples:
1. Input: graph = [[1,2],[3],[3],[]]
   Output: [[0,1,3],[0,2,3]]
   Explanation: There are two paths: 0 -> 1 -> 3 and 0 -> 2 -> 3.

2. Input: graph = [[4,3,1],[3,2,4],[3],[4],[]]
   Output: [[0,4],[0,3,4],[0,1,3,4],[0,1,2,3,4],[0,1,4]]

3. Input: graph = [[1],[]]
   Output: [[0,1]]

4. Input: graph = [[1,2,3],[2],[3],[]]
   Output: [[0,1,2,3],[0,2,3],[0,3]]

5. Input: graph = [[1,3],[2],[3],[]]
   Output: [[0,1,2,3],[0,3]]
"""

from typing import List
from collections import deque

class Solution:
    def allPathsSourceTarget(self, graph: List[List[int]]) -> List[List[int]]:
        n = len(graph)
        
        target = n - 1
        
        result = []
        temp = [0]  # Initial path with just the source node
        
        que = deque([temp])  # Initialize queue with the starting path [0]
        
        while que:
            currPath = que.popleft()
            lastNode = currPath[-1]
            
            if lastNode == target:
                result.append(currPath)
            else:
                for v in graph[lastNode]:
                    path = currPath.copy()  # Create a copy of the current path
                    path.append(v)  # Append the new node
                    que.append(path)
        
        return result

# Example usage and testing
solution = Solution()

# Test cases
test_cases = [
    [[1,2],[3],[3],[]],
    [[4,3,1],[3,2,4],[3],[4],[]],
    [[1],[]],
    [[1,2,3],[2],[3],[]],
    [[1,3],[2],[3],[]]
]

for i, graph in enumerate(test_cases, 1):
    print(f"Example {i}:")
    print(f"Input: graph = {graph}")
    print(f"Output: {solution.allPathsSourceTarget(graph)}")
    print()