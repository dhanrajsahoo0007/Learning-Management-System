class Node:
    def __init__(self, data):
        self.data = data
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def insert_at_beginning(self, data):
        """
        Insert a new node at the beginning of the doubly linked list.
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        new_node = Node(data)
        if self.head is None:
            self.head = self.tail = new_node
        else:
            new_node.next = self.head
            self.head.prev = new_node
            self.head = new_node

    def insert_at_end(self, data):
        """
        Insert a new node at the end of the doubly linked list.
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        new_node = Node(data)
        if self.tail is None:
            self.head = self.tail = new_node
        else:
            new_node.prev = self.tail
            self.tail.next = new_node
            self.tail = new_node

    def delete_node(self, key):
        """
        Delete the first occurrence of a node with the given key.
        Time Complexity: O(n), where n is the number of nodes
        Space Complexity: O(1)
        """
        current = self.head
        while current:
            if current.data == key:
                if current.prev:
                    current.prev.next = current.next
                else:
                    self.head = current.next

                if current.next:
                    current.next.prev = current.prev
                else:
                    self.tail = current.prev

                return
            current = current.next

    def length(self):
        """
        Calculate the length of the doubly linked list.
        Time Complexity: O(n), where n is the number of nodes
        Space Complexity: O(1)
        """
        count = 0
        current = self.head
        while current:
            count += 1
            current = current.next
        return count

    def traverse_forward(self):
        """
        Traverse and print all elements in the doubly linked list from head to tail.
        Time Complexity: O(n), where n is the number of nodes
        Space Complexity: O(1)
        """
        current = self.head
        while current:
            print(current.data, end=" <-> ")
            current = current.next
        print("None")

    def traverse_backward(self):
        """
        Traverse and print all elements in the doubly linked list from tail to head.
        Time Complexity: O(n), where n is the number of nodes
        Space Complexity: O(1)
        """
        current = self.tail
        while current:
            print(current.data, end=" <-> ")
            current = current.prev
        print("None")

    def reverse(self):
        """
        Reverse the doubly linked list.
        Time Complexity: O(n), where n is the number of nodes
        Space Complexity: O(1)
        """
        current = self.head
        self.head, self.tail = self.tail, self.head

        while current:
            # Swap the prev and next pointers of the current node
            current.prev, current.next = current.next, current.prev
            # Move to the next node (which is now current.prev due to swapping)
            current = current.prev

# Example usage
if __name__ == "__main__":
    dllist = DoublyLinkedList()

    # Insert some elements
    dllist.insert_at_end(1)
    dllist.insert_at_end(2)
    dllist.insert_at_beginning(0)
    dllist.insert_at_end(3)

    print("Doubly Linked List (forward):")
    dllist.traverse_forward()

    print("Doubly Linked List (backward):")
    dllist.traverse_backward()

    print(f"Length of the doubly linked list: {dllist.length()}")

    # Delete a node
    dllist.delete_node(2)
    print("Doubly Linked List after deleting 2 (forward):")
    dllist.traverse_forward()

    print(f"New length of the doubly linked list: {dllist.length()}")

    # Reverse the list
    dllist.reverse()      

    dllist.traverse_forward()  
