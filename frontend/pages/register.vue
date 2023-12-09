<template>
    <v-app data-app>
        <v-container>
        <v-card>
            <v-card-title>Register</v-card-title>
            <v-card-text>
            <v-form @submit.prevent="registerUser">
                <v-text-field
                label="Username"
                v-model="username"
                :rules="[rules.required]"
                required
                ></v-text-field>
    
                <v-text-field
                label="Password"
                type="password"
                v-model="password"
                :rules="[rules.required]"
                required
                ></v-text-field>
    
                <v-select
                label="Role"
                :items="roles"
                v-model="role"
                :rules="[rules.required]"
                required
                ></v-select>
    
                <v-btn type="submit" color="primary">Register</v-btn>
            </v-form>
            </v-card-text>
            <v-card-actions>
            <v-btn text @click="gotoLogin">Already have an account? Login</v-btn>
            </v-card-actions>
        </v-card>
        </v-container>
    </v-app>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        role: '',
        roles: ['User', 'Manager', 'Admin'], // Add or modify roles as necessary
        rules: {
          required: value => !!value || 'Required.',
        },
      };
    },
    methods: {
      registerUser() {
        // Implement the registration logic here
        // Make sure to include the 'role' in the data sent to the backend
      },
      gotoLogin() {
        this.$router.push('/login');
      }
    }
  };
  </script>
  