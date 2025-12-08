"""
Problem Statement: All path from Source to Target

    Given a directed acyclic graph (DAG) of n nodes labeled from 0 to n-1, find all possible paths from node 0 to node n-1 and return them in any order.
    The graph is given as follows: graph[i] is a list of all nodes you can visit from node i (i.e., there is a directed edge from node i to node graph[i][j]).

Time Complexity: O(2^N * N), where N is the number of nodes.
    - In the worst case, we might have 2^N paths (if every node is connected to every other node).
    - Each path can be up to N nodes long.

Space Complexity: O(N) for the recursion stack, as the longest path can be N nodes long.

Explanation:
    This solution uses a depth-first search (DFS) approach to find all paths from the source (node 0) to the target (node n-1). 
    The DFS function recursively explores all possible paths, backtracking when it reaches the target or a dead end.

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

class Solution:
    
    def dfs(self, adj: List[List[int]], u: int, target: int, path: List[int], result: List[List[int]]):
        # If we've reached the target, add the current path to results
        if u == target:
            result.append(path.copy())  # Use copy() to create a new list object
            return
        
        # Explore all neighboring nodes
        for v in adj[u]:
            path.append(v)  
            self.dfs(adj, v, target, path, result) 
            # Backtrack: remove the neighbor for the next iteration
            path.pop()  
        
    def allPathsSourceTarget(self, graph: List[List[int]]) -> List[List[int]]:
        target = len(graph) - 1  # Set the target node (last node)
        result = []  
        initial_path = [0]  # Start with the source node (0)
        
        # Start DFS from node 0
        self.dfs(graph, 0, target, initial_path, result)
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