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
  
        if (element.priority <= parent.priority) break;
  
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
          if (leftChild.priority > element.priority) {
            swap = leftChildIndex;
          }
        }
        if (rightChildIndex < length) {
          rightChild = this.heap[rightChildIndex];
          if (
            (swap === null && rightChild.priority > element.priority) ||
            (swap !== null && rightChild.priority > leftChild.priority)
          ) {
            swap = rightChildIndex;
          }
        }
  
        if (swap === null) break;
        this.heap[index] = this.heap[swap];
        this.heap[swap] = element;
        index = swap;
      }
    }
  }

  /*
    Description on logic handling:
    For any given node I, the value of I is greater than or equal to the values of its children (in a max heap).
   */

  module.exports = MaxHeap;
  