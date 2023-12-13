<template>
  <v-container>
    <v-row>
      <!-- Pending Orders Column -->
      <v-col cols="12" md="6">
        <h2>Pending Orders</h2>
        <v-list>
          <v-list-item 
            v-for="order in pendingOrders" 
            :key="order.orderId"
          >
            Order #{{ order.orderId }} - {{ order.type }} - {{ humanReadableDateTime(order.createdAt) }}
          </v-list-item>
        </v-list>
      </v-col>

      <!-- Completed Orders Column -->
      <v-col cols="12" md="6">
        <h2>Completed Orders</h2>
        <v-list>
          <v-list-item 
            v-for="order in completedOrders" 
            :key="order.orderId"
          >
            Order #{{ order.orderId }} - {{ order.type }} - {{ humanReadableDateTime(order.createdAt) }}
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      pendingOrders: [],
      completedOrders: [],
      socket: null,
    };
  },
  methods: {
    async fetchOrders() {
    try {
      // Fetch initial order data from the REST API
      const response = await this.$axios.get('/orders');
      const orders = response.data;
      
      console.log("All orders: " , orders);

      this.pendingOrders = orders.filter(order => order.status === 'PENDING');
      this.completedOrders = orders.filter(order => order.status === 'COMPLETED');
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Handle error appropriately
    }
  },
  updateOrderList(updatedOrder) {
    // Remove the order from its current list
    if (updatedOrder.oldStatus === 'PENDING') {
      this.pendingOrders = this.pendingOrders.filter(order => order.orderId !== updatedOrder.orderId);
      this.completedOrders = this.completedOrders.filter(order => order.orderId !== updatedOrder.orderId);
    } else if (updatedOrder.oldStatus === 'COMPLETED') {
      this.pendingOrders = this.pendingOrders.filter(order => order.orderId !== updatedOrder.orderId);
      this.completedOrders = this.completedOrders.filter(order => order.orderId !== updatedOrder.orderId);
    }

    // Add the order to the appropriate list based on its new status
    if (updatedOrder.status === 'PENDING') {
      this.pendingOrders.push(updatedOrder);
    } else if (updatedOrder.status === 'COMPLETED') {
      this.completedOrders.push(updatedOrder);
    }
  },
  humanReadableDateTime(timestamp){
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-MY") + ' ' + date.toLocaleTimeString("en-MY")
  }
  /*
    handleOrderUpdate(updatedOrder) {
      // Logic to handle an updated order
      // Add to completedOrders if status is 'COMPLETE', else to pendingOrders
      if (updatedOrder.status === 'COMPLETE') {
        this.completedOrders.push(updatedOrder);
      } else {
        this.pendingOrders.push(updatedOrder);
      }
    }
  */
  },
  created() {
    this.fetchOrders();

    // Initialize WebSocket connection
    this.socket = io('http://localhost:4200');
    this.socket.on('orderUpdate', (updatedOrder) => {
      this.updateOrderList(updatedOrder);
      //this.handleOrderUpdate(updatedOrder);
    });
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
</script>
