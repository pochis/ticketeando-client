<template>
    <nav v-if="isAuthenticated">
      <v-navigation-drawer
          fixed
          clipped
          v-model="drawer"
          :mini-variant="mini"
          class="nav elevation-0"
          width="240"
          app>
      <v-list>
        <v-list-tile v-if="mini" @click="mini = !mini">
          <v-list-tile-action>
            <v-icon>chevron_right</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar>
            <img :src="(user.image) ? $store.state.assetUrl+'static/user/'+user.id+'/medium/'+user.image: $store.state.assetUrl+'static/user/default.png'" :alt="user.name" :title="user.name">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{user.name}}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click.stop="mini = !mini">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list dense>
        <v-divider light></v-divider>
        <v-list-tile v-for="menu in menuItems" :key="menu.title" :title="menu.title" :to="menu.path">
          <v-list-tile-action>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ menu.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
        <v-toolbar color="primary" height="45px" fixed clipped-left app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer" class="icons"></v-toolbar-side-icon>
            <v-toolbar-title class="white--text">Ticketeando</v-toolbar-title>
            <v-spacer></v-spacer>
            <Notifications/>
            <UserMenu/>
        </v-toolbar>
    </nav>
</template>
<script>
import UserMenu from '~/components/controls/UserMenu.vue';
import Notifications from '~/components/controls/Notifications.vue';
import { mapGetters } from 'vuex'

    export default{
        data:()=>({
              hasNotification:false,
              drawer: true,
              menuItems: [
                { title: 'Panel de control', icon: 'dashboard', path:'/dashboard'},
                { title: 'Mis tickets', icon: 'bug_report', path:'/tickets'}
              ],
              mini: true,
              
        }),
        
        computed:{
          user(){
            return this.$store.getters.loggedUser; 
          },
          ...mapGetters(['isAuthenticated'])
        },
        components:{
          UserMenu,
          Notifications
        }
    }
</script>
<style scoped>
    .nav{
      background-color:#f8f8f8;
    }
</style>