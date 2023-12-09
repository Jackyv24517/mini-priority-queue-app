<template>
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
          // const response = await axios.post('http://your-backend-url/api/login', this.loginDetails);
          const { token, role } = response.data;
  
          // Handle successful login here
          
          // Save the token, perhaps in localStorage or a cookie
          localStorage.setItem('userToken', token);
  
          // Redirect user based on role
          this.$router.push(role === 'manager' ? '/manager-dashboard' : '/');
  
        } catch (error) {
          // Handle errors here
          this.error = 'Invalid username or password';
        }
      }
    }
  };
  </script>
  
  
  <style scoped>
  /* Add any specific styling for your login page here */
  </style>
  