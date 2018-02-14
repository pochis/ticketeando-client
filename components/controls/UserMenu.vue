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
              <v-list-tile-title>John Leider</v-list-tile-title>
              <v-list-tile-sub-title>Founder of Vuetify.js</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-tile @click="">
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
          <v-list-tile @click="">
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
        })
    }
</script>