<template>
    <v-container  grid-list-md>
    <v-layout row wrap>
     <v-flex xs12 md12 class="mt-5">
      <v-card>
          <v-card-title>
            <h1 v-if="error.statusCode === 404">Pagina no encontrada</h1>
            <h1 v-if="error.statusCode === 403">Permisos requeridos</h1>
          </v-card-title>
          <v-card-text>
              <p>{{error.message}}</p>
              <nuxt-link to="/dashboard">Panel de control</nuxt-link>
          </v-card-text>
      </v-card>
    </v-flex>
   </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ['error'],
  layout: 'blog' // you can set a custom layout for the error page
}
</script>