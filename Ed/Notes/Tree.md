#basic 
- Basic Operations of Tree
```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

// ------------------- N-ary Tree Node -------------------
template <typename T>
class TreeNode {
public:
    T data;
    vector<TreeNode<T>*> children;

    TreeNode(T data) {
        this->data = data;
    }
};

// ------------------- Binary Tree Node -------------------
class Tree {
public:
    int val;
    Tree* left;
    Tree* right;

    Tree(int value) {
        val = value;
        left = nullptr;
        right = nullptr;
    }
};

// ------------------- Print N-ary Tree -------------------
void printTree(TreeNode<int>* root) {
    if (root == nullptr) return;

    cout << root->data << ": ";
    for (int i = 0; i < root->children.size(); i++) {
        cout << root->children[i]->data << " ";
    }
    cout << endl;

    for (int i = 0; i < root->children.size(); i++) {
        printTree(root->children[i]);
    }
}

// ------------------- Count Nodes in N-ary Tree -------------------
int numNodes(TreeNode<int>* root) {
    if (root == nullptr) return 0;

    int count = 1;
    for (int i = 0; i < root->children.size(); i++) {
        count += numNodes(root->children[i]);
    }
    return count;
}

// ------------------- Height of Binary Tree -------------------
void dfs(Tree* node, int depth, int& height) {
    if (!node) return;

    height = max(height, depth);
    dfs(node->left, depth + 1, height);
    dfs(node->right, depth + 1, height);
}

int treeHeight(Tree* root) {
    int height = 0;
    dfs(root, 1, height);
    return height;
}

// ------------------- Recursive Input (N-ary Tree) -------------------
TreeNode<int>* takeInput() {
    int rootData;
    cout << "Enter node data: ";
    cin >> rootData;

    TreeNode<int>* root = new TreeNode<int>(rootData);

    int n;
    cout << "Enter number of children of " << rootData << ": ";
    cin >> n;

    for (int i = 0; i < n; i++) {
        TreeNode<int>* child = takeInput();
        root->children.push_back(child);
    }

    return root;
}

// ------------------- Level-wise Input (N-ary Tree) -------------------
TreeNode<int>* levelWiseInput() {
    int rootData;
    cout << "Enter root data: ";
    cin >> rootData;

    TreeNode<int>* root = new TreeNode<int>(rootData);
    queue<TreeNode<int>*> q;
    q.push(root);

    while (!q.empty()) {
        TreeNode<int>* front = q.front();
        q.pop();

        int n;
        cout << "Enter number of children of " << front->data << ": ";
        cin >> n;

        for (int i = 0; i < n; i++) {
            int childData;
            cout << "Enter child " << i + 1 << " of " << front->data << ": ";
            cin >> childData;

            TreeNode<int>* child = new TreeNode<int>(childData);
            front->children.push_back(child);
            q.push(child);
        }
    }

    return root;
}

// ------------------- Main Function -------------------
int main() {
    cout << "Choose input type:\n1. Recursive\n2. Level-wise\nChoice: ";
    int choice;
    cin >> choice;

    TreeNode<int>* root = nullptr;

    if (choice == 1)
        root = takeInput();
    else
        root = levelWiseInput();

    cout << "\nTree Structure:\n";
    printTree(root);

    cout << "\nTotal number of nodes: " << numNodes(root) << endl;

    // Binary Tree height demo
    Tree* binaryRoot = new Tree(1);
    binaryRoot->left = new Tree(2);
    binaryRoot->right = new Tree(3);
    binaryRoot->left->left = new Tree(4);
    binaryRoot->right->right = new Tree(5);

    cout << "\nHeight of example binary tree: " << treeHeight(binaryRoot) << endl;

    return 0;
}

```
