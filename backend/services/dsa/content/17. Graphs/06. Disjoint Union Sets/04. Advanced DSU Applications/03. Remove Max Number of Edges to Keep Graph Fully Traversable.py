"""
Problem: Remove Max Number of Edges to Keep Graph Fully Traversable

    Alice and Bob have an undirected graph of n nodes and three types of edges:
        * Type 1: Can be traversed by Alice only.
        * Type 2: Can be traversed by Bob only.
        * Type 3: Can be traversed by both Alice and Bob.

    Given an array edges where edges[i] = [typei, ui, vi] represents a bidirectional edge of type typei between nodes ui and vi, 
    find the maximum number of edges you can remove so that after removing the edges, the graph can still be fully traversed by both Alice and Bob. 
    The graph is fully traversed by Alice and Bob if starting from any node, they can reach all other nodes.

    Return the maximum number of edges you can remove, or return -1 if Alice and Bob cannot fully traverse the graph.

Example 1:
    Input: n = 4, edges = [[3,1,2],[3,2,3],[1,1,3],[1,2,4],[1,1,2],[2,3,4]]
    Output: 2
    Explanation: If we remove the 2 edges [1,1,2] and [1,1,3]. The graph will still be fully traversable by Alice and Bob. Removing any additional edge will not make it so. So the maximum number of edges we can remove is 2.

Example 2:
    Input: n = 4, edges = [[3,1,2],[3,2,3],[1,1,4],[2,1,4]]
    Output: 0
    Explanation: Notice that removing any edge will not make the graph fully traversable by Alice and Bob.

Example 3:
    Input: n = 4, edges = [[3,2,3],[1,1,2],[2,3,4]]
    Output: -1
    Explanation: In the current graph, Alice cannot reach node 4 from the other nodes. Likewise, Bob cannot reach 1. Therefore it's impossible to make the graph fully traversable.

Constraints:
    * 1 <= n <= 10^5
    * 1 <= edges.length <= min(10^5, 3 * n * (n - 1) / 2)
    * edges[i].length == 3
    * 1 <= typei <= 3
    * 1 <= ui < vi <= n
    * All tuples (typei, ui, vi) are distinct.

Time Complexity: O(E * α(N)), where E is the number of edges and α is the inverse Ackermann function
    - Sorting takes O(E log E)
    - Union and Find operations take O(α(N)) amortized time each

Space Complexity: O(N), where N is the number of nodes
    structures, each using O(N) space

Note: This solution uses a Disjoint Set Union (DSU) data structure with Union by Rank optimization.
"""

class DSU:
    def __init__(self, n):
        self.parent = list(range(n + 1))
        self.rank = [0] * (n + 1)
        self.components = n

    def find(self, x):
        if x != self.parent[x]:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        x_parent, y_parent = self.find(x), self.find(y)
        if x_parent == y_parent:
            return False
        if self.rank[x_parent] < self.rank[y_parent]:
            self.parent[x_parent] = y_parent
        elif self.rank[x_parent] > self.rank[y_parent]:
            self.parent[y_parent] = x_parent
        else:
            self.parent[x_parent] = y_parent
            self.rank[y_parent] += 1
        self.components -= 1
        return True

    def is_single(self):
        return self.components == 1

class Solution:
    def maxNumEdgesToRemove(self, n: int, edges: list[list[int]]) -> int:
        # Sort edges in descending order of type (3 -> 2 -> 1)
        edges.sort(key=lambda x: x[0], reverse=True)

        alice = DSU(n)
        bob = DSU(n)
        added_edges = 0

        for edge_type, u, v in edges:
            if edge_type == 3:
                added = False
                if alice.find(u) != alice.find(v):
                    alice.union(u, v)
                    added = True
                if bob.find(u) != bob.find(v):
                    bob.union(u, v)
                    added = True
                if added:
                    added_edges += 1
            elif edge_type == 2:
                if bob.find(u) != bob.find(v):
                    bob.union(u, v)
                    added_edges += 1
            else:  # edge_type == 1
                if alice.find(u) != alice.find(v):
                    alice.union(u, v)
                    added_edges += 1

        if alice.is_single() and bob.is_single():
            return len(edges) - added_edges
        return -1

# Example usage
solution = Solution()
n = 4
edges = [[3,1,2],[3,2,3],[1,1,3],[1,2,4],[1,1,2],[2,3,4]]
result = solution.maxNumEdgesToRemove(n, edges)
print(f"Maximum number of edges that can be removed: {result}")