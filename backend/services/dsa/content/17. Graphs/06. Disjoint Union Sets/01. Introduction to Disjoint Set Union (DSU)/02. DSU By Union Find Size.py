"""
Disjoint Set Union (DSU) Implementation with Union by Size

This implementation provides three main operations:
    1. Initialization: Create a DSU with n elements.
    2. Find: Determine which set an element belongs to.
    3. Union: Merge two sets.

Time Complexity:
    - Initialization: O(n)
    - Find: O(α(n)) amortized, where α(n) is the inverse Ackermann function
    - Union: O(α(n)) amortized

Space Complexity: O(n) for storing parent and size arrays

The Union by Size optimization ensures that smaller trees are always attached to larger trees,
which helps in keeping the tree height logarithmic and improves the overall time complexity.
"""

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        # Find operation with path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union operation with union by size
        x_parent = self.find(x)
        y_parent = self.find(y)

        if x_parent == y_parent:
            return

        if self.size[x_parent] > self.size[y_parent]:
            self.parent[y_parent] = x_parent
            self.size[x_parent] += self.size[y_parent]
        else:
            self.parent[x_parent] = y_parent
            self.size[y_parent] += self.size[x_parent]

# Example usage
if __name__ == "__main__":
    dsu = DSU(6)
    
    dsu.union(0, 1)
    dsu.union(0, 2)

    # Check if 0 and 3 are in the same component
    if dsu.find(0) == dsu.find(3):
        print("In same component")
    else:
        print("Not in same component")

    # Now we will union 0 and 3
    dsu.union(0, 3)
    
    # Check again if 0 and 3 are in the same component
    if dsu.find(0) == dsu.find(3):
        print("In same component")
    else:
        print("Not in same component")