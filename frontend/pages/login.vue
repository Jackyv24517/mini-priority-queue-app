<template>
    <v-app data-app>
    <v-container>
      <v-card>
        <v-card-title class="headline">Login</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitLogin">
            <v-text-field
              label="Username"
              v-model="loginDetails.username"
              required
            ></v-text-field>
            <v-text-field
              label="Password"
              type="password"
              v-model="loginDetails.password"
              required
            ></v-text-field>
            <v-btn type="submit" color="primary">Login</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>        
    </v-app>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        loginDetails: {
          username: '',
          password: ''
        },
        error: ''
      };
    },
    methods: {
        async submitLogin() {
            try {
                // Make an API call to the backend's login endpoint
                const response = await this.$axios.post('/auth/login', this.loginDetails);

                // Destructure the token and role from the response data
                const { token, role } = response.data;

                // Handle successful login
                // Save the token in localStorage
                localStorage.setItem('userToken', token);

                // Redirect user based on role
                this.$router.push(role === 'manager' ? '/manager-dashboard' : '/');

            } catch (error) {
                // Handle errors here
                // You can customize this error message based on the error response from your backend
                this.error = error.response && error.response.data ? error.response.data.message : 'Invalid username or password';
            }
        },
    }
  };
  </script>
  
  
  <style scoped>
  /* Add any specific styling for your login page here */
  </style>
  