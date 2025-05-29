We use this to do range sum queries.  
It can be done with array or we can build tree using class data types.
 
- Range-Sum Query
 
class Tree{  
public:  
Tree* left,*right;  
int val,L,R;  
Tree(int L,int R)  
{  
this-\>L=L;  
this-\>R=R;  
this-\>left=nullptr;  
this-\>right=nullptr;  
this-\>val=0;  
}   };  
class NumArray {  
Tree*root;  
public:  
Tree*build(vector\<int\>&nums,int L,int R)  
{  
if(L\>R)  
return nullptr;  
else  
{  
Tree*node=new Tree(L,R);  
if(L==R)  
node-\>val=nums[L];  
else  
{  
int mid=(L+R)/2;  
node-\>left=build(nums,L,mid);  
node-\>right=build(nums,mid+1,R);  
node-\>val=node-\>left-\>val+node-\>right-\>val;  
}  
return node;  
}   }  
NumArray(vector\<int\>& nums) {  
int n;  
n=nums.size();  
root=build(nums,0,n-1);  
}  
void Update(Tree*root,int idx,int k)  
{  
if(root-\>L==root-\>R)  
root-\>val=k;  
else  
{  
int mid=(root-\>L+root-\>R)/2;  
if(idx\<=mid)  
Update(root-\>left,idx,k);  
else  
Update(root-\>right,idx,k);   root-\>val=root-\>left-\>val+root-\>right-\>val;  
}  
}  
void update(int index, int val) {  
Update(root,index,val);  
}  
int sum(Tree*root,int l,int r)  
{  
if(root-\>L==l and root-\>R==r)  
return root-\>val;  
else  
{  
int mid=(root-\>L+root-\>R)/2;  
if(r\<=mid)  
return sum(root-\>left,l,r);  
else if(l\>=mid+1)  
return sum(root-\>right,l,r);  
else  
return sum(root-\>left,l,mid)+sum(root-\>right,mid+1,r);  
}  
}  
int sumRange(int left, int right) {  
return sum(root,left,right);  
}  
};