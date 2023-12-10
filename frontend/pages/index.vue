<template>
  <div>
    <h1>Welcome to the Order App!</h1>
    <div v-if="userRole === 'User'">
      <!-- Content for regular users -->
      <p>{{ `Welcome Back, ${userRole}!` }}</p>
    </div>
    <div v-else-if="userRole === 'Manager'">
      <!-- Content for managers -->
      <p>{{ `Welcome Back, ${userRole}!` }}</p>
    </div>
    <div v-else-if="userRole === 'Admin'">
      <!-- Content for admins -->
      <p>{{ `Welcome Back, ${userRole}!` }}</p>
    </div>
    <div v-else>
      <!-- Content for guests or undefined roles -->
      <p>Undefined role</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userRole: '' // This should be set based on the authenticated user's role
    };
  },
  mounted() {
    // Logic to determine and set the user's role
    // This could be from a Vuex store, local storage, or directly from the JWT token
    this.userRole = 'User'; // Set this based on actual user role
  }
};
</script>
