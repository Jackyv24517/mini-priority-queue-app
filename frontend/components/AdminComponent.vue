<template>
    <v-container>
        <div class="mb-5 pb-3">
            <h3>Admin Dashboard</h3>
            <p>Manage and assign bots to process orders.</p>
        </div>
      <!-- Additional controls for managing bots -->
      <!--
      <v-btn @click="assignBot">Assign Bot</v-btn>
      -->
      <v-btn @click="addBot">Add Bot</v-btn>
      <v-btn @click="removeBot" color="error">Delete Bot</v-btn>

      <!-- Bot Management Table -->
      <v-data-table :headers="botHeaders" :items="bots" class="elevation-1 mt-5">
        <template v-slot:item.status="{ item }">
            <v-chip :color="getBotStatusColor(item.status)">
            {{ item.status }}
            </v-chip>
        </template>

        <!--
            <template v-slot:item.actions="{ item }">
                <v-btn icon @click="removeBot(item.botId)">
                <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        -->
    </v-data-table>

    <!-- Bot Order Processing Table -->
    <div class="pt-5 mt-5">
    <h6>Order Processing Status</h6>
    <v-data-table :headers="botOrderHeaders" :items="orders" class="elevation-1">
        <template v-slot:item.bot="{ item }">
        {{ item.botId ? `Bot ${item.botId}` : 'Unassigned' }}
        </template>
    </v-data-table>
    </div>
    <!-- Snackbar prompt -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      color="success"
      top
    >
      {{ snackbarMessage }}
      <v-btn color="white" text @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>
    </v-container>

  </template>
  
  <script>
  export default {
    data() {
        return {
            bots: [], // store bot data
            orders: [], // Array of orders
            botHeaders: [
                { text: 'Bot ID', value: 'botId' },
                { text: 'Status', value: 'status' },
                //{ text: 'Actions', value: 'actions', sortable: false }
            ],
            botOrderHeaders: [
            { text: 'Order ID', value: 'orderId' },
            { text: 'Status', value: 'status' },
            { text: 'Bot Handling', value: 'botId' }
            ],
            showSnackbar: false,
            snackbarMessage: '',
        };
    },
    mounted() {
        this.fetchBots();
        this.fetchOrders(); // Fetch orders
    },
    methods: {
        async fetchOrders() {
            try {
                const response = await this.$axios.get('/orders');
                this.orders = response.data;
                console.log("Orders Data: ", this.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        },
        async fetchBots() {
            // API call to get bots
            try {
                const response = await this.$axios.get('/bots');
                this.bots = response.data;
                console.log("Bots Data: ", this.bots);
            } catch (error) {
                console.error('Error fetching bots:', error);
            }
        },
        async addBot() {
            // API call to add a bot
            try {
                const response = await this.$axios.post('/bots');
                this.bots.push(response.data);
            } catch (error) {
                console.error('Error adding bot:', error);
            }
        },
        async removeBot(){
            // API call to remove latest bot
            try {
                const response = await this.$axios.delete('/bots/newest');
                console.log(response.data.message);

                this.snackbarMessage = 'Bot successfully removed';
                this.showSnackbar = true;

                // Fetch updated bots & orders list to handle UI update
                this.refreshBotTable();
                this.refreshOrderTable();
            } catch (error) {
                console.error('Error deleting newest bot:', error);
            }
        },

        /*
        //old remove latest Bot logic handled by frontend
        async removeBot(botId) {
            // API call to remove a bot
            try {
                await this.$axios.delete(`/bots/${botId}`);
                this.bots = this.bots.filter(bot => bot._id !== botId);

                this.snackbarMessage = 'Bot successfully removed';
                this.showSnackbar = true;

                this.refreshBotTable(); // Call method to refresh the bot table
            } catch (error) {
                console.error('Error removing bot:', error);
            }
        },
        removeLatestBot() {
            // This assumes bots are sorted such that the latest is last in the array
            if (this.bots.length > 0) {
                const latestBotId = this.bots[this.bots.length - 1].botId;
                this.removeBot(latestBotId);
            }
        
        },*/
        getStatusColor(status) {
            return status === 'PROCESSING' ? 'red' : 'green';
        },
        getBotStatusColor(status) {
            return status === 'BUSY' ? 'red' : 'green';
        },
        refreshBotTable() {
            this.fetchBots(); // re-fetch bot data
        },
        refreshOrderTable() {
            this.fetchOrders(); // re-fetch order data
        },
    }
  };
  </script>
  