<template>
    <div>
        <v-menu
          transition="slide-y-transition"
          bottom>
      
      <v-btn icon class="icons" slot="activator">
        <v-badge color="error" overlap>
          <span slot="badge">3</span>
              <v-icon>{{(hasNotification ? 'notifications_active':'notifications')}}</v-icon>
        </v-badge>
      </v-btn>
      <v-list>
        <v-list-tile @click="">
          <v-list-tile-title>Notificacion 1</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-title>Notificacion 2</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-title>Notificacion 3</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    </div>
</template>
<script>
    export default{
         data:()=>({
            hasNotification:false,
        }),
    }
</script>
<style scoped>
    .icons{
      color:#BCAAA4;
    }
</style>