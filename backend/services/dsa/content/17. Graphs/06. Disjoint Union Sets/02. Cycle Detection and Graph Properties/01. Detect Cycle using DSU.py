"""
Problem Statement:
    Given an undirected graph with V vertices and E edges, detect if there is a cycle in the graph using Union-Find algorithm.

Time Complexity: O(E * α(V))
    - E is the number of edges
    - α is the inverse Ackermann function, which grows very slowly and is effectively constant for all practical values of V
    - In the worst case, we might need to perform a find operation for each edge

Space Complexity: O(V)
- We use two arrays (parent and rank) of size V

Explanation:
    The Union-Find algorithm uses two main operations:
        1. Find: Determine which subset a particular element is in
        2. Union: Join two subsets into a single subset

We start with each vertex in its own set. As we process edges, we union the sets of the vertices connected by the edge.
If we encounter an edge whose vertices are already in the same set, we've found a cycle.

The 'rank' array is used for union by rank, which helps keep the tree balanced and improves performance.
Path compression is used in the 'find' function to flatten the structure of the tree whenever Find is used, which also improves performance.
"""

class Solution:
    def __init__(self):
        self.parent = []
        self.rank = []
    
    def find(self, x):
        if self.parent[x] == x:
            return x
        
        self.parent[x] = self.find(self.parent[x])  # Path compression
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
    
    def detectCycle(self, V, adj):
        self.parent = list(range(V)) # [0, 1, 2, 3, 4]
        self.rank = [0] * V          # [0, 0, 0, 0, 0] 
        
        for u in range(V):
            for v in adj[u]:
                if u < v:  # Process each edge only once as it is undirected Graph
                    if self.find(u) == self.find(v):
                        return 1  # Cycle detected
                    else:
                        self.union(u, v)
        return 0  # No cycle detected

# Test cases
def print_test_case(case_num, V, adj, expected_output):
    sol = Solution()
    print(f"\nTest Case {case_num}:")
    print(f"Input:")
    print(f"  Number of vertices: {V}")
    print(f"  Adjacency List: {adj}")
    
    result = sol.detectCycle(V, adj)
    print(f"Output: {'Cycle detected' if result == 1 else 'No cycle detected'}")
    print(f"Expected: {'Cycle detected' if expected_output == 1 else 'No cycle detected'}")
    
    if result == expected_output:
        print("Test case passed!")
    else:
        print("Test case failed.")
    
    return result == expected_output

# Test cases
def test_solution():
    test_cases = [
        (5, [[1], [0, 2, 4], [1, 3], [2, 4], [1, 3]], 1),  # Graph with a cycle
        (4, [[1, 2], [0, 2], [0, 1], []], 0),  # Graph without a cycle
        (0, [], 0),  # Empty graph
        (3, [[0], [2], [1]], 1),  # Graph with self-loop
        (6, [[1, 2], [0, 3], [0, 4], [1, 5], [2], [3]], 0)  # Larger graph without cycle
    ]
    
    total_cases = len(test_cases)
    passed_cases = sum(print_test_case(i+1, V, adj, expected) for i, (V, adj, expected) in enumerate(test_cases))
    
    print(f"\nTest Results: {passed_cases} out of {total_cases} cases passed.")

# Run the tests
test_solution()