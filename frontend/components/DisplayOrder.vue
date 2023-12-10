<template>
  <v-container>
    <h2>Pending Orders</h2>
    <v-list>
      <v-list-item 
        v-for="order in pendingOrders" 
        :key="order.orderId"
      >
        Order #{{ order.orderId }} - {{ order.type }}
      </v-list-item>
    </v-list>

    <h2>Completed Orders</h2>
    <v-list>
      <v-list-item 
        v-for="order in completedOrders" 
        :key="order.orderId"
      >
        Order #{{ order.orderId }} - {{ order.type }}
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      pendingOrders: [],
      completedOrders: []
    };
  },
  methods: {
    async fetchOrders() {
      try {
        // Replace with actual API call
        const response = await this.$axios.get('/orders');
        const orders = response.data;

        // Assuming the backend sends orders categorized by status
        this.pendingOrders = orders.filter(order => order.status === 'PENDING');
        this.completedOrders = orders.filter(order => order.status === 'COMPLETE');
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Handle error
      }
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
</script>
