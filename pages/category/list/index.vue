<template>
    <v-layout row wrap>
     <v-flex xs12 md12>
      <v-toolbar  color="accent" height="45px">
          <v-toolbar-title class="title_toolbar">Categorias</v-toolbar-title>
          <v-spacer></v-spacer>
            <v-btn icon to="/category/new" title="Agregar Categoria">
              <v-icon>assignment</v-icon>
            </v-btn>
      </v-toolbar>
      <CategoryDataTable/>
    </v-flex>
   </v-layout>
</template>
<script>
    import CategoryDataTable from '~/components/controls/CategoryDataTable'
    export default {
        components:{
            CategoryDataTable
        },
        head () {
          return {
            title:  'Categorias',
            meta: [
              { hid: 'description', name: 'description', content: 'Lista de categorias' }
            ]
          }
        }
    }
</script>