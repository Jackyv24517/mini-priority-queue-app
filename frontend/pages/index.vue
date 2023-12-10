<template>
  <v-container>
    <!-- Content for Admin or Manager -->
    <AdminComponent v-if="userRole === 'Admin'" />

    <!-- Order Content specifically for VIP or Normal users -->
    <NewOrderComponent v-if="userRole === 'VIP' || userRole === 'Normal'" />

    <!-- Fallback content for other roles or unauthenticated users -->
    <DefaultUserComponent v-else />

  </v-container>
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
      userRole: null // This should be set based on the authenticated user's role
    };
  },
  methods: {
    getUserRoleFromToken(){
      const token = localStorage.getItem('userToken');

      if (token) {
        const decoded = jwtDecode(token);
        console.log("role: ", decoded);
        return decoded.role; // assuming the role is stored under the key 'role'
      }
      return null;
    },
  },
  mounted() {
    // Logic to determine and set the user's role
    this.userRole = this.getUserRoleFromToken();
  }
};
</script>
