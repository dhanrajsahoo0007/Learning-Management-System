"""
Problem: Number of Good Paths

    You are given a tree (i.e. a connected, undirected graph that has no cycles) consisting of n nodes numbered from 0 to n - 1 and exactly n - 1 edges. 
    The root of the tree is the node 0, and each node of the tree has a label which is a lower-case character given in the string labels (i.e. The node with the number i has the label labels[i]).
    The edges array is given on the form edges[i] = [ai, bi], which means there is an edge between nodes ai and bi in the tree.
   
     A good path is a simple path that satisfies the following conditions:
        1. The starting node and the ending node have the same value.
        2. All nodes between the start and end node have values less than or equal to the starting node 
           (i.e. the starting node's value should be the maximum value along the path).

Return the number of distinct good paths.

Time Complexity: O(n log n), where n is the number of nodes
Space Complexity: O(n)

This solution uses a Disjoint Set Union (DSU) data structure with path compression and union by rank.
"""

class Solution:
    def __init__(self):
        self.parent = []
        self.rank = []

    def find(self, x):
        if x == self.parent[x]:
            return x
        self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        x_parent = self.find(x)
        y_parent = self.find(y)

        if x_parent == y_parent:
            return

        if self.rank[x_parent] > self.rank[y_parent]:
            self.parent[y_parent] = x_parent
        elif self.rank[x_parent] < self.rank[y_parent]:
            self.parent[x_parent] = y_parent
        else:
            self.parent[x_parent] = y_parent
            self.rank[y_parent] += 1

    def numberOfGoodPaths(self, vals: list[int], edges: list[list[int]]) -> int:
        n = len(vals)
        self.parent = list(range(n))
        self.rank = [1] * n

        adj = {i: [] for i in range(n)}
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)

        val_to_nodes = {}
        for i, value in enumerate(vals):
            val_to_nodes.setdefault(value, []).append(i)

        result = n
        is_active = [False] * n

        for value in sorted(val_to_nodes.keys()):
            nodes = val_to_nodes[value]

            for u in nodes:
                for v in adj[u]:
                    if is_active[v]:
                        self.union(u, v)
                is_active[u] = True

            parent_count = {}
            for u in nodes:
                parent = self.find(u)
                parent_count[parent] = parent_count.get(parent, 0) + 1

            for count in parent_count.values():
                result += (count * (count - 1)) // 2

        return result

# Example usage
solution = Solution()
vals = [1,3,2,1,3]
edges = [[0,1],[0,2],[2,3],[2,4]]
result = solution.numberOfGoodPaths(vals, edges)
print(f"Number of good paths: {result}")