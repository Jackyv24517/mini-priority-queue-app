<template>
    <nav>
      <!-- Your existing navbar content -->
  
      <!-- Logout Button -->
      <v-btn @click="logout">Logout</v-btn>
    </nav>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        // Clear the token or user data from storage
        localStorage.removeItem('userToken');
        
        // If using Vuex, reset user state
        this.$store.commit('RESET_USER_STATE');
        
        // Redirect to login or home page
        this.$router.push('/login');
      }
    }
  };
  </script>
  