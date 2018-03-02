<template>
    <v-container grid-list-md>
      <v-layout column>
        <v-text-field
          label="Agregar comentario"
          multi-line
          v-model="comment"
        ></v-text-field>
        
        <v-list two-line>
            <v-subheader>Comentarios</v-subheader>
            <v-divider ></v-divider>
            <v-list-tile avatar  @click="">
              <v-list-tile-avatar>
                <img src="aca_la_imagen" alt="aca la imagen">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>Fecha</v-list-tile-title>
                <v-list-tile-sub-title><span class='text--primary'>Nombre usuario</span> - Contenido</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
        </v-list>
        <v-list two-line>
            <v-divider ></v-divider>
            <v-list-tile avatar  @click="">
              <v-list-tile-avatar>
                <img src="aca_la_imagen" alt="aca la imagen">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>Fecha</v-list-tile-title>
                <v-list-tile-sub-title><span class='text--primary'>Nombre usuario</span> - Contenido</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
        </v-list>
      </v-layout>
    </v-container>
</template>
<script>
    export default {
        porps:['relatedId'],
        data:()=>({
            comment:'',
            
        })
    }
</script>