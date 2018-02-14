<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
    aca el content
    </v-flex>
  </v-layout>
</template>

<script>

export default {
    data:()=>({
      title:'Panel de control'
    }),
    head () {
      return {
        title: this.title,
        meta: [
          { hid: 'description', name: 'description', content: 'ticketeando contro de soporte para mesa de ayuda' }
        ]
      }
    }
}
</script>
