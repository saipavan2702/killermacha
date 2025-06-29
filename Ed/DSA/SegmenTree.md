We use this to do range sum queries.  
It can be done with array or we can build tree using class data types.
 
- Range-Sum Query

```cpp
class Tree {
public:
    Tree* left;
    Tree* right;
    int val, L, R;

    Tree(int L, int R) {
        this->L = L;
        this->R = R;
        this->left = nullptr;
        this->right = nullptr;
        this->val = 0;
    }
};

class NumArray {
    Tree* root;

    Tree* build(vector<int>& nums, int L, int R) {
        if (L > R) return nullptr;

        Tree* node = new Tree(L, R);

        if (L == R) {
            node->val = nums[L];
        } else {
            int mid = (L + R) / 2;
            node->left = build(nums, L, mid);
            node->right = build(nums, mid + 1, R);
            node->val = node->left->val + node->right->val;
        }

        return node;
    }

    void Update(Tree* root, int idx, int k) {
        if (root->L == root->R) {
            root->val = k;
        } else {
            int mid = (root->L + root->R) / 2;
            if (idx <= mid)
                Update(root->left, idx, k);
            else
                Update(root->right, idx, k);

            root->val = root->left->val + root->right->val;
        }
    }

    int sum(Tree* root, int l, int r) {
        if (root->L == l && root->R == r) {
            return root->val;
        }

        int mid = (root->L + root->R) / 2;

        if (r <= mid)
            return sum(root->left, l, r);
        else if (l >= mid + 1)
            return sum(root->right, l, r);
        else
            return sum(root->left, l, mid) + sum(root->right, mid + 1, r);
    }

public:
    NumArray(vector<int>& nums) {
        int n = nums.size();
        root = build(nums, 0, n - 1);
    }

    void update(int index, int val) {
        Update(root, index, val);
    }

    int sumRange(int left, int right) {
        return sum(root, left, right);
    }
};

```

- Using array rather than tree
```cpp

#include<bits/stdc++.h>
using namespace std;


vector<int>A;
vector<int>tree;
void build(int node, int start, int end)
{
    if(start == end)
    {
        // Leaf node will have a single element
        tree[node] = A[start];
    }
    else
    {
        int mid = (start + end) / 2;
        build(2*node, start, mid);
        build(2*node+1, mid+1, end);
        // Internal node will have the sum of both of its children
        tree[node] = tree[2*node] + tree[2*node+1];
    }
}

void update(int node, int start, int end, int idx, int val)
{
    if(start == end)
    {
        // Leaf node
        A[idx] = val;
        tree[node] = val;
    }
    else
    {
        int mid = (start + end) / 2;
        if(start <= idx and idx <= mid)
        {
            update(2*node, start, mid, idx, val);
        }
        else
        {
            update(2*node+1, mid+1, end, idx, val);
        }
        tree[node] = tree[2*node] + tree[2*node+1];
    }
}

int query(int node, int start, int end, int l, int r)
{
    if(r < start or end < l) return 0;
    
    if(l <= start and end <= r) return tree[node];
    
    int mid = (start + end) / 2;
    int p1 = query(2*node, start, mid, l, r);
    int p2 = query(2*node+1, mid+1, end, l, r);
    return (p1 + p2);
}


int main(){
	int n;cin>>n;
	A.resize(n);
	tree.resize(4 * n); 
	for(int &i:A)cin>>i;

	build(1,0,n-1); //since in query we are using 1-indexing
	query(1, 0, n-1, 1, 3);
    update(1, 0, n-1, 2, 5);
	query(1, 0, n-1, 1, 3);

	return 0;	
}

```


- Beats
```cpp

/*
Two conditons tagCondition, breakCondition

tagCondition - (l <= start and end <= r)
breakCondition - (r < start or end < l)

Let's try for a query where we need to update whole array with the modulo op by x, means every lement get's A[0,..,n-1]%=x;
For this

We need to optimise the SegmenTree there comes this beats,

for, breakCondition - if a number is less than x then no need to traverse. (max[seg]<x)
	 tagCondition - 


*/

#include <bits/stdc++.h>
using namespace std;

vector<int> A;
vector<int> tree;
vector<int> max_tree;  

void build(int node, int start, int end) {
    if(start == end) {
        tree[node] = A[start];
        max_tree[node] = A[start];
    } else {
        int mid = (start + end) / 2;
        build(2*node + 1, start, mid);
        build(2*node + 2, mid+1, end);
        tree[node] = tree[2*node + 1] + tree[2*node + 2];
        max_tree[node] = max(max_tree[2*node + 1], max_tree[2*node + 2]);
    }
}

void range_mod(int node, int start, int end, int l, int r, int mod) {
    if(max_tree[node] < mod) return;
    
    if(start == end) {
        A[start] %= mod;
        tree[node] = A[start];
        max_tree[node] = A[start];
        return;
    }
    
    int mid = (start + end) / 2;
    if(l <= mid) range_mod(2*node + 1, start, mid, l, r, mod);
    if(r > mid) range_mod(2*node + 2, mid+1, end, l, r, mod);
    
    tree[node] = tree[2*node + 1] + tree[2*node + 2];
    max_tree[node] = max(max_tree[2*node + 1], max_tree[2*node + 2]);
}


/*
void updateFromChildren(int v) {
	tree[v].sum = tree[2 * v].sum + tree[2 * v + 1].sum;
	tree[v].max = max(tree[2 * v].max, tree[2 * v + 1].max);
}
    
void updateModEq(int v, int l, int r, int ql, int qr, int val) {
	if (qr <= l || r <= ql || tree[v].max < val) {
		return;
	}
	if (l + 1 == r) {
		tree[v].max %= val;
		tree[v].sum = tree[v].max;
		return;
	}
	int mid = (r + l) / 2;
	updateModEq(2 * v, l, mid, ql, qr, val);
	updateModEq(2 * v + 1, mid, r, ql, qr, val);
	updateFromChildren(v);
}*/

int main() {
    int n; cin >> n;
    A.resize(n);
    tree.resize(4*n+1);
    max_tree.resize(4*n+1);
    
    for(int i = 0; i < n; i++) cin >> A[i];
    build(0, 0, n-1);
    
    range_mod(0, 0, n-1, 1, 4, 3);
       
    return 0;
}


```


**Lazy Propagation**
```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 1e5;  
int tree[4 * N];    
int lazy[4 * N];    

void build(int node, int start, int end) {
    if (start == end) {
        tree[node] = 0; 
    } else {
        int mid = (start + end) / 2;
        build(2 * node, start, mid);
        build(2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }
}

void propagate(int node, int start, int end) {
    if (lazy[node] != 0) {
        tree[node] += (end - start + 1) * lazy[node];

        if (start != end) {
            lazy[2 * node] += lazy[node];
            lazy[2 * node + 1] += lazy[node];
        }

        lazy[node] = 0;  
    }
}

void update(int node, int start, int end, int l, int r, int val) {
    propagate(node, start, end);

    if (r < start || end < l)
        return;  

    if (l <= start && end <= r) {
        lazy[node] += val;
        propagate(node, start, end);
        return;
    }

    int mid = (start + end) / 2;
    update(2 * node, start, mid, l, r, val);
    update(2 * node + 1, mid + 1, end, l, r, val);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}

int query(int node, int start, int end, int l, int r) {
    propagate(node, start, end);

    if (r < start || end < l)
        return 0;  

    if (l <= start && end <= r)
        return tree[node];  

    int mid = (start + end) / 2;
    int sum1 = query(2 * node, start, mid, l, r);
    int sum2 = query(2 * node + 1, mid + 1, end, l, r);
    return sum1 + sum2;
}

int main() {
    int n = 10; 
    build(1, 0, n - 1);
    update(1, 0, n - 1, 0, 3, 5); 
    cout << query(1, 0, n - 1, 2, 5);   

    return 0;
}

```

_References_
https://www.hackerearth.com/practice/data-structures/advanced-data-structures/trie-keyword-tree/practice-problems/
https://medium.com/@florian_algo/fenwick-tree-binary-indexed-tree-explained-2347c9e1b1f8
https://codeforces.com/blog/entry/57319
https://codeforces.com/blog/entry/18051
https://cp-algorithms.com/data_structures/segment_tree.html
https://pastebin.com/wabDfjKi
https://pastebin.com/bEEQsDr7
https://pastebin.com/UJhuFA3a
https://pastebin.com/jDMC5R2T
#ref