from typing import List
from collections import deque


## Approach - 1: Creating the adjacency list from the matrix then solving it 

def create_adjacency_list(isConnected: List[List[int]]) -> List[List[int]]:
    n = len(isConnected)
    adj = [[] for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if isConnected[i][j] == 1 and i != j:
                adj[i].append(j)
    return adj

def BFS(adj: List[List[int]], u: int, visited: List[bool]):
    queue = deque([u])
    visited[u] = True

    while queue:
        u = queue.popleft()
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                queue.append(v)

def findCircleNum(isConnected: List[List[int]]) -> int:
    n = len(isConnected)
    adj = create_adjacency_list(isConnected)
    visited = [False] * n
    provinces = 0

    for i in range(n):
        if not visited[i]:
            BFS(adj, i, visited)
            provinces += 1

    return provinces


if __name__ == "__main__":
    isConnected = [[1,1,0],[1,1,0],[0,0,1]]
    result = findCircleNum(isConnected)
    print("Input:", isConnected)
    print("Number of Provinces:", result)

    isConnected = [[1,0,0],[0,1,0],[0,0,1]]
    result = findCircleNum(isConnected)
    print("Input:", isConnected)
    print("Number of Provinces:", result)


## Approach - 2:Directly iterating through the input matrix 

def BFS(isConnected: List[List[int]], u: int, visited: List[bool], result: List[int]):
    queue = deque([u])
    visited[u] = True

    while queue:
        u = queue.popleft()
        result.append(u)
        for v in range(len(isConnected)):
            if isConnected[u][v] == 1 and not visited[v]:
                visited[v] = True
                queue.append(v)

def findCircleNum(isConnected: List[List[int]]) -> int:
    n = len(isConnected)
    visited = [False] * n
    provinces = 0

    for i in range(n):
        if not visited[i]:
            result = []
            BFS(isConnected, i, visited, result)
            provinces += 1

    return provinces