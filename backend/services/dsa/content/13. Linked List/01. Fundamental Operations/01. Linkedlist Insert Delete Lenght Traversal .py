class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_beginning(self, data):
        """
        Insert a new node at the beginning of the linked list.
        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def insert_at_end(self, data):
        """
        Insert a new node at the end of the linked list.
        Time Complexity: O(n), where n is the number of nodes
        Space Complexity: O(1)
        """
        new_node = Node(data)
        if self.head is None:
            self.head = new_node
            return
        last = self.head
        while last.next:
            last = last.next
        last.next = new_node

    def delete_node(self, key):
        """
        Delete the first occurrence of a node with the given key.
        Time Complexity: O(n), where n is the number of nodes
        Space Complexity: O(1)
        """
        temp = self.head
        if temp is not None:
            if temp.data == key:
                self.head = temp.next
                temp = None
                return
        while temp is not None:
            if temp.data == key:
                break
            prev = temp
            temp = temp.next
        if temp == None:
            return
        prev.next = temp.next
        temp = None

    def length(self):
        """
        Calculate the length of the linked list.
        Time Complexity: O(n), where n is the number of nodes
        Space Complexity: O(1)
        """
        count = 0
        current = self.head
        while current:
            count += 1
            current = current.next
        return count

    def traverse(self):
        """
        Traverse and print all elements in the linked list.
        Time Complexity: O(n), where n is the number of nodes
        Space Complexity: O(1)
        """
        current = self.head
        while current:
            print(current.data, end=" -> ")
            current = current.next
        print("None")
    
    def insert_at_index(self, data, index):
        """
        Insert a new node at the specified index.
        Time Complexity: O(n), where n is the number of nodes
        Space Complexity: O(1)
        """
        if index < 0:
            print("Index out of range")
            return

        new_node = Node(data)

        if index == 0:
            new_node.next = self.head
            self.head = new_node
            return

        current = self.head
        for i in range(index - 1):
            if current is None:
                print("Index out of range")
                return
            current = current.next

        if current is None:
            print("Index out of range")
            return

        new_node.next = current.next
        current.next = new_node

    def delete_at_index(self, index):
        """
        Delete the node at the specified index.
        Time Complexity: O(n), where n is the number of nodes
        Space Complexity: O(1)
        """
        if self.head is None:
            print("List is empty")
            return

        if index < 0:
            print("Index out of range")
            return

        if index == 0:
            self.head = self.head.next
            return

        current = self.head
        for i in range(index - 1):
            if current is None or current.next is None:
                print("Index out of range")
                return
            current = current.next

        if current.next is None:
            print("Index out of range")
            return
    

# Example usage
if __name__ == "__main__":
    llist = LinkedList()

    # Insert some elements
    llist.insert_at_end(1)
    llist.insert_at_end(2)
    llist.insert_at_beginning(0)
    llist.insert_at_end(3)

    print("Linked List:")
    llist.traverse()

    print(f"Length of the linked list: {llist.length()}")

    # Delete a node
    llist.delete_node(2)
    print("Linked List after deleting 2:")
    llist.traverse()

    print(f"New length of the linked list: {llist.length()}")
