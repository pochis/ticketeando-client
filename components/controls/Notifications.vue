<template>
    <div>
      <v-menu
        transition="slide-y-transition"
        :close-on-content-click="false"
        bottom>
      <v-btn icon class="icons" slot="activator">
        <v-badge color="error" overlap>
          <span v-if="$store.state.totalNotifications" slot="badge">{{$store.state.totalNotifications}}</span>
          <v-icon>{{($store.state.hasNotification ? 'notifications_active':'notifications')}}</v-icon>
        </v-badge>
      </v-btn>
      <v-list>
        <v-list-tile @click="refresh">
          <v-list-tile-title><v-icon>refresh</v-icon> Refrescar</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="loading">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-list-tile>
        <v-list-tile :to="{name: 'tickets-show-id', params: { id: notification.ticket_id },query:{ read: notification.id }}" v-for="notification in $store.getters.getNotifications" :key="notification.id">
          <v-list-tile-title>{{notification.subject}}</v-list-tile-title>
        </v-list-tile>
      </v-list>
      <v-divider v-if="$store.state.totalNotifications"></v-divider>
      <v-list>
        <v-list-tile :to="{name:'notification-user-id',params:{id:$store.getters.loggedUser.id}}">
          <v-list-tile-title class="primary--text text-xs-center">Ver todas las notificaciones</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-snackbar
        bottom
        left
        v-model="snackbar">
        {{ message }}
    </v-snackbar>
    </div>
</template>
<script>
    export default{
         data:()=>({
            loading: true,
            snackbar: false,
            message: '',
        }),
        mounted(){
          this.getNotifications();
        },
        computed:{
          headers(){
            return {
              headers:{'Authorization': 'Bearer '+this.$store.state.auth.token},
              params:{
                read:0,
                user:this.$store.getters.loggedUser.id,
                sortBy:'id',
                sortType:'desc'
              }
            }
          },
        },
        methods:{
         async getNotifications(){
            try {
                this.loading=true;   
                await this.$store.dispatch('getNotifications',this.headers);
                this.loading=false;
              }catch (e) {
                this.message = e;
                this.snackbar = true;
                this.loading=false
              }
          },
          refresh() {
            this.getNotifications();
          }
        }
    }
</script>
<style scoped>
    .icons{
      color:#BCAAA4;
    }
</style>