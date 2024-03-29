<template>
 <v-app data-app>
  
  <v-container>
    <v-app-bar class="mb-5">
      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <!-- Display the user role as a chip/tag -->
    <v-chip
      v-if="isLoggedIn"
      class="p-3 m-3"
      :color="chipColor"
      text-color="white"
    >
      {{ userRoles[0] }}
    </v-chip>
    <v-spacer></v-spacer>

    <!-- Login and Register buttons -->
    <template v-if="!isLoggedIn">
      <v-btn text @click="goToLogin">Login</v-btn>
      <v-btn text @click="goToRegister">Register</v-btn>
    </template>

    <!-- Logout Button, shown only if the user is logged in -->
    <v-btn text v-if="isLoggedIn" @click="logout">Logout</v-btn>
  </v-app-bar>
    <!-- Content for Admin -->
    <AdminComponent v-if="userRoles.includes('Admin')" />

    <!-- Order Content specifically for VIP or Normal users -->
    <NewOrderComponent v-else-if="userRoles.includes('VIP') || userRoles.includes('User')" />

    <!-- Fallback content for other roles or unauthenticated users -->
    <DefaultUserComponent v-else />

  </v-container>
</v-app>
</template>

<script>
import NewOrderComponent from '@/components/NewOrderComponent';
import AdminComponent from '@/components/AdminComponent';
import DefaultUserComponent from '@/components/DefaultUserComponent';

import jwtDecode from 'jwt-decode';

export default {
  components: {
    NewOrderComponent,
    AdminComponent,
    DefaultUserComponent,
    jwtDecode,
  },
  data() {
    return {
      userRoles: [], // This should be set based on the authenticated user's role
      title: "Order Apps"
    };
  },
  computed: {
    isLoggedIn() {
      // Check if the user is logged in (e.g., check if a token exists)
      return !!localStorage.getItem('userToken');
    },
    chipColor() {
      // Return different colors based on the role
      return this.userRoles.includes('Admin') ? 'brown' : this.userRoles.includes('VIP') ? 'purple' : 'blue';
    }
  },
  methods: {
    getUserRoleFromToken(){
      const token = localStorage.getItem('userToken');

      if (token) {
        const decoded = jwtDecode(token);
        console.log("roles: ", decoded);
        return decoded.roles; // assuming the role is stored under the key 'role'
      }
      return null;
    },
    setUserRoles() {
      const token = localStorage.getItem('userToken');
      if (token) {
        const decoded = jwtDecode(token);
        console.log("roles: ", decoded);
        this.userRoles = decoded.roles || []; // Adjust based on your token's payload structure
      }
    },
    logout() {
      // Clear the token or user data from storage
      localStorage.removeItem('userToken');
      
      // If using Vuex, reset user state
      this.$store.commit('RESET_USER_STATE');
      
      // Redirect to login or home page
      this.$router.push('/login');
    },
    goToLogin() {
      this.$router.push('/login');
    },
    goToRegister() {
      this.$router.push('/register');
    }
  },
  mounted() {
    // Logic to determine and set the user's role
    //this.userRole = this.getUserRoleFromToken();

    // Retrieve the user roles from the decoded token
    this.setUserRoles();
  }
};
</script>
