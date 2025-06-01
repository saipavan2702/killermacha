#basic
- Basic Operations of Linked List
```cpp
#include <iostream>
using namespace std;

// ------------------- Node Definition -------------------
class Node {
public:
    int data;
    Node* next;

    Node(int data) {
        this->data = data;
        this->next = nullptr;
    }
};

// ------------------- Print Linked List -------------------
void printList(Node* head) {
    Node* temp = head;
    while (temp != nullptr) {
        cout << temp->data << " ";
        temp = temp->next;
    }
    cout << endl;
}

// ------------------- Bubble Sort on Linked List -------------------
void sortLinkedList(Node** head_ref) {
    if (*head_ref == nullptr) return;

    Node* current = *head_ref;
    Node* index = nullptr;

    while (current != nullptr) {
        index = current->next;
        while (index != nullptr) {
            if (current->data > index->data) {
                swap(current->data, index->data);
            }
            index = index->next;
        }
        current = current->next;
    }
}

// ------------------- Create Linked List from Input -------------------
Node* createLinkedList() {
    int data;
    cin >> data;

    Node* head = nullptr;
    Node* tail = nullptr;

    while (data != -1) {
        Node* newNode = new Node(data);

        if (head == nullptr) {
            head = newNode;
            tail = newNode;
        } else {
            tail->next = newNode;
            tail = newNode;
        }

        cin >> data;
    }

    return head;
}

// ------------------- Insert Node at Index -------------------
Node* insertNode(Node* head, int index, int data) {
    Node* newNode = new Node(data);

    if (index == 0) {
        newNode->next = head;
        return newNode;
    }

    Node* temp = head;
    int count = 0;

    while (temp != nullptr && count < index - 1) {
        temp = temp->next;
        count++;
    }

    if (temp != nullptr) {
        newNode->next = temp->next;
        temp->next = newNode;
    }

    return head;
}

// ------------------- Reverse Linked List -------------------
Node* reverseList(Node* head) {
    Node* prev = nullptr;
    Node* current = head;
    Node* next = nullptr;

    while (current != nullptr) {
        next = current->next;    // Store next node
        current->next = prev;    // Reverse the link
        prev = current;          // Move prev forward
        current = next;          // Move to next node
    }

    return prev;
}

// ------------------- Main Function to Test -------------------
int main() {
    cout << "Enter linked list elements (end with -1): ";
    Node* head = createLinkedList();

    cout << "\nOriginal List: ";
    printList(head);

    head = insertNode(head, 2, 99);
    cout << "After inserting 99 at index 2: ";
    printList(head);

    head = reverseList(head);
    cout << "After reversing: ";
    printList(head);

    sortLinkedList(&head);
    cout << "After sorting: ";
    printList(head);

    return 0;
}

```