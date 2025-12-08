class Solution:
    def findCircleNum(self, isConnected: List[List[int]]) -> int:
        """
        # DFS
    def findCircleNum(self, M):
        
        :type M: List[List[int]]
        :rtype: int
        
        if not M: return 0
        s = len(M)
        seen = set()
        
        def dfs(p):
            for q, adj in enumerate(M[p]):
                if (adj == 1) and (q not in seen):
                    seen.add(q)
                    dfs(q)
        
        cnt = 0
        for i in range(s):
            if i not in seen: 
                dfs(i)
                cnt += 1
        
        return cnt


        BFS:
        class Solution(object):
    def findCircleNum(self, M):
        :type M: List[List[int]]
        :rtype: int
        
        if not M: return 0
        s = len(M)
        seen = set()
        cnt = 0
        for i in range(s):
            if i not in seen:
                q = [i]
                while q:
                    p = q.pop(0)
                    if p not in seen:
                        seen.add(p)
                        q += [k for k,adj in enumerate(M[p]) if adj and (k not in seen)]
                cnt += 1
        
        return cnt
        visited = [0]*(len(isConnected))
        adj_list = [[] for i in range(len(isConnected))]
        for i in range(len(isConnected)):
            for j in range(len(isConnected[0])):
                if i!=j and isConnected[i][j]==1:
                    adj_list[i].append(j)
                    adj_list[j].append(i)
        def dfs(starting_node: int):
            if visited[starting_node] == 1:
                return
            visited[starting_node] = 1
            for next_node in adj_list[starting_node]:
                dfs(starting_node=next_node)
            return
        province_count = 0
        for index in range(len(isConnected)):
            if visited[index] ==1:
                continue
            dfs(index)
            province_count += 1
        return province_count
        """
        n = len(isConnected)
        union_finder = UnionFind(size=n)
        adj_list = [[] for _ in range(n)]
        for i in range(n):
            for j in range(n):
                if isConnected[i][j] and i!=j:
                    union_finder.union_by_rank(i, j)
        return union_finder.components

class UnionFind():
    def __init__(self, size=0):
        self.parent = list(range(size))
        self.rank = [0]*size
        self.size = [1]*size
        self.components = size
    
    def find(self, node):
        # Does path compression
        if self.parent[node] != node:
            self.parent[node] =  self.find(self.parent[node])
        return self.parent[node]
    
    def union_by_rank(self, source, target):
        psource = self.find(source)
        ptarget = self.find(target)
        if psource == ptarget:
            return False
        # Union by rank
        if self.rank[psource] > self.rank[ptarget]:
            self.parent[ptarget] = psource
        elif self.rank[psource] < self.rank[ptarget]:
            self.parent[psource] = ptarget
        else:
            self.parent[ptarget] = psource
            self.rank[psource] += 1
        self.components -= 1
        return True