- **Bipartite Graph**

Used in whether we can colour in a way that no two adjacent nodes will have same colour or in other words making the tree into two subsets.  
We can use dfs/bfs in finding whether it is possible or not.
 
```
 
bool
 
isBipartite
(
vector
\<
vector
\<
int
\>\>
&
 
T
) {

        
int
 n;

        n=
T
.
size
();

        vector\<
int
\>
vis
(n,
0
);

        queue\<
int
\>q;

        
for
(
int
 i=
0
;i\<n;i++){

           
if
(!
vis
[i]){

               
q
.
push
(i);

               
vis
[i]=
1
;

               
while
(!
q
.
empty
())

               {

                   
int
 x=
q
.
front
();

                   
q
.
pop
();

                   
for
(
auto
 u:
T
[x])

                   {

                       
if
(
vis
[u]==
vis
[x])

                       
return
 
0
;

                       

                       
if
(!
vis
[u])

                       
vis
[u]=-
vis
[x],
q
.
push
(u);

                   }

               }

           }

        }

        
return
 
1
;

    }












































































































































































































































































































































































































```

bool isBipartite(vector\<vector\<int\>\>& T) {  
        int n;  
        n=T.size();  
        vector\<int\>vis(n,0);  
        queue\<int\>q;  
        for(int i=0;i\<n;i++){  
           if(!vis[i]){  
               q.push(i);  
               vis[i]=1;  
               while(!q.empty())  
               {  
                   int x=q.front();  
                   q.pop();  
                   for(auto u:T[x])  
                   {  
                       if(vis[u]==vis[x])  
                       return 0;  
                         
                       if(!vis[u])  
                       vis[u]=-vis[x],q.push(u);  
                   }  
               }  
           }  
        }  
        return 1;  
    }
   
- **Disjoint Union Set/Union-Find** 
int find(int x, int P[]) {  
if(P[x]==-1)  
return x;
 
return find(P[x],P);  
}
 
void union(int u, int v, int P[]) {  
int a=find(u, P);  
int b=find(v, P);   if(a!=b)  
P[a]=b;  
}   bool isCycle(int V, vector\<int\>&adj[]) {  
int P[V];  
memset(P,-1,sizeof(P));
 
for(int i=0;i\<V;i++) {  
for(int e:adj[i]) {  
if(find(e)==find(i) && i\<e)  
return 1;   union(i,e,P);  
}  
}  
return 0;  
}
                

- **Dijkstra's Algorithm**

We use a set to sort the upcoming distances as it sorts itself. We picks shortest distance from source in a weighted edge graph.
 vector\<int\>dist(V,INT_MAX);  
set\<pair\<int,int\>\>st;  
st.insert({0,S});   dist[S]=0;  
while(!st.empty()){   auto it=*(st.begin());  
int x=it.second;  
int d=it.first;   st.erase(it);  
for(auto u:adj[x]) {   if(d+u[1]\<dist[u[0]]) {   if(dist[u[0]]!=INT_MAX)  
st.erase({dist[u[0]],u[0]});   dist[u[0]]=d+u[1];  
st.insert({dist[u[0]],u[0]});  
}  
}  
}  
return dist;
  - **Bellman Ford Algorithm**

First take every node at inf distance from source.  
Now iterate V-1 times to relax or go through every node.  
Observe -ve cycle detection.
 
vector\<int\> bellman_ford(int V, vector\<vector\<int\>\>&E, int S) {  
vector\<int\>dist(V,100000000);  
dist[S]=0;  
for(int i=0;i\<V-1;i++){  
for(auto e:E) {  
int u=e[0];  
int v=e[1];  
int d=e[2];   if(dist[u]!=INT_MAX && dist[v]\>dist[u]+d) {  
dist[v]=dist[u]+d;  
}  
}  
}  
for(auto e:E) {  
int u=e[0];  
int v=e[1];  
int d=e[2];   if(dist[u]!=INT_MAX && dist[v]\>dist[u]+d) {  
return {-1};  
}  
}  
return dist;  
}
   
- **Topological Sort BFS**

We calculate indegrees for every node and we push the nodes having indegree as 0 into queue and iterate through its neighbours.
    - ![Exported image](Exported%20image%2020250529160058-0.png)
- We use simple bfs with distance array 
```cpp
#include \<bits/stdc++.h\>  
using namespace std;
 
int main() {  
int n,p;  
cin\>\>n\>\>p;   int S,D;  
cin\>\>S\>\>D;   vector\<int\>P(n);  
for(int &i:P)  
cin\>\>i;   vector\<int\>adj[n+1];  
for(int i=0;i\<p;i++) {  
int x,y;  
cin\>\>x\>\>y;   if(P[x]==1 || P[y]==1)  
continue;   adj[x].push_back(y);  
adj[y].push_back(x);  
}   vector\<int\>vis(n,0);  
vis[S]=1;  
queue\<int\>q;  
q.push(S);   vector\<int\>dist(n,-1);  
dist[S]=0;   while(!q.empty()){  
int x=q.front();  
q.pop();   for(auto node:adj[x]){  
if(vis[node])  
continue;   q.push(node);  
vis[node]=1;  
dist[node]=dist[x]+1;  
}  
}  
cout\<\<dist[D]\<\<endl;  
return 0;
 
}
     
vector\<int\> topoSort(int V, vector\<int\> adj[]) {  
int indeg[V]={0};  
vector\<int\>req;  
for(int i=0;i\<V;i++){  
for(int u:adj[i]){  
indeg[u]++;  
}  
}  
queue\<int\>q;  
for(int i=0;i\<V;i++){  
if(indeg[i]==0)  
q.push(i);  
}  
while(!q.empty()){  
int x=q.front();  
q.pop();  
req.push_back(x);  
for(auto u:adj[x]){  
indeg[u]--;  
if(indeg[u]==0)  
q.push(u);  
}  
}  
return req;  
}
            

- ![Exported image](Exported%20image%2020250529160101-1.png)
- We use union find to solve this problem 
#include \<bits/stdc++.h\>  
using namespace std;   int find(int r, int P[]){  
if(P[r]==r)  
return r;   return P[r]=find(P[r],P);  
}
 
void uni(int u, int v, int P[]){  
if(u!=v)  
P[u]=v;  
}
   

int main() {
 
int n,p;  
cin\>\>n\>\>p;   int P[n+1];  
for(int i=0;i\<=n;i++){  
P[i]=i;  
}   for(int i=0;i\<p;i++){  
int x,y;  
cin\>\>x\>\>y;   int a=find(x,P);  
int b=find(y,P);  
uni(a,b,P);  
}   int cnt=0;  
for(int i=1;i\<=n;i++){  
if(P[i]==i)  
cnt++;  
}  
cout\<\<cnt-1\<\<endl;
 
return 0;
 
}
              
- ![Exported image](Exported%20image%2020250529160104-2.png)
- The logic is if 1-\>n have shortest distance then n-\>node and 1-\>node should sum up to shortest distance. 
#include \<bits/stdc++.h\>  
using namespace std;  
using vi=vector\<int\>;
   

vi bfs(vi adj[], int S, int n){  
queue\<int\>q;  
vector\<int\>dist(n+1,1e9);  
vector\<int\>vis(n+1,0);   q.push(S);  
vis[S]=1;  
dist[S]=0;   while(!q.empty()){  
int x=q.front();  
q.pop();   for(auto node:adj[x]){  
if(vis[node])  
continue;   vis[node]=1;  
q.push(node);  
dist[node]=dist[x]+1;  
}  
}  
return dist;   }
 
int main() {   int n,p;  
cin\>\>n\>\>p;   vector\<int\>adj[n+1];  
for(int i=0;i\<p;i++){  
int x,y;  
cin\>\>x\>\>y;   adj[x].push_back(y);  
adj[y].push_back(x);  
}   vi H,T;   H=bfs(adj,1,n);  
T=bfs(adj,n,n);   if(H[n]==1e9)  
cout\<\<-1\<\<endl;  
else {  
set\<int\>st;   for(int i=1;i\<=n;i++){  
if(H[i]+T[i]==H[n])  
st.insert(i);  
}   for(auto i:st)  
cout\<\<i\<\<" ";   cout\<\<endl;   }      return 0;
 
}
 - ![Exported image](Exported%20image%2020250529160106-3.png)
- We use 3D dp to solve this problem in an optimised way 
#include \<bits/stdc++.h\>  
using namespace std;
 
int dp[1005][1005][20];
 
void Solve(){   int n,p,b;  
cin\>\>n\>\>p\>\>b;   vector\<vector\<char\>\>G(n,vector\<char\>(p));  
for(int i=0;i\<n;i++){  
for(int j=0;j\<p;j++){  
cin\>\>G[i][j];  
}  
}   int sx, sy;  
for(int i=0;i\<n;i++){  
for(int j=0;j\<p;j++){  
if(G[i][j]=='S'){  
sx=i,sy=j;  
break;  
}  
}  
}  
memset(dp,0,sizeof(dp));  
queue\<pair\<int,pair\<int,int\>\>\>q;  
q.push({sx,{sy,b}});   int C=0;  
int dx[4]={-1, 0, 1, 0};  
int dy[4]={0, 1, 0, -1};     
while(!q.empty()) {  
int sz=q.size();   while(sz--) {   auto node=q.front();  
q.pop();   int x = node.first;  
int y = node.second.first;  
int B = node.second.second;   if(G[x][y]=='G'){  
cout\<\<C\<\<endl;  
return;  
}   for(int i=0;i\<4;i++){  
int ex=x+dx[i];  
int ey=y+dy[i];   if(ex\>=0 && ex\<n && ey\>=0 && ey\<p) {   if(G[ex][ey]=='#' && B\>0 && !dp[ex][ey][B-1]){  
q.push({ex,{ey,B-1}});  
dp[ex][ey][B-1]=1;  
}   if((G[ex][ey]=='.'|| G[ex][ey]=='G') && !dp[ex][ey][B]){  
q.push({ex,{ey,B}});  
dp[ex][ey][B]=1;  
}   }  
}  
}  
C++;  
}  
cout\<\<-1\<\<endl;  
}  
int main() {   Solve();  
return 0;  
}
   
- Kruskal's Algorithm
- ```