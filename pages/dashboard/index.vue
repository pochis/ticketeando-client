<template>
  <v-container  grid-list-md>
    <v-layout row wrap>
    <v-flex xs12 md4>
        <v-card color="cyan darken-2" class="white--text">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs7>
                <div>
                  <div class="headline">Proyectos</div>
                  <div>0</div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
    </v-flex>
    <v-flex xs12 md4>
        <v-card color="cyan darken-2" class="white--text">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs7>
                <div>
                  <div class="headline">Mis tickets</div>
                  <div>0</div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
    </v-flex>
    <v-flex xs12 md4>
      <v-card color="cyan darken-2" class="white--text">
        <v-container fluid grid-list-lg>
          <v-layout row>
            <v-flex xs7>
              <div>
                <div class="headline">Tickets abiertos</div>
                <div>0</div>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
    <v-flex xs12 md12 class="mt-5">
      <v-toolbar  color="accent" height="45px">
          <v-toolbar-title class="title_toolbar">Ultimos tickets</v-toolbar-title>
      </v-toolbar>
      <v-data-table
          :headers="headers"
          :items="items"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.code }}</td>
            <td class="text-xs-right">{{ props.item.title }}</td>
            <td class="text-xs-right">{{ props.item.status }}</td>
          </template>
          <template slot="no-data">
            <v-alert :value="true" color="info" icon="info">
              no se encontraron resultados
            </v-alert>
          </template>
        </v-data-table>
    </v-flex>
  </v-layout>
  </v-container>
  
</template>

<script>

export default {
    middleware: 'guard',
    
    data:()=>({
      title:'Panel de control',
      headers: [
          {
            text: 'Numero',
            align: 'left',
            value: 'code'
          },
          { text: 'Titulo', value: 'title' },
          { text: 'Estado', value: 'status' },
        ],
        items: [
          {
            value: false,
            code: 'TICK:'+1,
            title: 'prueba 1',
            status: 'Abierto'
          },
          {
            value: false,
            code: 'TICK:'+2,
            title: 'prueba 2',
            status: 'Abierto'
          },
          {
            value: false,
            code: 'TICK:'+3,
            title: 'prueba 3',
            status: 'Cerrado'
          },
          {
            value: false,
            code: 'TICK:'+4,
            title: 'prueba 4',
            status: 'Rechazado'
          },
          {
            value: false,
            code: 'TICK:'+5,
            title: 'prueba 5',
            status: 'Recibido'
          },
        ],
      datatable: {
        
      }
      
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
