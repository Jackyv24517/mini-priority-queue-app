import jwtDecode from 'jwt-decode';

export default ({ app }, inject) => {
  app.getUserRoleFromToken = () => {
    const token = localStorage.getItem('userToken');
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.roles; // Adjust based on your token's payload structure
    }
    return null;
  };

  // You can also inject the method to make it available in the context, Vue instances, even in Vuex
  inject('getUserRoleFromToken', app.getUserRoleFromToken);
};
