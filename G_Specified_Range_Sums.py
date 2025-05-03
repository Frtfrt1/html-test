n, m = map(int, input().split())
graph = [(i+1,i,-1) for i in range(n)]

for _ in range(m):
    l,r,s = map(int, input().split())
    graph.append((l-1, r, s))
    graph.append((r, l-1, -s))

distance = [1 << 99] * (n+1)
distance[n] = 0
for _ in range(n+1):
    for u,v,w in graph:
        if distance[u] + w < distance[v]:
            distance[v] = distance[u]+w

for u,v,w in graph:
    if distance[u] + w < distance[v]:
        print(-1)
        exit()

print(-distance[0])
