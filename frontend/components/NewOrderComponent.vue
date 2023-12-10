<template>
    <v-container>
      <h3>Create New Order</h3>
      <v-form @submit.prevent="createOrder">
        <v-text-field
          label="Order Details"
          v-model="orderDetails"
          required
        ></v-text-field>
  
        <v-select
          label="Order Type"
          :items="['Normal', 'VIP']"
          v-model="orderType"
          required
        ></v-select>
  
        <v-btn type="submit" color="primary">Create Order</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        orderDetails: '',
        orderType: null
      };
    },
    methods: {
      async createOrder() {
        try {
          // Assuming your API endpoint for creating an order is something like /api/orders
          const response = await this.$axios.post('/api/orders', {
            details: this.orderDetails,
            type: this.orderType
          });
  
          // Handle the response - perhaps clear the form or show a success message
          console.log('Order created:', response.data);
          this.orderDetails = '';
          this.orderType = null;
  
          // Emit an event if you need to update the parent component
          this.$emit('orderCreated');
        } catch (error) {
          console.error('Error creating order:', error.response.data);
          // Handle the error - show an error message to the user
        }
      }
    }
  };
  </script>
  