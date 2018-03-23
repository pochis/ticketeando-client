<template>
    <div>
      <v-menu
        transition="slide-y-transition"
        bottom>
      <v-btn icon class="icons" slot="activator">
        <v-badge color="error" overlap>
          <span v-if="total" slot="badge">{{total}}</span>
          <v-icon>{{(hasNotification ? 'notifications_active':'notifications')}}</v-icon>
        </v-badge>
      </v-btn>
      <v-list>
        <v-list-tile :to="{name: 'tickets-show-id', params: { id: notification.ticket_id }}" v-for="notification in notifications" :key="notification.id">
          <v-list-tile-title>{{notification.subject}}</v-list-tile-title>
        </v-list-tile>
      </v-list>
      <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile to="/">
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
            hasNotification: false,
            loading: true,
            snackbar: false,
            message: '',
            notifications:[],
            total:0,
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
          getNotifications(){
            this.$axios.get('notifications/0/10',this.headers).then((res)=>{
              this.loading=false;
              this.notifications = res.data.notifications;
              this.total= res.data.total
              if(res.data.total > 0) this.hasNotification=true
            }).catch((error)=>{
              this.message=error.response.data.message
            })
          },
          read(id){
            this.$axios.put('notifications/'+id)
          }
        }
    }
</script>
<style scoped>
    .icons{
      color:#BCAAA4;
    }
</style>