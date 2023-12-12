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
            Order #{{ order.orderId }} - {{ order.type }}
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
            Order #{{ order.orderId }} - {{ order.type }}
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
      // Existing fetch logic...
    },
    handleOrderUpdate(updatedOrder) {
      // Logic to handle an updated order
      // Add to completedOrders if status is 'COMPLETE', else to pendingOrders
      if (updatedOrder.status === 'COMPLETE') {
        this.completedOrders.push(updatedOrder);
      } else {
        this.pendingOrders.push(updatedOrder);
      }
    }
  },
  created() {
    this.fetchOrders();

    // Initialize WebSocket connection
    this.socket = io('http://localhost:3000'); // Replace with your server URL
    this.socket.on('orderUpdate', (order) => {
      this.handleOrderUpdate(order);
    });
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
</script>
