<template>
    <v-container>
      <h2>Pending Orders</h2>
      <v-list>
        <v-list-item 
          v-for="order in pendingOrders" 
          :key="order.id"
        >
          {{ order.details }} - {{ order.type }}
        </v-list-item>
      </v-list>
  
      <h2>Completed Orders</h2>
      <v-list>
        <v-list-item 
          v-for="order in completedOrders" 
          :key="order.id"
        >
          {{ order.details }} - {{ order.type }}
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
    mounted() {
      // Fetch orders from the backend and populate pendingOrders and completedOrders

      // mock template, needed to replace with actual API call
      this.pendingOrders = [
        { id: 1, details: 'Pizza', type: 'Normal' },
        { id: 2, details: 'Burger', type: 'VIP' }
      ];
      this.completedOrders = [
        { id: 3, details: 'Sushi', type: 'Normal' }
      ];
    }
  };
  </script>
  