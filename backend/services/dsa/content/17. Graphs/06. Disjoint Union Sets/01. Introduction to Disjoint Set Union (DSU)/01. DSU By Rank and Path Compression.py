


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