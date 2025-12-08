"""
Problem Statement:
    There are n computers numbered from 0 to n - 1 connected by ethernet cables connections forming a network where 
    connections[i] = [ai, bi] represents a connection between computers ai and bi. Any computer can reach any other 
    computer directly or indirectly through the network.

    You are given an initial computer network connections. You can extract certain cables between two directly connected 
    computers, and place them between any pair of disconnected computers to make them directly connected.

    Return the minimum number of times you need to do this in order to make all the computers connected. 
    If it is not possible, return -1.

Constraints:
    1 <= n <= 10^5
    1 <= connections.length <= min(n * (n - 1) / 2, 10^5)
    connections[i].length == 2
    0 <= ai, bi < n
    ai != bi
    There are no repeated connections.
    No two computers are connected by more than one cable.

Time Complexity: O(N + M), where N is the number of computers and M is the number of connections.
Space Complexity: O(N) for the parent and rank arrays.
"""

from typing import List

class Solution:
    def __init__(self):
        self.parent = []
        self.rank = []
    
    def find(self, x):
        if x == self.parent[x]:
            return x
        self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x, y):
        x_parent = self.find(x)
        y_parent = self.find(y)
        
        if x_parent == y_parent:
            return
        
        # Union by rank
        if self.rank[x_parent] > self.rank[y_parent]:
            self.parent[y_parent] = x_parent
        elif self.rank[x_parent] < self.rank[y_parent]:
            self.parent[x_parent] = y_parent
        else:
            self.parent[x_parent] = y_parent
            self.rank[y_parent] += 1
    
    def makeConnected(self, n: int, connections: List[List[int]]) -> int:
        # Check if we have enough cables
        if len(connections) < n - 1:
            return -1
        
        # Initialize parent and rank arrays
        self.parent = list(range(n))
        self.rank = [0] * n
        
        components = n
        for edge in connections:
            if self.find(edge[0]) != self.find(edge[1]):
                components -= 1
                self.union(edge[0], edge[1])
        
        # The number of operations needed is the number of components minus 1
        return components - 1

# Example usage
if __name__ == "__main__":
    solution = Solution()
    
    # Example 1
    n1 = 4
    connections1 = [[0,1],[0,2],[1,2]]
    print("Example 1 output:", solution.makeConnected(n1, connections1))  # 1
    
    # Example 2
    n2 = 6
    connections2 = [[0,1],[0,2],[0,3],[1,2],[1,3]]
    print("Example 2 output:", solution.makeConnected(n2, connections2))  # 2
    
    # Example 3
    n3 = 6
    connections3 = [[0,1],[0,2],[0,3],[1,2]]
    print("Example 3 output:", solution.makeConnected(n3, connections3))  # -1