**Initialisning a Tree node**
 
TreeNode\<int\>*root=new TreeNode\<int\>(val);  
TreeNode\<int\>*node1=new TreeNode\<int\>(1);  
root-\>children.push_back(node1);
   

**Printing a Node**

 ```cpp
void printTree(TreeNode\<int\>*root)  
{  
if(root==NULL)  
return;
 
cout\<\<root-\>data\<\<":";  
for(i=0;i\<root-\>children.size();i++)  
{  
cout\<\<root-\>children[i]-\>value;  
}  
for(i=0;i\<root-\>children.size();i++)  
{  
printTree(root-\>children[i]);  
}
   

//Number of Nodes
 
int numNodes(TreeNode\<int\>*root)  
{  
int ans=1;  
for(auto i=0;i\<root-\>children.size();i++)  
{  
ans+=numNodes(root-\>children[i]);  
}  
}
   

//Height of a Binary Tree
 
int Treeheight(Tree*root)  
{  
int height=0;  
dfs(root,1,height);  
return height;  
}  
void dfs(Tree*node,int depth,int &height)  
{  
if(!node)  
return;  
if(height\<depth)  
height=depth;  
dfs(node-\>left,depth+1,height);  
dfs(node-\>right,depth+1,height);  
}

//Giving input**
 
TreeNode\<int\>* takeInput()  
{  
int rootdata;  
//We give root data input  
TreeNode\<int\>*root=new TreeNode\<int\>(rootdata);  
int n;  
//Enter no.of children  
for(int i=0;i\<n;i++)  
{  
TreeNode\<int\>*child=takeInput();  
root-\>children.push_back(child);  
}  
return root;  
}

//Taking Input Level-wise**
 TreeNode\<int\>*Levelwise()  
{￼  
int rootdata;  
//We give root data input  
TreeNode\<int\>*root=new TreeNode\<int\>(rootdata);  
//Initialise a queue￼ queue\<TreeNode*\<int\>\>res;  
res.push(root);  
while(res.size()!=0)  
{  
TreeNode\<int\>*front=res.front();  
res.pop();  
//We give input to front treenode  
int n; //num of child  
for(int i=0;i\<n;i++)  
{  
//We give input to childData respective of its index  
TreeNode\<int\>*child=new TreeNode(childData);  
front-\>children.push_back(child);  
res.push(child);  
}  
}  
}
```