<template>
    <v-layout row wrap>
     <v-flex xs12 md12>
      <v-toolbar  color="accent" height="45px">
          <v-toolbar-title class="title_toolbar">Proyectos</v-toolbar-title>
          <v-spacer></v-spacer>
            <v-btn icon to="/projects/new" title="Agregar Proyecto">
              <v-icon>location_city</v-icon>
            </v-btn>
      </v-toolbar>
      <ProjectDataTable/>
    </v-flex>
   </v-layout>
</template>
<script>
    import ProjectDataTable from '~/components/controls/ProjectDataTable'
    export default {
        components:{
            ProjectDataTable
        },
        head () {
          return {
            title:  'Proyectos',
            meta: [
              { hid: 'description', name: 'description', content: 'Lista de proyectos' }
            ]
          }
        }
    }
</script>