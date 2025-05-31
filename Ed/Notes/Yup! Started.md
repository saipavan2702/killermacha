**A Node is defined**
 
class Node{  
public:  
int data;  
Node *next;  
Node(int data){  
this -\> data = data;  
this -\> next = NULL;  
}  
};
 
**Function to print a node is goes as**
 
void print(Node *head){  
Node *temp = head;
 
while(temp != NULL){  
cout \<\< temp -\> data \<\< " ";  
temp = temp -\> next;  
}  
cout \<\< endl;  
}
     
**Sort a Linked List(Bubble Sort)**
 
void sortLinkedList(Node** head_ref) {￼ struct Node *current = *head_ref, *index = NULL;￼ int temp;￼  
if(head_ref == NULL) {￼ return;￼ } else{￼ while(current != NULL) {￼ // index points to the node next to current index = current-\>next;  
while(index != NULL) {￼ if(current-\>data \> index-\>data){￼ temp = current-\>data;￼ current-\>data = index-\>data;￼ index-\>data = temp;}￼ index = index-\>next;￼ }￼ current = current-\>next;￼ }￼ }￼}
      

**Giving input to a linked list**
 
Node* func()  
{  
int data;  
cin\>\>data;  
Node*head=NULL;  
Node*tail=NULL;  
while(data!=-1)  
{  
Node*newnode=new Node(data);  
if(head==NULL)  
{  
head=newnode;  
tail=newnode;  
}  
else  
{  
tail-\>next=newnode;  
tail=newnode;  
}  
}

**Insertion of node**
 
void insertnode(head, i, data)  
{  
Node* newnode=new Node(data);  
Node temp=*head;  
int count=0;
 
 if(i==0)  
   {  
       newnode-\>next=head;  
       head=newnode;  
   }  
while(temp!=NULL and count\<i-1)  
{  
temp=temp-\>next;  
count++;  
}  
if(temp!=NULL)  
    {  
           newnode-\>next=temp-\>next;  
           temp-\>next=newnode;  
    }  
return head;  
}

**Reverse a Linked list**
 
LLNode* solve(LLNode*node)  
{  
LLNode*temp=node;  
LLNode*prev=NULL,*fast=NULL;  
while(temp!=NULL)  
{  
//store next address  
fast=temp-\>next;  
//connect to back node  
temp-\>next=prev;  
//store current node  
prev=temp;  
//assign next node  
temp=fast;  
}  
node=prev;  
}