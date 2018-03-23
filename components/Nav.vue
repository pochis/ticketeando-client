<template>
    <nav v-if="isAuthenticated">
      <v-navigation-drawer
          fixed
          v-model="drawer"
          :mini-variant="mini"
          class="nav elevation-0"
          width="240"
          app>
      <v-list>
        <v-list-tile avatar to="/dashboard">
          <v-list-tile-avatar>
            <img src="https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png" alt="ticketeando" title="ticketeando">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="black--text">Ticketeando</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list dense>
        <v-divider light></v-divider>
        <v-list-tile v-for="menu in menuItems" :key="menu.title" :title="menu.title" :to="menu.path" exact>
          <v-list-tile-action>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ menu.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list dense v-if="loggedUser.role_id==1">
      <v-divider></v-divider>
       <v-subheader>Menu administrador</v-subheader>
        <v-list-tile v-for="menu in adminMenuItems" :key="menu.title" :title="menu.title" :to="menu.path" exact>
          <v-list-tile-action>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ menu.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list>
        <v-list-tile v-if="mini" @click="mini = !mini">
          <v-list-tile-action>
            <v-icon>chevron_right</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile v-if="!mini" @click.stop="mini = !mini">
          <v-list-tile-action>
            <v-icon>chevron_left</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
        <v-toolbar height="45px" fixed  app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer" class="icons hidden-lg-and-up"></v-toolbar-side-icon>
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
                { title: 'Tickets', icon: 'bug_report', path:'/tickets'},
                { title: 'Mis Proyectos', icon: 'business', path:'/projects/list'}
              ],
              adminMenuItems: [
                { title: 'Usuarios', icon: 'person', path:'/user'},
                { title: 'Proyectos', icon: 'location_city', path:'/projects'},
                { title: 'Categorias', icon: 'assignment', path:'/category'},
                { title: 'Reporte de tickets', icon: 'bug_report', path:'/tickets/queue'},
                { title: 'APIs', icon: 'code', path:'/api'},
              ],
              mini: false,
              
        }),
        computed:{
          ...mapGetters(['isAuthenticated','loggedUser'])
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
    .link{
        color: #fff;
        text-decoration: none;
    }
</style>