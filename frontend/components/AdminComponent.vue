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
      <v-data-table :headers="headers" :items="bots" class="elevation-1 mt-5">
        <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)">
            {{ item.status }}
            </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-btn icon @click="removeBot(item.botId)">
            <v-icon>mdi-delete</v-icon>
            </v-btn>
        </template>
    </v-data-table>
    </v-container>

  </template>
  
  <script>
  export default {
    data() {
        return {
            bots: [], // store bot data
            headers: [
                { text: 'Bot ID', value: 'botId' },
                { text: 'Status', value: 'status' },
                { text: 'Actions', value: 'actions', sortable: false }
            ]
        };
    },
    mounted() {
        this.fetchBots();
    },
    methods: {
        async fetchBots() {
            // API call to get bots
            try {
                const response = await this.$axios.get('/api/bots');
                this.bots = response.data;
            } catch (error) {
                console.error('Error fetching bots:', error);
            }
        },
        async addBot() {
            // API call to add a bot
            try {
                const response = await this.$axios.post('/api/bots', { /* bot details */ });
                this.bots.push(response.data);
            } catch (error) {
                console.error('Error adding bot:', error);
            }
        },
        async removeBot(botId) {
            // API call to remove a bot
            try {
                await this.$axios.delete(`/api/bots/${botId}`);
                this.bots = this.bots.filter(bot => bot._id !== botId);
            } catch (error) {
                console.error('Error removing bot:', error);
            }
        },
        getStatusColor(status) {
            return status === 'PROCESSING' ? 'red' : 'green';
        }
    }
  };
  </script>
  