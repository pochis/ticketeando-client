<template>
<div>
    <v-menu
      offset-x
      :close-on-content-click="false"
      :nudge-width="200"
      v-model="menu">
    <v-avatar :tile=false size="35px"class="grey lighten-4" slot="activator">
        <img src="/v.png" alt="username" title="username">
    </v-avatar>
     <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="/v.png" alt="username" title="username">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{user.name +' '+user.lastname}}</v-list-tile-title>
              <v-list-tile-sub-title>Founder of Vuetify.js</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-tile @click="" to="/user/profile">
            <v-list-tile-action>
              <v-icon>person</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Perfil</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>description</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Documentación</v-list-tile-title>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile @click="logout()">
            <v-list-tile-action>
              <v-icon>power_settings_new</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Cerrar sesión</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-menu>
</div>
</template>
<script>
    export default {
        data: () => ({
          menu: false,
          message: false,
          hints: true
        }),
        computed:{
          user(){
            return this.$store.getters.loggedUser;
          }
        },
        methods:{
          async logout(){
            let $_this=this;
            
            try{
             await  $_this.$store.dispatch('logout',{userId:$_this.user.id});
              $_this.$router.push('/login')
              
            }catch(e){
              console.log(e);
            }
            
          }
        }
    }
</script>