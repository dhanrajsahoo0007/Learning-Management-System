"""
Problem: Number of Islands II

    You are given an empty 2D binary grid grid of size m x n. The grid represents a map where 0's represent water and 1's represent land. 
    Initially, all the cells of grid are water cells (i.e., all the cells are 0's).

    We may perform an add land operation which turns the water at position into a land.
    You are given an array positions where positions[i] = [ri, ci] is the position (ri, ci) at which we should operate the ith operation.

    Return an array of integers answer where answer[i] is the number of islands after turning the cell (ri, ci) into a land.

    An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. 
    You may assume all four edges of the grid are all surrounded by water.

Time Complexity: O(k * α(mn)), where k is the number of positions and α is the inverse Ackermann function
Space Complexity: O(mn)

This solution uses a Disjoint Set Union (DSU) data structure with a fixed-size array to efficiently connect land cells and count islands.
"""

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.number_of_components = 0  # Initially, no land cells

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        x_parent, y_parent = self.find(x), self.find(y)
        if x_parent == y_parent:
            return

        if self.size[x_parent] > self.size[y_parent]:
            self.parent[y_parent] = x_parent
            self.size[x_parent] += self.size[y_parent]
        else:
            self.parent[x_parent] = y_parent
            self.size[y_parent] += self.size[x_parent]

        self.number_of_components -= 1

class Solution:
    def numIslands2(self, m: int, n: int, positions: list[list[int]]) -> list[int]:
        dsu = DSU(m * n)
        grid = [[0] * n for _ in range(m)]
        results = []
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

        for r, c in positions:
            if grid[r][c] == 1:
                results.append(dsu.number_of_components)
                continue

            grid[r][c] = 1
            dsu.number_of_components += 1
            
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                    dsu.union(r * n + c, nr * n + nc)

            results.append(dsu.number_of_components)

        return results

# Example usage
solution = Solution()

m1, n1, positions1 = 3, 3, [[0,0],[0,1],[1,2],[2,1]]
print(f"Example 1 Output: {solution.numIslands2(m1, n1, positions1)}")

m2, n2, positions2 = 1, 1, [[0,0]]
print(f"Example 2 Output: {solution.numIslands2(m2, n2, positions2)}")