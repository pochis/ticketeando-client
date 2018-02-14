<template>
    <nav>
      <v-navigation-drawer
          fixed
          clipped
          v-model="drawer"
          :mini-variant="mini"
          class="nav"
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
            <img src="https://randomuser.me/api/portraits/men/85.jpg" >
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Andres Arbelaez Acevedo</v-list-tile-title>
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
        <v-list-tile v-for="menu in menuItems" :key="menu.title">
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
            <v-btn icon class="icons">
                <v-badge color="accent" overlap>
                  <span slot="badge">6</span>
                      <v-icon>{{(hasNotification ? 'notifications_active':'notifications')}}</v-icon>
                </v-badge>
            </v-btn>
            <UserMenu/>
        </v-toolbar>
    </nav>
</template>
<script>
import UserMenu from '~/components/controls/UserMenu.vue';

    export default{
        data(){
            return {
                hasNotification:false,
                drawer: true,
                menuItems: [
                  { title: 'Inicio', icon: 'dashboard' },
                  { title: 'Mis tickets', icon: 'bug_report' }
                ],
                mini: false,
            }
        },
        components:{
          UserMenu
        }
    }
</script>
<style scoped>
    .nav{
      background-color:#f8f8f8;
    }
    .icons{
      color:#BCAAA4;
    }
</style>