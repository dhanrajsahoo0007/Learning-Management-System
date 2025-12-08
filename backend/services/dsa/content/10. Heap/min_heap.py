# min_heap.py


class MinHeap():
	def __init__(self, array):
		self.heap = array
		self.heapify()

    def heapify(self):
    	first_parent_id = (len(self.heap) - 2 )// 2
    	for current_idx in reversed(range(first_parent_id)):
    		self.sift_down(current_idx, len(self.heap)- 1)
    	return

	def sift_down(self, current_idx, end_idx):
		left_child_idx = current_idx*2 + 1
		while left_child_idx <= end_idx:
			right_child_idx = current_idx*2+2
			if not  right_child_idx <= end_idx:
				right_child_idx = -1
			if right_child_idx != -1 and self.heap[right_child_idx] < self.heap[left_child_idx]:
				idx_to_swap = right_child_idx
			else:
				idx_to_swap = left_child_idx
			if self.heap[idx_to_swap] < self.heap[current_idx]:
				self.swap(current_idx, idx_to_swap)
				current_idx = idx_to_swap
				left_child_idx = current_idx*2 + 1
			else:
				break
		return

	def sift_up(self, current_idx):
        parent_idx = (current_idx  - 1)// 2
        while current_idx > 0 and self.heap[current_idx] < self.heap[parent_idx]:
        	self.swap( current_idx, parent_idx)
        	current_idx = parent_idx
        	parent_idx = (current_idx - 1) // 2
		return

	def peek(self):
		if self.heap:
		    return self.heap[0]
		return None

	def insert(self, value):
		self.heap.append(value)
		self.sift_up(len(self.heap)-1)

	def remove(self):
		self.swap(0, len(self.heap)-1)
		value_to_remove = self.heap.pop()
		self.sift_down(0, len(self.heap)-1)
		return value_to_remove

	def swap(self, left_idx, right_idx):
		self.heap[left_idx], self.heap[right_idx] = self.heap[right_idx], self.heap[left_idx]

