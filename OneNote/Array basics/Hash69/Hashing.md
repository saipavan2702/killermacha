- ```
    Find count of subarrays with sum equal to target
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    ```
    

int curr=0;  
//s is target sum  
int cnt=0;//answer  
unordered_map\<int,int\>freq;  
for(int i=0;i\<n;i++) {  
curr+=a[i];  
cnt+=freq[curr-s];  
freq[curr]++;  
}
   

- Line-sweep Algorithm 
The below problem will give the maximum lines are intersected when we sweep a line across the segments.
 
};  
}
   

struct node{  
int val;  
int left;  
int right;  
bool isleft=0;  
int Linesweep(vector\<vector\<int\>\>&T){  
vector\<node\>ret;  
for(auto x:T) {  
for(auto r:x) {  
node p;  
p.left=x[0];  
p.right=x[1];  
p.val=r;
 
if(r==x[0])  
p.isleft=1;
 
ret.push_back(p);  
}  
}  
sort\<ret.begin(),ret.end(),use); //build use comparator to sort using val.  
set\<int\>st;  
for(node p:ret){  
if(p.isleft){  
st.push(p.val);  
}  
else  
st.erase(p.left);
 
res=max(res,st.size()+1);  
}  
return res;
 
- Another ref for line sweep

```cpp
#include<bits/stdc++.h>  
using namespace std;
 
struct Point {  
int x, y;  
};
 
bool compare_points(const Point &a, const Point &b) {  
return a.x \< b.x;  
}
 
int main() {  
vector\<Point\> points;  
int n;  
cin \>\> n;  
for (int i = 0; i \< n; i++) {  
int x, y;  
cin \>\> x \>\> y;  
points.push_back({x, y});  
}
 
sort(points.begin(), points.end(), compare_points);  
vector\<Point\> active;
 
for (Point p : points) {  
// Remove any points from the active set that are to the left of p  
active.erase(remove_if(active.begin(), active.end(),  
[&](const Point &q) { return q.x \< p.x; }),  
active.end());
 
// Check for intersections with the points in the active set  
for (Point q : active) {  
if (p.y \> q.y) {  
// p is above q, so there is an intersection  
cout \<\< "Intersection at (" \<\< p.x \<\< ", " \<\< q.y \<\< ")" \<\< endl;  
}  
}
 
// Add p to the active set  
active.push_back(p);  
}
 
return 0;  
}
```