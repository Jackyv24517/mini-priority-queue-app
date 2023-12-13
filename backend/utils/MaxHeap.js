class MaxHeap {
    constructor() {
      this.heap = [];
    }
  
    insert(element) {
      this.heap.push(element);
      this.bubbleUp();
    }
  
    bubbleUp() {
      let index = this.heap.length - 1;
      const element = this.heap[index];
  
      while (index > 0) {
        let parentIndex = Math.floor((index - 1) / 2);
        let parent = this.heap[parentIndex];
  
        if (this.compare(element, parent) <= 0) break;
  
        this.heap[parentIndex] = element;
        this.heap[index] = parent;
        index = parentIndex;
      }
    }
  
    extractMax() {
      const max = this.heap[0];
      const end = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = end;
        this.sinkDown();
      }
      return max;
    }
  
    sinkDown() {
      let index = 0;
      const length = this.heap.length;
      const element = this.heap[0];
  
      while (true) {
        let leftChildIndex = 2 * index + 1;
        let rightChildIndex = 2 * index + 2;
        let leftChild, rightChild;
        let swap = null;
  
        if (leftChildIndex < length) {
          leftChild = this.heap[leftChildIndex];
          if (this.compare(leftChild, element) > 0) {
            swap = leftChildIndex;
          }
        }
        if (rightChildIndex < length) {
          rightChild = this.heap[rightChildIndex];
          if (this.compare(rightChild, element) > 0 && 
              (swap === null || this.compare(rightChild, leftChild) > 0)) {
            swap = rightChildIndex;
          }
        }
  
        if (swap === null) break;
        this.heap[index] = this.heap[swap];
        this.heap[swap] = element;
        index = swap;
      }
    }

    compare(order1, order2) {
        if (order1.type === order2.type) {
            // If types are the same, compare based on timestamp
            return order2.createdAt - order1.createdAt;
        }
        // Give priority to VIP orders
        return order1.type === 'VIP' ? 1 : -1;
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

module.exports = MaxHeap;
