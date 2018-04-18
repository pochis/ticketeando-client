<template>
    <v-container grid-list-md>
        <v-layout row wrap>
         <v-flex xs12 md12>
          <v-toolbar  color="accent" height="45px">
              <v-toolbar-title class="title_toolbar">Notificaciones</v-toolbar-title>
          </v-toolbar>
        </v-flex>
        <v-flex xs12 md12 v-for="notification in notifications" :key="notification.id">
            <v-card>
                <v-card-title>
                    <div>
                      <span class="grey--text">TICK:{{notification.ticket.id}} - {{notification.ticket.title}}</span><br>
                      <span>{{notification.subject}}</span><br>
                      <span>{{notification.created_at | date}}</span>
                    </div>
                </v-card-title>
                 <v-card-actions>
                  <v-btn :to="{name: 'tickets-show-id', params: { id: notification.ticket_id }}">Ver</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn icon  @click.native="deleteItem(notification)">
                    <v-icon color="red">delete</v-icon>
                  </v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
        <v-flex xs3 md12 text-md-center>
          <v-btn 
            color="primary" 
            v-if="notifications.length < total" 
            @click="getMoreNotifications">
            Cargar notificaciones anteriores
          </v-btn>
          <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>
        </v-flex>
       </v-layout>
       <v-snackbar
          bottom
          left
          v-model="snackbar">
          {{ message }}
      </v-snackbar>
  </v-container>
</template>
<script>
    export default {
        middleware: 'granted',
        data:()=>({
            loading: true,
            snackbar: false,
            notifications: [],
            perPage: 10,
            page: 1,
            total: 0
        }),
        mounted(){
          this.getNotifications();
        },
        computed:{
            headers(){
            return {
              headers:{'Authorization': 'Bearer '+this.$store.state.auth.token},
              params:{
                user:this.$store.getters.loggedUser.id,
                sortBy:'id',
                sortType:'desc'
              }
            }
          },
        },
        methods:{
            getNotifications(){
                this.$axios.get('notifications/0/'+this.perPage,this.headers).then((res)=>{
                  this.loading=false;
                  this.notifications = res.data.notifications;
                  this.total= res.data.total
                }).catch((error)=>{
                  this.message=error.response.data.message
                })
            },
            getMoreNotifications(){
                let offset = (this.page * this.perPage);
                this.loading=true;
                this.$axios.get('notifications/'+offset+'/'+this.perPage,this.headers).then((res)=>{
                  this.notifications = this.notifications.concat(res.data.notifications);
                  this.total= res.data.total
                  this.loading=false;
                  this.page++;
                }).catch((error)=>{
                  this.loadMore=false;
                  this.message=error.response.message
                })
          },
          deleteItem(item){
            const index = this.notifications.indexOf(item)
            let conf = confirm('¿Esta seguro de aplicar esta acción?');
            if(conf){
              this.loading =true;
              this.$axios.delete('notification/'+item.id,this.headers).then((res)=>{
                this.message = res.data.message;
                this.snackbar=true;
                this.loading =false;
                this.notifications.splice(index, 1);
              }).catch((error)=>{
                this.message = error.response.data.message;
                this.snackbar=true;
                this.loading =false;
              });
            }
          }
        },
        head () {
          return {
            title:  'Notificaciones' ,
            meta: [
              { hid: 'description', name: 'description', content: 'ticketeando contro de soporte para mesa de ayuda' }
            ]
          }
        }
    }
</script>
<style scoped>
  .list{
    list-style: none;
  }
</style>