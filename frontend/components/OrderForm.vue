<template>
    <v-container>
      <v-form @submit.prevent="submitOrder">
        <v-text-field
          label="Order Details"
          v-model="orderDetails"
          required
        ></v-text-field>
  
        <v-select
          :items="['Normal', 'VIP']"
          label="Order Type"
          v-model="orderType"
          required
        ></v-select>
  
        <v-btn type="submit" color="primary">Submit Order</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        orderDetails: '',
        orderType: ''
      };
    },
    methods: {
      async submitOrder() {
        // API call here

        // order body
        const order = {
          details: this.orderDetails,
          type: this.orderType,
          status: 'PENDING'
        };
  
        console.log('Order submitted:', order);
        // Reset form
        this.orderDetails = '';
        this.orderType = '';
      }
    }
  };
  </script>  