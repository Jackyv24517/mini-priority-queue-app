<template>
    <v-container>
      <div class="pb-3">
        <h5>{{ `Welcome Back, ${userRole}!` }}</h5>
        <p>Kindly fill and create order below.</p>
      </div>
     
  
      <h3 class="mt-5 mb-2 pt-5">Create New Order</h3>
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
          :readonly="true"
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
        orderType: null,
        userRole: '',
      };
    },
    mounted() {
      this.userRole = this.$getUserRoleFromToken();
      console.log('User role:', this.userRole);
    },
    created() {
      this.setOrderTypeBasedOnUserRole();
    },
    methods: {
      setOrderTypeBasedOnUserRole() {
        const userRoles = this.$getUserRoleFromToken();
        
        // Set order type based on user role
        if (userRoles.includes('VIP')) {
          this.orderType = 'VIP';
        } else if (userRoles.includes('User')) {
          this.orderType = 'Normal';
        }
       
      },
      async createOrder() {
        try {
          // Assuming your API endpoint for creating an order is something like /api/orders
          const response = await this.$axios.post('/orders', {
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
  